package epr.eprapiservices.service;

import epr.eprapiservices.entity.Material;
import epr.eprapiservices.dao.repository.MaterialRepository;
import epr.eprapiservices.dao.repository.MaterialTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MaterialTypeRepository materialTypeRepository;

    /**
     * Get all active materials with their material type information
     */
    @Transactional(readOnly = true)
    public List<Material> getAllMaterials() {
        return materialRepository.findAllActiveMaterialsWithType();
    }

    /**
     * Get material by ID with material type information
     */
    @Transactional(readOnly = true)
    public Optional<Material> getMaterialById(Integer id) {
        return materialRepository.findByIdWithType(id);
    }

    /**
     * Get material by material code
     */
    @Transactional(readOnly = true)
    public Optional<Material> getMaterialByCode(String materialCode) {
        return materialRepository.findByMaterialCode(materialCode);
    }

    /**
     * Get materials by material type ID
     */
    @Transactional(readOnly = true)
    public List<Material> getMaterialsByTypeId(Integer materialTypeId) {
        return materialRepository.findByMaterialTypeId(materialTypeId);
    }

    /**
     * Search materials by name
     */
    @Transactional(readOnly = true)
    public List<Material> searchMaterialsByName(String searchTerm) {
        return materialRepository.findByMaterialNameContainingIgnoreCase(searchTerm);
    }

    /**
     * Create a new material
     */
    public Material createMaterial(Material material) {
        // Validate material type exists
        if (!materialTypeRepository.existsById(material.getMaterialTypeId())) {
            throw new IllegalArgumentException("Material type with ID " + material.getMaterialTypeId() + " does not exist");
        }

        // Check if material code already exists
        if (materialRepository.existsByMaterialCodeAndNotMaterialId(material.getMaterialCode(), null)) {
            throw new IllegalArgumentException("Material code '" + material.getMaterialCode() + "' already exists");
        }

        // Set audit fields - BaseModel will handle this automatically via @PrePersist
        material.setIsActive(true);

        return materialRepository.save(material);
    }

    /**
     * Update an existing material
     */
    public Material updateMaterial(Integer id, Material materialDetails) {
        Material existingMaterial = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material with ID " + id + " not found"));

        // Validate material type exists
        if (!materialTypeRepository.existsById(materialDetails.getMaterialTypeId())) {
            throw new IllegalArgumentException("Material type with ID " + materialDetails.getMaterialTypeId() + " does not exist");
        }

        // Check if material code already exists (excluding current material)
        if (materialRepository.existsByMaterialCodeAndNotMaterialId(materialDetails.getMaterialCode(), id)) {
            throw new IllegalArgumentException("Material code '" + materialDetails.getMaterialCode() + "' already exists");
        }

        // Update fields
        existingMaterial.setMaterialName(materialDetails.getMaterialName());
        existingMaterial.setMaterialCode(materialDetails.getMaterialCode());
        existingMaterial.setDescription(materialDetails.getDescription());
        existingMaterial.setMaterialTypeId(materialDetails.getMaterialTypeId());
        // BaseModel will handle updatedDate automatically via @PreUpdate

        return materialRepository.save(existingMaterial);
    }

    /**
     * Hard delete a material (permanently remove from database)
     */
    public void deleteMaterial(Integer id) {
        if (!materialRepository.existsById(id)) {
            throw new IllegalArgumentException("Material with ID " + id + " not found");
        }

        materialRepository.deleteById(id);
    }

    /**
     * Soft delete a material (set isActive to false)
     */
    public void softDeleteMaterial(Integer id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material with ID " + id + " not found"));

        material.setIsActive(false);
        // BaseModel will handle updatedDate automatically via @PreUpdate
        materialRepository.save(material);
    }

    /**
     * Check if material exists
     */
    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return materialRepository.existsById(id);
    }

    /**
     * Count materials by material type
     */
    @Transactional(readOnly = true)
    public long countByMaterialTypeId(Integer materialTypeId) {
        return materialRepository.countByMaterialTypeId(materialTypeId);
    }
}
