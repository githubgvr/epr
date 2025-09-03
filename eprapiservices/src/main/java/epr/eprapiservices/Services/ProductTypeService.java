package epr.eprapiservices.Services;

import epr.eprapiservices.entity.ProductType;
import epr.eprapiservices.dao.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ProductType operations
 */
@Service
@Transactional
public class ProductTypeService {

    private final ProductTypeRepository productTypeRepository;

    @Autowired
    public ProductTypeService(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    /**
     * Get all product types
     */
    @Transactional(readOnly = true)
    public List<ProductType> getAll() {
        return productTypeRepository.findAll();
    }

    /**
     * Get all active product types ordered by name
     */
    @Transactional(readOnly = true)
    public List<ProductType> getAllActive() {
        return productTypeRepository.findAllActiveOrderByName();
    }

    /**
     * Get product type by ID
     */
    @Transactional(readOnly = true)
    public ProductType getProductTypeById(Integer id) {
        Optional<ProductType> productType = productTypeRepository.findById(id);
        return productType.orElse(null);
    }

    /**
     * Get product type by name (case-insensitive)
     */
    @Transactional(readOnly = true)
    public ProductType getProductTypeByName(String name) {
        Optional<ProductType> productType = productTypeRepository.findByProductTypeNameIgnoreCase(name);
        return productType.orElse(null);
    }

    /**
     * Search product types by name or description
     */
    @Transactional(readOnly = true)
    public List<ProductType> searchProductTypes(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllActive();
        }
        return productTypeRepository.searchByNameOrDescription(query.trim());
    }

    /**
     * Create new product type
     */
    public ProductType create(ProductType productType) {
        // Validate required fields
        if (productType.getProductTypeName() == null || productType.getProductTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product type name is required");
        }

        // Check if name already exists
        if (productTypeRepository.existsByProductTypeNameIgnoreCase(productType.getProductTypeName().trim())) {
            throw new IllegalArgumentException("Product type with this name already exists");
        }

        // Trim and set the name
        productType.setProductTypeName(productType.getProductTypeName().trim());
        
        // Trim description if provided
        if (productType.getProductTypeDescription() != null) {
            productType.setProductTypeDescription(productType.getProductTypeDescription().trim());
        }

        return productTypeRepository.save(productType);
    }

    /**
     * Update existing product type
     */
    public ProductType update(Integer id, ProductType productTypeDetails) {
        Optional<ProductType> optionalProductType = productTypeRepository.findById(id);
        
        if (optionalProductType.isEmpty()) {
            return null;
        }

        ProductType existingProductType = optionalProductType.get();

        // Validate required fields
        if (productTypeDetails.getProductTypeName() == null || productTypeDetails.getProductTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product type name is required");
        }

        // Check if name already exists for different ID
        String newName = productTypeDetails.getProductTypeName().trim();
        if (productTypeRepository.existsByProductTypeNameIgnoreCaseAndIdNot(newName, id)) {
            throw new IllegalArgumentException("Product type with this name already exists");
        }

        // Update fields
        existingProductType.setProductTypeName(newName);
        
        if (productTypeDetails.getProductTypeDescription() != null) {
            existingProductType.setProductTypeDescription(productTypeDetails.getProductTypeDescription().trim());
        }

        return productTypeRepository.save(existingProductType);
    }

    /**
     * Delete product type (soft delete by setting isActive to false)
     */
    public boolean delete(Integer id) {
        Optional<ProductType> optionalProductType = productTypeRepository.findById(id);
        
        if (optionalProductType.isEmpty()) {
            return false;
        }

        ProductType productType = optionalProductType.get();
        productType.setIsActive(false);
        productTypeRepository.save(productType);
        return true;
    }

    /**
     * Permanently delete product type
     */
    public boolean permanentDelete(Integer id) {
        if (productTypeRepository.existsById(id)) {
            productTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Restore deleted product type
     */
    public ProductType restore(Integer id) {
        Optional<ProductType> optionalProductType = productTypeRepository.findById(id);
        
        if (optionalProductType.isEmpty()) {
            return null;
        }

        ProductType productType = optionalProductType.get();
        productType.setIsActive(true);
        return productTypeRepository.save(productType);
    }

    /**
     * Check if product type exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return productTypeRepository.existsByProductTypeNameIgnoreCase(name);
    }

    /**
     * Get count of active product types
     */
    @Transactional(readOnly = true)
    public long getActiveCount() {
        return productTypeRepository.countActiveProductTypes();
    }
}
