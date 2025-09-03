package epr.eprapiservices.controller;

import epr.eprapiservices.entity.Material;
import epr.eprapiservices.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    /**
     * Get all materials
     */
    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        try {
            List<Material> materials = materialService.getAllMaterials();
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get material by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable Integer id) {
        try {
            Optional<Material> material = materialService.getMaterialById(id);
            return material.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get material by material code
     */
    @GetMapping("/code/{materialCode}")
    public ResponseEntity<Material> getMaterialByCode(@PathVariable String materialCode) {
        try {
            Optional<Material> material = materialService.getMaterialByCode(materialCode);
            return material.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get materials by material type ID
     */
    @GetMapping("/type/{materialTypeId}")
    public ResponseEntity<List<Material>> getMaterialsByTypeId(@PathVariable Integer materialTypeId) {
        try {
            List<Material> materials = materialService.getMaterialsByTypeId(materialTypeId);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search materials by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Material>> searchMaterials(@RequestParam String query) {
        try {
            List<Material> materials = materialService.searchMaterialsByName(query);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new material
     */
    @PostMapping
    public ResponseEntity<Material> createMaterial(@Valid @RequestBody Material material) {
        try {
            Material createdMaterial = materialService.createMaterial(material);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMaterial);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing material
     */
    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Integer id, @Valid @RequestBody Material material) {
        try {
            Material updatedMaterial = materialService.updateMaterial(id, material);
            return ResponseEntity.ok(updatedMaterial);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Hard delete a material (permanently remove from database)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Integer id) {
        try {
            materialService.deleteMaterial(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Soft delete a material (set isActive to false)
     */
    @DeleteMapping("/{id}/soft")
    public ResponseEntity<Void> softDeleteMaterial(@PathVariable Integer id) {
        try {
            materialService.softDeleteMaterial(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if material exists
     */
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> materialExists(@PathVariable Integer id) {
        try {
            boolean exists = materialService.existsById(id);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Count materials by material type
     */
    @GetMapping("/count/type/{materialTypeId}")
    public ResponseEntity<Long> countByMaterialTypeId(@PathVariable Integer materialTypeId) {
        try {
            long count = materialService.countByMaterialTypeId(materialTypeId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
