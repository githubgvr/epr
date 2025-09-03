package epr.eprapiservices.controller;

import epr.eprapiservices.entity.ProductType;
import epr.eprapiservices.Services.ProductTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for ProductType operations
 */
@RestController
@RequestMapping("/api/product-types")
public class ProductTypeController {

    private final ProductTypeService productTypeService;

    @Autowired
    public ProductTypeController(ProductTypeService productTypeService) {
        this.productTypeService = productTypeService;
    }

    /**
     * Get all product types
     */
    @GetMapping
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        try {
            List<ProductType> productTypes = productTypeService.getAllActive();
            return ResponseEntity.ok(productTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product type by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductType> getProductTypeById(@PathVariable Integer id) {
        try {
            ProductType productType = productTypeService.getProductTypeById(id);
            if (productType != null) {
                return ResponseEntity.ok(productType);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search product types by name or description
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductType>> searchProductTypes(@RequestParam String query) {
        try {
            List<ProductType> productTypes = productTypeService.searchProductTypes(query);
            return ResponseEntity.ok(productTypes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new product type
     */
    @PostMapping
    public ResponseEntity<?> createProductType(@Valid @RequestBody ProductType productType) {
        try {
            ProductType createdProductType = productTypeService.create(productType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProductType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating product type: " + e.getMessage());
        }
    }

    /**
     * Update existing product type
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductType(@PathVariable Integer id, 
                                              @Valid @RequestBody ProductType productTypeDetails) {
        try {
            ProductType updatedProductType = productTypeService.update(id, productTypeDetails);
            if (updatedProductType != null) {
                return ResponseEntity.ok(updatedProductType);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product type: " + e.getMessage());
        }
    }

    /**
     * Delete product type (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductType(@PathVariable Integer id) {
        try {
            boolean deleted = productTypeService.delete(id);
            if (deleted) {
                return ResponseEntity.ok().body("Product type deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product type: " + e.getMessage());
        }
    }

    /**
     * Restore deleted product type
     */
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreProductType(@PathVariable Integer id) {
        try {
            ProductType restoredProductType = productTypeService.restore(id);
            if (restoredProductType != null) {
                return ResponseEntity.ok(restoredProductType);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error restoring product type: " + e.getMessage());
        }
    }

    /**
     * Check if product type name exists
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkProductTypeExists(@RequestParam String name) {
        try {
            boolean exists = productTypeService.existsByName(name);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get count of active product types
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getActiveProductTypeCount() {
        try {
            long count = productTypeService.getActiveCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
