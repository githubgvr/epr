package epr.eprapiservices.service;

import epr.eprapiservices.entity.MaterialType;
import epr.eprapiservices.dao.repository.MaterialTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for MaterialType operations
 */
@Service
@Transactional
public class MaterialTypeService {

    private final MaterialTypeRepository materialTypeRepository;

    @Autowired
    public MaterialTypeService(MaterialTypeRepository materialTypeRepository) {
        this.materialTypeRepository = materialTypeRepository;
    }

    /**
     * Get all active material types
     */
    @Transactional(readOnly = true)
    public List<MaterialType> getAllActiveMaterialTypes() {
        return materialTypeRepository.findByIsActiveTrueOrderByMaterialTypeNameAsc();
    }

    /**
     * Get material type by ID
     */
    @Transactional(readOnly = true)
    public Optional<MaterialType> getMaterialTypeById(Integer id) {
        return materialTypeRepository.findById(id);
    }

    /**
     * Get material type by name (case-insensitive)
     */
    @Transactional(readOnly = true)
    public Optional<MaterialType> getMaterialTypeByName(String name) {
        return materialTypeRepository.findByMaterialTypeNameIgnoreCase(name);
    }

    /**
     * Create a new material type
     */
    public MaterialType createMaterialType(MaterialType materialType) {
        // Check if material type already exists
        if (materialTypeRepository.existsByMaterialTypeNameIgnoreCase(materialType.getMaterialTypeName())) {
            throw new IllegalArgumentException("Material type with name '" + materialType.getMaterialTypeName() + "' already exists");
        }

        materialType.setIsActive(true);
        return materialTypeRepository.save(materialType);
    }

    /**
     * Update an existing material type
     */
    public MaterialType updateMaterialType(Integer id, MaterialType materialType) {
        MaterialType existingMaterialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material type not found with ID: " + id));

        // Check if new name conflicts with existing material type (excluding current one)
        if (!existingMaterialType.getMaterialTypeName().equalsIgnoreCase(materialType.getMaterialTypeName()) &&
            materialTypeRepository.existsByMaterialTypeNameIgnoreCase(materialType.getMaterialTypeName())) {
            throw new IllegalArgumentException("Material type with name '" + materialType.getMaterialTypeName() + "' already exists");
        }

        existingMaterialType.setMaterialTypeName(materialType.getMaterialTypeName());
        existingMaterialType.setDescription(materialType.getDescription());

        return materialTypeRepository.save(existingMaterialType);
    }

    /**
     * Hard delete a material type (permanently remove from database)
     */
    public void deleteMaterialType(Integer id) {
        // Check if material type exists before deleting
        if (!materialTypeRepository.existsById(id)) {
            throw new IllegalArgumentException("Material type not found with ID: " + id);
        }

        materialTypeRepository.deleteById(id);
    }

    /**
     * Soft delete a material type (set isActive to false)
     */
    public void softDeleteMaterialType(Integer id) {
        MaterialType materialType = materialTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material type not found with ID: " + id));

        materialType.setIsActive(false);
        materialTypeRepository.save(materialType);
    }

    /**
     * Search material types by name
     */
    @Transactional(readOnly = true)
    public List<MaterialType> searchMaterialTypesByName(String name) {
        return materialTypeRepository.findByMaterialTypeNameContainingIgnoreCase(name);
    }
}
