package epr.eprapiservices.controller;

import epr.eprapiservices.entity.MaterialType;
import epr.eprapiservices.service.MaterialTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for MaterialType operations
 */
@RestController
@RequestMapping("/api/material-types")
public class MaterialTypeController {

    private final MaterialTypeService materialTypeService;

    @Autowired
    public MaterialTypeController(MaterialTypeService materialTypeService) {
        this.materialTypeService = materialTypeService;
    }

    @GetMapping
    public ResponseEntity<List<MaterialType>> getAllMaterialTypes() {
        List<MaterialType> materialTypes = materialTypeService.getAllActiveMaterialTypes();
        return ResponseEntity.ok(materialTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialType> getMaterialTypeById(@PathVariable Integer id) {
        return materialTypeService.getMaterialTypeById(id)
                .map(materialType -> ResponseEntity.ok(materialType))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MaterialType>> searchMaterialTypes(@RequestParam String name) {
        List<MaterialType> materialTypes = materialTypeService.searchMaterialTypesByName(name);
        return ResponseEntity.ok(materialTypes);
    }

    @PostMapping
    public ResponseEntity<MaterialType> createMaterialType(@Valid @RequestBody MaterialType materialType) {
        try {
            MaterialType createdMaterialType = materialTypeService.createMaterialType(materialType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMaterialType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialType> updateMaterialType(@PathVariable Integer id, @Valid @RequestBody MaterialType materialType) {
        try {
            MaterialType updatedMaterialType = materialTypeService.updateMaterialType(id, materialType);
            return ResponseEntity.ok(updatedMaterialType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterialType(@PathVariable Integer id) {
        try {
            materialTypeService.deleteMaterialType(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/soft")
    public ResponseEntity<Void> softDeleteMaterialType(@PathVariable Integer id) {
        try {
            materialTypeService.softDeleteMaterialType(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
