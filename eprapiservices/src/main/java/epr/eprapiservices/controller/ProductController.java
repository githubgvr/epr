package epr.eprapiservices.controller;

import epr.eprapiservices.entity.Product;
import epr.eprapiservices.service.ProductService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Product management operations
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Get all active products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllActiveProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products: " + e.getMessage());
        }
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get product by SKU/Product Code
     */
    @GetMapping("/sku/{skuProductCode}")
    public ResponseEntity<Product> getProductBySkuCode(@PathVariable String skuProductCode) {
        try {
            Product product = productService.getProductBySkuCode(skuProductCode);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Search products
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String query) {
        try {
            List<Product> products = productService.searchProducts(query);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to search products: " + e.getMessage());
        }
    }

    /**
     * Get products by group
     */
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Product>> getProductsByGroup(@PathVariable Integer groupId) {
        try {
            List<Product> products = productService.getProductsByGroup(groupId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products by group: " + e.getMessage());
        }
    }

    /**
     * Create new product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create product: " + e.getMessage());
        }
    }

    /**
     * Update product
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @Valid @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }

    /**
     * Upload regulatory certification file
     */
    @PostMapping("/{id}/certification")
    public ResponseEntity<Map<String, String>> uploadCertification(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            String filename = productService.uploadCertificationFile(id, file);
            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("filename", filename);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload certification file: " + e.getMessage());
        }
    }

    /**
     * Delete product (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }

    /**
     * Get products by registration date range
     */
    @GetMapping("/registration-date")
    public ResponseEntity<List<Product>> getProductsByRegistrationDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Product> products = productService.getProductsByRegistrationDateRange(startDate, endDate);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products by registration date: " + e.getMessage());
        }
    }

    /**
     * Get products expiring soon
     */
    @GetMapping("/expiring-soon")
    public ResponseEntity<List<Product>> getProductsExpiringSoon(@RequestParam(defaultValue = "30") int days) {
        try {
            List<Product> products = productService.getProductsExpiringSoon(days);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve expiring products: " + e.getMessage());
        }
    }

    /**
     * Get recently registered products
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Product>> getRecentlyRegisteredProducts(@RequestParam(defaultValue = "7") int days) {
        try {
            List<Product> products = productService.getRecentlyRegisteredProducts(days);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve recent products: " + e.getMessage());
        }
    }

    /**
     * Get products with high compliance targets
     */
    @GetMapping("/high-compliance")
    public ResponseEntity<List<Product>> getHighComplianceProducts(
            @RequestParam(defaultValue = "80.0") BigDecimal threshold) {
        try {
            List<Product> products = productService.getHighComplianceProducts(threshold);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve high compliance products: " + e.getMessage());
        }
    }

    /**
     * Get product statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ProductService.ProductStatistics> getProductStatistics() {
        try {
            ProductService.ProductStatistics statistics = productService.getProductStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve product statistics: " + e.getMessage());
        }
    }

    /**
     * Validate SKU/Product Code availability
     */
    @GetMapping("/validate-sku")
    public ResponseEntity<Map<String, Boolean>> validateSkuCode(
            @RequestParam String skuProductCode,
            @RequestParam(required = false) Integer excludeId) {
        try {
            boolean isAvailable = productService.isSkuCodeAvailable(skuProductCode, excludeId);

            Map<String, Boolean> response = new HashMap<>();
            response.put("available", isAvailable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to validate SKU code: " + e.getMessage());
        }
    }

    /**
     * Get products by weight range
     */
    @GetMapping("/weight-range")
    public ResponseEntity<List<Product>> getProductsByWeightRange(
            @RequestParam BigDecimal minWeight,
            @RequestParam BigDecimal maxWeight) {
        try {
            List<Product> products = productService.getProductsByWeightRange(minWeight, maxWeight);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products by weight range: " + e.getMessage());
        }
    }

    /**
     * Get products by lifecycle duration range
     */
    @GetMapping("/lifecycle-range")
    public ResponseEntity<List<Product>> getProductsByLifecycleRange(
            @RequestParam Integer minDuration,
            @RequestParam Integer maxDuration) {
        try {
            List<Product> products = productService.getProductsByLifecycleRange(minDuration, maxDuration);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve products by lifecycle range: " + e.getMessage());
        }
    }
}
