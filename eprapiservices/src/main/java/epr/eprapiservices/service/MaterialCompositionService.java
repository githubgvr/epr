package epr.eprapiservices.service;

import epr.eprapiservices.entity.MaterialComposition;
import epr.eprapiservices.entity.Material;
import epr.eprapiservices.dao.repository.MaterialCompositionRepository;
import epr.eprapiservices.dao.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for MaterialComposition business logic
 */
@Service
@Transactional
public class MaterialCompositionService {

    @Autowired
    private MaterialCompositionRepository materialCompositionRepository;

    @Autowired
    private MaterialRepository materialRepository;

    /**
     * Get all active material compositions
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> getAllActiveCompositions() {
        return materialCompositionRepository.findAllActiveOrderBySortOrderAndName();
    }

    /**
     * Get material composition by ID
     */
    @Transactional(readOnly = true)
    public Optional<MaterialComposition> getCompositionById(Integer id) {
        return materialCompositionRepository.findByIdAndActive(id);
    }

    /**
     * Get compositions by material ID
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> getCompositionsByMaterialId(Integer materialId) {
        return materialCompositionRepository.findByMaterialIdAndActive(materialId);
    }

    /**
     * Search compositions by term
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> searchCompositions(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllActiveCompositions();
        }
        return materialCompositionRepository.searchByNameCodeOrDescription(searchTerm.trim());
    }

    /**
     * Get compositions by active status
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> getCompositionsByActiveStatus(Boolean isActive) {
        return materialCompositionRepository.findByActiveStatus(isActive);
    }

    /**
     * Create a new material composition
     */
    public MaterialComposition createComposition(MaterialComposition composition) {
        // Validate required fields
        validateComposition(composition, null);

        // Validate material exists
        validateMaterialExists(composition.getMaterialId());

        // Check for duplicate composition code
        if (materialCompositionRepository.existsByCompositionCodeAndActiveExcludingId(
                composition.getCompositionCode(), null)) {
            throw new RuntimeException("Composition code already exists: " + composition.getCompositionCode());
        }

        // Validate percentage range
        validatePercentageRange(composition.getMinPercentage(), composition.getMaxPercentage());

        // Set default values
        if (composition.getSortOrder() == null) {
            composition.setSortOrder(1);
        }
        composition.setIsActive(true);

        return materialCompositionRepository.save(composition);
    }

    /**
     * Update an existing material composition
     */
    public MaterialComposition updateComposition(Integer id, MaterialComposition compositionDetails) {
        Optional<MaterialComposition> existingCompositionOpt = materialCompositionRepository.findByIdAndActive(id);
        
        if (existingCompositionOpt.isPresent()) {
            MaterialComposition existingComposition = existingCompositionOpt.get();
            
            // Validate updated composition
            validateComposition(compositionDetails, id);

            // Validate material exists
            validateMaterialExists(compositionDetails.getMaterialId());

            // Check for duplicate composition code (excluding current record)
            if (materialCompositionRepository.existsByCompositionCodeAndActiveExcludingId(
                    compositionDetails.getCompositionCode(), id)) {
                throw new RuntimeException("Composition code already exists: " + compositionDetails.getCompositionCode());
            }

            // Validate percentage range
            validatePercentageRange(compositionDetails.getMinPercentage(), compositionDetails.getMaxPercentage());

            // Update fields
            existingComposition.setCompositionName(compositionDetails.getCompositionName());
            existingComposition.setCompositionCode(compositionDetails.getCompositionCode());
            existingComposition.setDescription(compositionDetails.getDescription());
            existingComposition.setMaterialId(compositionDetails.getMaterialId());
            existingComposition.setWeightKg(compositionDetails.getWeightKg());
            existingComposition.setMinPercentage(compositionDetails.getMinPercentage());
            existingComposition.setMaxPercentage(compositionDetails.getMaxPercentage());
            existingComposition.setSortOrder(compositionDetails.getSortOrder());
            existingComposition.setNotes(compositionDetails.getNotes());

            return materialCompositionRepository.save(existingComposition);
        } else {
            throw new RuntimeException("Material composition not found with id: " + id);
        }
    }

    /**
     * Delete a material composition (soft delete)
     */
    public void deleteComposition(Integer id) {
        Optional<MaterialComposition> compositionOpt = materialCompositionRepository.findByIdAndActive(id);
        
        if (compositionOpt.isPresent()) {
            MaterialComposition composition = compositionOpt.get();
            composition.setIsActive(false);
            materialCompositionRepository.save(composition);
        } else {
            throw new RuntimeException("Material composition not found with id: " + id);
        }
    }

    /**
     * Get count of active compositions
     */
    @Transactional(readOnly = true)
    public long getActiveCompositionsCount() {
        return materialCompositionRepository.countActiveCompositions();
    }

    /**
     * Get count of compositions by material
     */
    @Transactional(readOnly = true)
    public long getCompositionsCountByMaterial(Integer materialId) {
        return materialCompositionRepository.countByMaterialIdAndActive(materialId);
    }

    /**
     * Find compositions by weight range
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> findCompositionsByWeightRange(BigDecimal minWeight, BigDecimal maxWeight) {
        return materialCompositionRepository.findByWeightRange(minWeight, maxWeight);
    }

    /**
     * Find compositions by percentage overlap
     */
    @Transactional(readOnly = true)
    public List<MaterialComposition> findCompositionsByPercentageOverlap(BigDecimal minPercentage, BigDecimal maxPercentage) {
        return materialCompositionRepository.findByPercentageOverlap(minPercentage, maxPercentage);
    }

    // Private validation methods
    private void validateComposition(MaterialComposition composition, Integer excludeId) {
        if (composition.getCompositionName() == null || composition.getCompositionName().trim().isEmpty()) {
            throw new RuntimeException("Composition name is required");
        }
        if (composition.getCompositionCode() == null || composition.getCompositionCode().trim().isEmpty()) {
            throw new RuntimeException("Composition code is required");
        }
        if (composition.getMaterialId() == null) {
            throw new RuntimeException("Material ID is required");
        }
        if (composition.getWeightKg() == null || composition.getWeightKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Weight must be greater than 0");
        }
        if (composition.getMinPercentage() == null) {
            throw new RuntimeException("Minimum percentage is required");
        }
        if (composition.getMaxPercentage() == null) {
            throw new RuntimeException("Maximum percentage is required");
        }
    }

    private void validateMaterialExists(Integer materialId) {
        Optional<Material> material = materialRepository.findById(materialId);
        if (material.isEmpty() || !material.get().getIsActive()) {
            throw new RuntimeException("Material not found or inactive with id: " + materialId);
        }
    }

    private void validatePercentageRange(BigDecimal minPercentage, BigDecimal maxPercentage) {
        if (minPercentage.compareTo(BigDecimal.ZERO) < 0 || minPercentage.compareTo(new BigDecimal("100")) > 0) {
            throw new RuntimeException("Minimum percentage must be between 0 and 100");
        }
        if (maxPercentage.compareTo(BigDecimal.ZERO) < 0 || maxPercentage.compareTo(new BigDecimal("100")) > 0) {
            throw new RuntimeException("Maximum percentage must be between 0 and 100");
        }
        if (minPercentage.compareTo(maxPercentage) > 0) {
            throw new RuntimeException("Minimum percentage cannot be greater than maximum percentage");
        }
    }
}
