package epr.eprapiservices.controller;

import epr.eprapiservices.entity.ProductGroup;
import epr.eprapiservices.service.ProductGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Product Group management operations
 */
@RestController
@RequestMapping("/api/product-groups")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class ProductGroupController {

    @Autowired
    private ProductGroupService productGroupService;

    /**
     * Get all product groups with optional filtering and sorting
     */
    @GetMapping
    public ResponseEntity<List<ProductGroup>> getAllProductGroups(
            @RequestParam(defaultValue = "true") Boolean activeOnly,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        try {
            List<ProductGroup> productGroups = productGroupService.getAllProductGroups(activeOnly, sortBy, sortOrder);
            return ResponseEntity.ok(productGroups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product group by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductGroup> getProductGroupById(@PathVariable Integer id) {
        try {
            Optional<ProductGroup> productGroup = productGroupService.getProductGroupById(id);
            return productGroup.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product group by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<ProductGroup> getProductGroupByName(@PathVariable String name) {
        try {
            Optional<ProductGroup> productGroup = productGroupService.getProductGroupByName(name);
            return productGroup.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search product groups by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductGroup>> searchProductGroups(@RequestParam String name) {
        try {
            List<ProductGroup> productGroups = productGroupService.searchProductGroupsByName(name);
            return ResponseEntity.ok(productGroups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new product group
     */
    @PostMapping
    public ResponseEntity<ProductGroup> createProductGroup(@Valid @RequestBody ProductGroup productGroup) {
        try {
            ProductGroup createdProductGroup = productGroupService.createProductGroup(productGroup);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProductGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing product group
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductGroup> updateProductGroup(@PathVariable Integer id, @Valid @RequestBody ProductGroup productGroupDetails) {
        try {
            ProductGroup updatedProductGroup = productGroupService.updateProductGroup(id, productGroupDetails);
            return ResponseEntity.ok(updatedProductGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a product group (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductGroup(@PathVariable Integer id) {
        try {
            productGroupService.deleteProductGroup(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if product group name exists
     */
    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> checkProductGroupNameExists(@PathVariable String name) {
        try {
            boolean exists = productGroupService.isProductGroupNameExists(name);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
