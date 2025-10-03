package epr.eprapiservices.service;

import epr.eprapiservices.entity.Product;
import epr.eprapiservices.entity.ProductCertification;
import epr.eprapiservices.entity.ProductComponentComposition;
import epr.eprapiservices.entity.Component;
import epr.eprapiservices.dao.repository.ProductRepository;
import epr.eprapiservices.dao.repository.ProductCertificationRepository;
import epr.eprapiservices.dao.repository.ComponentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Service class for Product entity operations
 */
@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCertificationRepository certificationRepository;
    private final ComponentRepository componentRepository;
    private static final String UPLOAD_DIR = "uploads/certifications/";

    @Autowired
    public ProductService(ProductRepository productRepository,
                         ProductCertificationRepository certificationRepository,
                         ComponentRepository componentRepository) {
        this.productRepository = productRepository;
        this.certificationRepository = certificationRepository;
        this.componentRepository = componentRepository;
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    /**
     * Get all products
     */
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        // Load certifications for each product
        for (Product product : products) {
            // List<ProductCertification> certifications = certificationRepository.findByProductIdAndIsActiveTrue(
            //     product.getProductId()
            // );
            // product.setCertifications(certifications); // Commented out - method not available
        }
        return products;
    }

    /**
     * Get all active products
     */
    @Transactional(readOnly = true)
    public List<Product> getAllActiveProducts() {
        return productRepository.findAllActiveProducts();
    }

    /**
     * Get product by ID
     */
    @Transactional(readOnly = true)
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    /**
     * Get product by SKU/Product Code
     */
    @Transactional(readOnly = true)
    public Product getProductBySkuCode(String skuProductCode) {
        return productRepository.findBySkuProductCode(skuProductCode)
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + skuProductCode));
    }

    /**
     * Search products by term
     */
    @Transactional(readOnly = true)
    public List<Product> searchProducts(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllActiveProducts();
        }
        return productRepository.searchProducts(searchTerm.trim());
    }

    /**
     * Create a new product
     */
    public Product createProduct(Product product) {
        validateProduct(product);

        // Check if SKU already exists
        if (productRepository.existsBySkuProductCodeIgnoreCase(product.getSkuProductCode())) {
            throw new RuntimeException("Product with SKU '" + product.getSkuProductCode() + "' already exists");
        }

        // Set registration date if not provided
        if (product.getRegistrationDate() == null) {
            product.setRegistrationDate(LocalDate.now());
        }

        // Set default values
        if (product.getIsActive() == null) {
            product.setIsActive(true);
        }

        // Handle component compositions
        if (product.getComponentCompositions() != null && !product.getComponentCompositions().isEmpty()) {
            for (ProductComponentComposition composition : product.getComponentCompositions()) {
                // Get component from componentId
                if (composition.getComponentId() != null) {
                    Component component = componentRepository.findById(composition.getComponentId().longValue())
                        .orElseThrow(() -> new RuntimeException("Component not found with ID: " + composition.getComponentId()));
                    composition.setComponent(component);
                }
                composition.setProduct(product);
                if (composition.getIsActive() == null) {
                    composition.setIsActive(true);
                }
            }
        }

        return productRepository.save(product);
    }

    /**
     * Update an existing product
     */
    public Product updateProduct(Integer id, Product productDetails) {
        Product existingProduct = getProductById(id);

        validateProduct(productDetails);

        // Check if SKU already exists for another product
        if (!existingProduct.getSkuProductCode().equalsIgnoreCase(productDetails.getSkuProductCode()) &&
            productRepository.existsBySkuProductCodeIgnoreCaseAndIdNot(productDetails.getSkuProductCode(), id)) {
            throw new RuntimeException("Product with SKU '" + productDetails.getSkuProductCode() + "' already exists");
        }

        // Update fields
        existingProduct.setProductName(productDetails.getProductName());
        existingProduct.setSkuProductCode(productDetails.getSkuProductCode());
        existingProduct.setProductDescription(productDetails.getProductDescription());
        existingProduct.setProductWeight(productDetails.getProductWeight());
        existingProduct.setProductLifecycleDuration(productDetails.getProductLifecycleDuration());
        existingProduct.setComplianceTargetPercentage(productDetails.getComplianceTargetPercentage());
        existingProduct.setProductManufacturingDate(productDetails.getProductManufacturingDate());
        existingProduct.setProductExpiryDate(productDetails.getProductExpiryDate());

        if (productDetails.getRegulatoryCertificationsPath() != null) {
            existingProduct.setRegulatoryCertificationsPath(productDetails.getRegulatoryCertificationsPath());
        }

        // Update component compositions
        if (productDetails.getComponentCompositions() != null) {
            // Clear existing compositions
            existingProduct.getComponentCompositions().clear();

            // Add new compositions
            for (ProductComponentComposition composition : productDetails.getComponentCompositions()) {
                // Get component from componentId
                if (composition.getComponentId() != null) {
                    Component component = componentRepository.findById(composition.getComponentId().longValue())
                        .orElseThrow(() -> new RuntimeException("Component not found with ID: " + composition.getComponentId()));
                    composition.setComponent(component);
                }
                composition.setProduct(existingProduct);
                if (composition.getIsActive() == null) {
                    composition.setIsActive(true);
                }
                existingProduct.getComponentCompositions().add(composition);
            }
        }

        return productRepository.save(existingProduct);
    }

    /**
     * Upload regulatory certification file
     */
    public String uploadCertificationFile(Integer productId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") &&
            !contentType.equals("image/jpeg") && !contentType.equals("image/jpg"))) {
            throw new RuntimeException("Only PDF and JPG files are allowed");
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = "cert_" + productId + "_" + UUID.randomUUID() + extension;
            
            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update product with file path
            Product product = getProductById(productId);
            product.setRegulatoryCertificationsPath(filename);
            productRepository.save(product);
            
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Delete product (soft delete)
     */
    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    /**
     * Hard delete product
     */
    public void hardDeleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Get products by date range
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByRegistrationDateRange(LocalDate startDate, LocalDate endDate) {
        return productRepository.findByRegistrationDateBetween(startDate, endDate);
    }

    /**
     * Get products expiring soon
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsExpiringSoon(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);
        return productRepository.findByExpiryDateBetween(startDate, endDate);
    }

    /**
     * Get recently registered products
     */
    @Transactional(readOnly = true)
    public List<Product> getRecentlyRegisteredProducts(int days) {
        LocalDate sinceDate = LocalDate.now().minusDays(days);
        return productRepository.findRecentlyRegisteredProducts(sinceDate);
    }

    /**
     * Get products with high compliance targets
     */
    @Transactional(readOnly = true)
    public List<Product> getHighComplianceProducts(BigDecimal threshold) {
        return productRepository.findHighComplianceProducts(threshold);
    }

    /**
     * Get product statistics
     */
    @Transactional(readOnly = true)
    public ProductStatistics getProductStatistics() {
        long totalProducts = productRepository.countActiveProducts();
        long productsWithCertifications = productRepository.findProductsWithCertifications().size();
        long productsWithoutCertifications = productRepository.findProductsWithoutCertifications().size();

        return new ProductStatistics(totalProducts, productsWithCertifications, productsWithoutCertifications);
    }

    /**
     * Check if SKU code is available
     */
    @Transactional(readOnly = true)
    public boolean isSkuCodeAvailable(String skuProductCode, Integer excludeId) {
        if (excludeId != null) {
            return !productRepository.existsBySkuProductCodeIgnoreCaseAndIdNot(skuProductCode, excludeId);
        } else {
            return !productRepository.existsBySkuProductCodeIgnoreCase(skuProductCode);
        }
    }

    /**
     * Get products by weight range
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByWeightRange(BigDecimal minWeight, BigDecimal maxWeight) {
        return productRepository.findByProductWeightBetween(minWeight, maxWeight);
    }

    /**
     * Get products by lifecycle duration range
     */
    @Transactional(readOnly = true)
    public List<Product> getProductsByLifecycleRange(Integer minDuration, Integer maxDuration) {
        return productRepository.findByLifecycleDurationBetween(minDuration, maxDuration);
    }

    /**
     * Validate product data
     */
    private void validateProduct(Product product) {
        if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }

        if (product.getSkuProductCode() == null || product.getSkuProductCode().trim().isEmpty()) {
            throw new RuntimeException("SKU/Product Code is required");
        }

        if (product.getProductWeight() == null || product.getProductWeight().compareTo(new BigDecimal("0.01")) < 0) {
            throw new RuntimeException("Product weight must be at least 0.01 kg");
        }

        if (product.getProductLifecycleDuration() == null ||
            product.getProductLifecycleDuration() < 1 || product.getProductLifecycleDuration() > 50) {
            throw new RuntimeException("Product lifecycle duration must be between 1 and 50 years");
        }

        if (product.getComplianceTargetPercentage() == null ||
            product.getComplianceTargetPercentage().compareTo(BigDecimal.ZERO) < 0 ||
            product.getComplianceTargetPercentage().compareTo(new BigDecimal("100")) > 0) {
            throw new RuntimeException("Compliance target percentage must be between 0% and 100%");
        }

        // Validate dates
        if (product.getProductManufacturingDate() != null && product.getProductExpiryDate() != null) {
            if (product.getProductManufacturingDate().isAfter(product.getProductExpiryDate())) {
                throw new RuntimeException("Manufacturing date cannot be after expiry date");
            }
        }
    }

    /**
     * Inner class for product statistics
     */
    public static class ProductStatistics {
        private final long totalProducts;
        private final long productsWithCertifications;
        private final long productsWithoutCertifications;

        public ProductStatistics(long totalProducts, long productsWithCertifications, long productsWithoutCertifications) {
            this.totalProducts = totalProducts;
            this.productsWithCertifications = productsWithCertifications;
            this.productsWithoutCertifications = productsWithoutCertifications;
        }

        public long getTotalProducts() { return totalProducts; }
        public long getProductsWithCertifications() { return productsWithCertifications; }
        public long getProductsWithoutCertifications() { return productsWithoutCertifications; }
    }
}
