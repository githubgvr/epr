package epr.eprapiservices.controller;

import epr.eprapiservices.entity.ProductComposition;
import epr.eprapiservices.service.ProductCompositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for ProductComposition management
 */
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/product-compositions")
public class ProductCompositionController {

    @Autowired
    private ProductCompositionService productCompositionService;

    /**
     * Get all active product compositions
     */
    @GetMapping
    public ResponseEntity<List<ProductComposition>> getAllCompositions() {
        try {
            List<ProductComposition> compositions = productCompositionService.getAllActiveCompositions();
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get product composition by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductComposition> getCompositionById(@PathVariable Integer id) {
        try {
            Optional<ProductComposition> composition = productCompositionService.getCompositionById(id);
            return composition.map(ResponseEntity::ok)
                             .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get compositions for a specific product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductComposition>> getCompositionsByProductId(@PathVariable Integer productId) {
        try {
            List<ProductComposition> compositions = productCompositionService.getCompositionsByProductId(productId);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get compositions using a specific material
     */
    @GetMapping("/material/{materialId}")
    public ResponseEntity<List<ProductComposition>> getCompositionsByMaterialId(@PathVariable Integer materialId) {
        try {
            List<ProductComposition> compositions = productCompositionService.getCompositionsByMaterialId(materialId);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new product composition
     */
    @PostMapping
    public ResponseEntity<?> createComposition(@Valid @RequestBody ProductComposition composition) {
        try {
            ProductComposition createdComposition = productCompositionService.createComposition(composition);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComposition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to create product composition: " + e.getMessage());
        }
    }

    /**
     * Update an existing product composition
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComposition(@PathVariable Integer id, 
                                             @Valid @RequestBody ProductComposition composition) {
        try {
            ProductComposition updatedComposition = productCompositionService.updateComposition(id, composition);
            return ResponseEntity.ok(updatedComposition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update product composition: " + e.getMessage());
        }
    }

    /**
     * Delete a product composition
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComposition(@PathVariable Integer id) {
        try {
            productCompositionService.deleteComposition(id);
            return ResponseEntity.ok().body("Product composition deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete product composition: " + e.getMessage());
        }
    }

    /**
     * Get total composition percentage for a product
     */
    @GetMapping("/product/{productId}/total-percentage")
    public ResponseEntity<Double> getTotalCompositionPercentage(@PathVariable Integer productId) {
        try {
            Double totalPercentage = productCompositionService.getTotalCompositionPercentage(productId);
            return ResponseEntity.ok(totalPercentage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get remaining composition percentage for a product
     */
    @GetMapping("/product/{productId}/remaining-percentage")
    public ResponseEntity<Double> getRemainingCompositionPercentage(@PathVariable Integer productId) {
        try {
            Double remainingPercentage = productCompositionService.getRemainingCompositionPercentage(productId);
            return ResponseEntity.ok(remainingPercentage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Validate composition percentages for a product
     */
    @GetMapping("/product/{productId}/validate")
    public ResponseEntity<Boolean> validateComposition(@PathVariable Integer productId) {
        try {
            Boolean isValid = productCompositionService.isCompositionValid(productId);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total material weight for a product
     */
    @GetMapping("/product/{productId}/total-weight")
    public ResponseEntity<Double> getTotalWeight(@PathVariable Integer productId) {
        try {
            Double totalWeight = productCompositionService.getTotalMaterialWeight(productId);
            return ResponseEntity.ok(totalWeight);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get remaining weight capacity for a product
     */
    @GetMapping("/product/{productId}/remaining-weight")
    public ResponseEntity<Double> getRemainingWeight(@PathVariable Integer productId) {
        try {
            Double remaining = productCompositionService.getRemainingWeight(productId);
            return ResponseEntity.ok(remaining);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if material weights are valid for a product
     */
    @GetMapping("/product/{productId}/weight-valid")
    public ResponseEntity<Boolean> isWeightValid(@PathVariable Integer productId) {
        try {
            Boolean isValid = productCompositionService.isWeightValid(productId);
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get detailed weight validation for a product
     */
    @GetMapping("/product/{productId}/weight-validation")
    public ResponseEntity<?> getWeightValidation(@PathVariable Integer productId) {
        try {
            var validation = productCompositionService.validateProductWeights(productId);
            return ResponseEntity.ok(validation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to validate weights: " + e.getMessage());
        }
    }

    /**
     * Validate all compositions for a product
     */
    @PostMapping("/product/{productId}/validate-all")
    public ResponseEntity<?> validateAllCompositions(@PathVariable Integer productId) {
        try {
            productCompositionService.validateAllProductCompositions(productId);
            return ResponseEntity.ok().body("All compositions are valid");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to validate compositions: " + e.getMessage());
        }
    }
}
