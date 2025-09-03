package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.ProductGroupRepository;
import epr.eprapiservices.entity.ProductGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ProductGroup entity operations
 */
@Service
@Transactional
public class ProductGroupService {

    @Autowired
    private ProductGroupRepository productGroupRepository;

    /**
     * Get all active product groups
     */
    public List<ProductGroup> getAllActiveProductGroups() {
        return productGroupRepository.findAllActive();
    }

    /**
     * Get product group by ID
     */
    public Optional<ProductGroup> getProductGroupById(Integer productGroupId) {
        return productGroupRepository.findById(productGroupId);
    }

    /**
     * Get product group by name
     */
    public Optional<ProductGroup> getProductGroupByName(String productGroupName) {
        return productGroupRepository.findByProductGroupName(productGroupName);
    }

    /**
     * Search product groups by name
     */
    public List<ProductGroup> searchProductGroupsByName(String name) {
        return productGroupRepository.findByProductGroupNameContainingIgnoreCase(name);
    }

    /**
     * Create a new product group
     */
    public ProductGroup createProductGroup(ProductGroup productGroup) {
        // Validate product group name uniqueness
        if (productGroupRepository.existsByProductGroupNameIgnoreCase(productGroup.getProductGroupName())) {
            throw new RuntimeException("Product group name already exists: " + productGroup.getProductGroupName());
        }

        return productGroupRepository.save(productGroup);
    }

    /**
     * Update an existing product group
     */
    public ProductGroup updateProductGroup(Integer productGroupId, ProductGroup productGroupDetails) {
        Optional<ProductGroup> existingProductGroupOpt = productGroupRepository.findById(productGroupId);
        if (existingProductGroupOpt.isEmpty()) {
            throw new RuntimeException("Product group not found with ID: " + productGroupId);
        }

        ProductGroup existingProductGroup = existingProductGroupOpt.get();

        // Validate product group name uniqueness (excluding current product group)
        if (productGroupRepository.existsByProductGroupNameIgnoreCaseAndProductGroupIdNot(
                productGroupDetails.getProductGroupName(), productGroupId)) {
            throw new RuntimeException("Product group name already exists: " + productGroupDetails.getProductGroupName());
        }

        // Update fields
        existingProductGroup.setProductGroupName(productGroupDetails.getProductGroupName());
        existingProductGroup.setDescription(productGroupDetails.getDescription());
        existingProductGroup.setIsActive(productGroupDetails.getIsActive());

        return productGroupRepository.save(existingProductGroup);
    }

    /**
     * Delete a product group (soft delete by setting isActive to false)
     */
    public void deleteProductGroup(Integer productGroupId) {
        Optional<ProductGroup> productGroupOpt = productGroupRepository.findById(productGroupId);
        if (productGroupOpt.isEmpty()) {
            throw new RuntimeException("Product group not found with ID: " + productGroupId);
        }

        ProductGroup productGroup = productGroupOpt.get();
        productGroup.setIsActive(false);
        productGroupRepository.save(productGroup);
    }

    /**
     * Permanently delete a product group
     */
    public void permanentlyDeleteProductGroup(Integer productGroupId) {
        if (!productGroupRepository.existsById(productGroupId)) {
            throw new RuntimeException("Product group not found with ID: " + productGroupId);
        }
        productGroupRepository.deleteById(productGroupId);
    }

    /**
     * Check if product group name exists
     */
    public boolean isProductGroupNameExists(String productGroupName) {
        return productGroupRepository.existsByProductGroupNameIgnoreCase(productGroupName);
    }

    /**
     * Get all product groups (including inactive)
     */
    public List<ProductGroup> getAllProductGroups() {
        return productGroupRepository.findAll();
    }
}
