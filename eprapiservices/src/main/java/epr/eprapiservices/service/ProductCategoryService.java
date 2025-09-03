package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.ProductCategoryRepository;
import epr.eprapiservices.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ProductCategory entity operations
 */
@Service
@Transactional
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * Get all active product categories
     */
    public List<ProductCategory> getAllActiveProductCategories() {
        return productCategoryRepository.findAllActive();
    }

    /**
     * Get product category by ID
     */
    public Optional<ProductCategory> getProductCategoryById(Integer productCategoryId) {
        return productCategoryRepository.findById(productCategoryId);
    }

    /**
     * Get product category by name
     */
    public Optional<ProductCategory> getProductCategoryByName(String productCategoryName) {
        return productCategoryRepository.findByProductCategoryName(productCategoryName);
    }

    /**
     * Create a new product category
     */
    public ProductCategory createProductCategory(ProductCategory productCategory) {
        // Check if category name already exists
        if (isCategoryNameExists(productCategory.getProductCategoryName())) {
            throw new RuntimeException("Product category name already exists: " + productCategory.getProductCategoryName());
        }

        // Check if category code already exists (if provided)
        if (productCategory.getCategoryCode() != null && !productCategory.getCategoryCode().trim().isEmpty()) {
            if (isCategoryCodeExists(productCategory.getCategoryCode())) {
                throw new RuntimeException("Category code already exists: " + productCategory.getCategoryCode());
            }
        }

        // Set sort order if not provided
        if (productCategory.getSortOrder() == null) {
            productCategory.setSortOrder(productCategoryRepository.getNextSortOrder());
        }

        productCategory.setProductCategoryId(null); // Ensure it's a new entity
        return productCategoryRepository.save(productCategory);
    }

    /**
     * Update an existing product category
     */
    public ProductCategory updateProductCategory(Integer productCategoryId, ProductCategory productCategoryDetails) {
        Optional<ProductCategory> optionalCategory = productCategoryRepository.findById(productCategoryId);
        if (optionalCategory.isPresent()) {
            ProductCategory existingCategory = optionalCategory.get();

            // Check if category name is being changed and if it already exists
            if (!existingCategory.getProductCategoryName().equals(productCategoryDetails.getProductCategoryName())) {
                if (productCategoryRepository.existsByProductCategoryNameIgnoreCaseAndProductCategoryIdNot(
                        productCategoryDetails.getProductCategoryName(), productCategoryId)) {
                    throw new RuntimeException("Product category name already exists: " + productCategoryDetails.getProductCategoryName());
                }
            }

            // Check if category code is being changed and if it already exists
            if (productCategoryDetails.getCategoryCode() != null && !productCategoryDetails.getCategoryCode().trim().isEmpty()) {
                if (!productCategoryDetails.getCategoryCode().equals(existingCategory.getCategoryCode())) {
                    if (productCategoryRepository.existsByCategoryCodeAndProductCategoryIdNot(
                            productCategoryDetails.getCategoryCode(), productCategoryId)) {
                        throw new RuntimeException("Category code already exists: " + productCategoryDetails.getCategoryCode());
                    }
                }
            }

            // Update fields
            existingCategory.setProductCategoryName(productCategoryDetails.getProductCategoryName());
            existingCategory.setDescription(productCategoryDetails.getDescription());
            existingCategory.setCategoryCode(productCategoryDetails.getCategoryCode());
            existingCategory.setSortOrder(productCategoryDetails.getSortOrder());

            return productCategoryRepository.save(existingCategory);
        } else {
            throw new RuntimeException("ProductCategory not found with id: " + productCategoryId);
        }
    }

    /**
     * Delete a product category (soft delete)
     */
    public void deleteProductCategory(Integer productCategoryId) {
        Optional<ProductCategory> optionalCategory = productCategoryRepository.findById(productCategoryId);
        if (optionalCategory.isPresent()) {
            ProductCategory category = optionalCategory.get();
            category.setIsActive(false);
            productCategoryRepository.save(category);
        } else {
            throw new RuntimeException("ProductCategory not found with id: " + productCategoryId);
        }
    }

    /**
     * Search product categories by name
     */
    public List<ProductCategory> searchProductCategoriesByName(String name) {
        return productCategoryRepository.findByProductCategoryNameContainingIgnoreCase(name);
    }

    /**
     * Search product categories by name or description
     */
    public List<ProductCategory> searchProductCategories(String searchTerm) {
        return productCategoryRepository.searchByNameOrDescription(searchTerm);
    }

    /**
     * Check if category name exists
     */
    public boolean isCategoryNameExists(String categoryName) {
        return productCategoryRepository.existsByProductCategoryNameIgnoreCase(categoryName);
    }

    /**
     * Check if category code exists
     */
    public boolean isCategoryCodeExists(String categoryCode) {
        return productCategoryRepository.existsByCategoryCode(categoryCode);
    }

    /**
     * Check if category name is available for update
     */
    public boolean isCategoryNameAvailable(String categoryName, Integer excludeId) {
        if (excludeId == null) {
            return !isCategoryNameExists(categoryName);
        }
        return !productCategoryRepository.existsByProductCategoryNameIgnoreCaseAndProductCategoryIdNot(categoryName, excludeId);
    }

    /**
     * Check if category code is available for update
     */
    public boolean isCategoryCodeAvailable(String categoryCode, Integer excludeId) {
        if (excludeId == null) {
            return !isCategoryCodeExists(categoryCode);
        }
        return !productCategoryRepository.existsByCategoryCodeAndProductCategoryIdNot(categoryCode, excludeId);
    }

    /**
     * Get count of active categories
     */
    public long getActiveCount() {
        return productCategoryRepository.countActiveCategories();
    }

    /**
     * Get all categories ordered by sort order
     */
    public List<ProductCategory> getAllCategoriesBySortOrder() {
        return productCategoryRepository.findAllActiveBySortOrder();
    }

    /**
     * Get next sort order value
     */
    public Integer getNextSortOrder() {
        return productCategoryRepository.getNextSortOrder();
    }

    /**
     * Validate product category data
     */
    public boolean validateProductCategory(ProductCategory productCategory) {
        if (productCategory == null) {
            return false;
        }

        // Check required fields
        if (productCategory.getProductCategoryName() == null || productCategory.getProductCategoryName().trim().isEmpty()) {
            return false;
        }

        // Check field lengths
        if (productCategory.getProductCategoryName().length() > 100) {
            return false;
        }

        if (productCategory.getDescription() != null && productCategory.getDescription().length() > 500) {
            return false;
        }

        if (productCategory.getCategoryCode() != null && productCategory.getCategoryCode().length() > 20) {
            return false;
        }

        return true;
    }
}
