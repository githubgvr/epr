package epr.eprapiservices.controller;

import epr.eprapiservices.entity.MaterialComposition;
import epr.eprapiservices.service.MaterialCompositionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for MaterialComposition management
 */
@RestController
@RequestMapping("/api/material-compositions")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class MaterialCompositionController {

    @Autowired
    private MaterialCompositionService materialCompositionService;

    /**
     * Get all active material compositions
     */
    @GetMapping
    public ResponseEntity<List<MaterialComposition>> getAllCompositions() {
        try {
            List<MaterialComposition> compositions = materialCompositionService.getAllActiveCompositions();
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get material composition by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MaterialComposition> getCompositionById(@PathVariable Integer id) {
        try {
            Optional<MaterialComposition> composition = materialCompositionService.getCompositionById(id);
            return composition.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get compositions by material ID
     */
    @GetMapping("/material/{materialId}")
    public ResponseEntity<List<MaterialComposition>> getCompositionsByMaterialId(@PathVariable Integer materialId) {
        try {
            List<MaterialComposition> compositions = materialCompositionService.getCompositionsByMaterialId(materialId);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search material compositions
     */
    @GetMapping("/search")
    public ResponseEntity<List<MaterialComposition>> searchCompositions(@RequestParam String query) {
        try {
            List<MaterialComposition> compositions = materialCompositionService.searchCompositions(query);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get compositions by active status
     */
    @GetMapping("/active/{isActive}")
    public ResponseEntity<List<MaterialComposition>> getCompositionsByActiveStatus(@PathVariable Boolean isActive) {
        try {
            List<MaterialComposition> compositions = materialCompositionService.getCompositionsByActiveStatus(isActive);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new material composition
     */
    @PostMapping
    public ResponseEntity<?> createComposition(@Valid @RequestBody MaterialComposition composition) {
        try {
            MaterialComposition createdComposition = materialCompositionService.createComposition(composition);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComposition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to create material composition: " + e.getMessage());
        }
    }

    /**
     * Update an existing material composition
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComposition(@PathVariable Integer id, @Valid @RequestBody MaterialComposition compositionDetails) {
        try {
            MaterialComposition updatedComposition = materialCompositionService.updateComposition(id, compositionDetails);
            return ResponseEntity.ok(updatedComposition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to update material composition: " + e.getMessage());
        }
    }

    /**
     * Delete a material composition
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComposition(@PathVariable Integer id) {
        try {
            materialCompositionService.deleteComposition(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to delete material composition: " + e.getMessage());
        }
    }

    /**
     * Get count of active compositions
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getActiveCompositionsCount() {
        try {
            long count = materialCompositionService.getActiveCompositionsCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get count of compositions by material
     */
    @GetMapping("/count/material/{materialId}")
    public ResponseEntity<Long> getCompositionsCountByMaterial(@PathVariable Integer materialId) {
        try {
            long count = materialCompositionService.getCompositionsCountByMaterial(materialId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Find compositions by weight range
     */
    @GetMapping("/weight-range")
    public ResponseEntity<List<MaterialComposition>> findCompositionsByWeightRange(
            @RequestParam BigDecimal minWeight, 
            @RequestParam BigDecimal maxWeight) {
        try {
            List<MaterialComposition> compositions = materialCompositionService.findCompositionsByWeightRange(minWeight, maxWeight);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Find compositions by percentage overlap
     */
    @GetMapping("/percentage-overlap")
    public ResponseEntity<List<MaterialComposition>> findCompositionsByPercentageOverlap(
            @RequestParam BigDecimal minPercentage, 
            @RequestParam BigDecimal maxPercentage) {
        try {
            List<MaterialComposition> compositions = materialCompositionService.findCompositionsByPercentageOverlap(minPercentage, maxPercentage);
            return ResponseEntity.ok(compositions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
