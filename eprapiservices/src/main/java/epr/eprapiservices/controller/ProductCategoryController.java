package epr.eprapiservices.controller;

import epr.eprapiservices.entity.ProductCategory;
import epr.eprapiservices.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for Product Category management operations
 */
@RestController
@RequestMapping("/api/product-categories")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    /**
     * Get all product categories with filtering and sorting
     */
    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllProductCategories(
            @RequestParam(defaultValue = "true") Boolean activeOnly,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        try {
            List<ProductCategory> categories = productCategoryService.getAllProductCategories(activeOnly, sortBy, sortOrder);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getProductCategoryById(@PathVariable Integer id) {
        try {
            Optional<ProductCategory> category = productCategoryService.getProductCategoryById(id);
            return category.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new product category
     */
    @PostMapping
    public ResponseEntity<ProductCategory> createProductCategory(@Valid @RequestBody ProductCategory productCategory) {
        try {
            if (!productCategoryService.validateProductCategory(productCategory)) {
                return ResponseEntity.badRequest().build();
            }

            ProductCategory createdCategory = productCategoryService.createProductCategory(productCategory);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Name or code already exists
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing product category
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(@PathVariable Integer id, 
                                                               @Valid @RequestBody ProductCategory categoryDetails) {
        try {
            if (!productCategoryService.validateProductCategory(categoryDetails)) {
                return ResponseEntity.badRequest().build();
            }

            ProductCategory updatedCategory = productCategoryService.updateProductCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a product category (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Integer id) {
        try {
            productCategoryService.deleteProductCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search product categories by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductCategory>> searchProductCategories(@RequestParam String query) {
        try {
            List<ProductCategory> categories = productCategoryService.searchProductCategories(query);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search product categories by name only
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<ProductCategory>> searchProductCategoriesByName(@RequestParam String name) {
        try {
            List<ProductCategory> categories = productCategoryService.searchProductCategoriesByName(name);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product category by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<ProductCategory> getProductCategoryByName(@PathVariable String name) {
        try {
            Optional<ProductCategory> category = productCategoryService.getProductCategoryByName(name);
            return category.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if category name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Map<String, Boolean>> checkCategoryNameExists(@PathVariable String name) {
        try {
            boolean exists = productCategoryService.isCategoryNameExists(name);
            Map<String, Boolean> response = new HashMap<>();
            response.put("exists", exists);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Category code existence check removed - no longer using codes

    /**
     * Validate category name availability
     */
    @GetMapping("/validate-name")
    public ResponseEntity<Map<String, Boolean>> validateCategoryName(
            @RequestParam String name,
            @RequestParam(required = false) Integer excludeId) {
        try {
            boolean available = productCategoryService.isCategoryNameAvailable(name, excludeId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("available", available);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Category code validation removed - no longer using codes

    /**
     * Get count of active categories
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getActiveCount() {
        try {
            long count = productCategoryService.getActiveCount();
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all categories ordered by sort order
     */
    @GetMapping("/sorted")
    public ResponseEntity<List<ProductCategory>> getAllCategoriesBySortOrder() {
        try {
            List<ProductCategory> categories = productCategoryService.getAllCategoriesBySortOrder();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get next sort order value
     */
    @GetMapping("/next-sort-order")
    public ResponseEntity<Map<String, Integer>> getNextSortOrder() {
        try {
            Integer nextSortOrder = productCategoryService.getNextSortOrder();
            Map<String, Integer> response = new HashMap<>();
            response.put("nextSortOrder", nextSortOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
