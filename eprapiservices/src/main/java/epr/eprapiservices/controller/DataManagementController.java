package epr.eprapiservices.controller;

import epr.eprapiservices.dao.repository.ProductGroupRepository;
import epr.eprapiservices.dao.repository.ProductCategoryRepository;
import epr.eprapiservices.dao.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/data-management")
@CrossOrigin(origins = "*")
public class DataManagementController {

    @Autowired
    private ProductGroupRepository productGroupRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @DeleteMapping("/clear-all")
    public ResponseEntity<Map<String, Object>> clearAllData() {
        try {
            // Clear data in correct order due to foreign key constraints
            long typesDeleted = productTypeRepository.count();
            productTypeRepository.deleteAll();
            
            long categoriesDeleted = productCategoryRepository.count();
            productCategoryRepository.deleteAll();
            
            long groupsDeleted = productGroupRepository.count();
            productGroupRepository.deleteAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All product data cleared successfully");
            response.put("deletedCounts", Map.of(
                "productTypes", typesDeleted,
                "productCategories", categoriesDeleted,
                "productGroups", groupsDeleted
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error clearing data: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/clear-product-groups")
    public ResponseEntity<Map<String, Object>> clearProductGroups() {
        try {
            long count = productGroupRepository.count();
            productGroupRepository.deleteAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product groups cleared successfully");
            response.put("deletedCount", count);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error clearing product groups: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/clear-product-categories")
    public ResponseEntity<Map<String, Object>> clearProductCategories() {
        try {
            long count = productCategoryRepository.count();
            productCategoryRepository.deleteAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product categories cleared successfully");
            response.put("deletedCount", count);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error clearing product categories: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/clear-product-types")
    public ResponseEntity<Map<String, Object>> clearProductTypes() {
        try {
            long count = productTypeRepository.count();
            productTypeRepository.deleteAll();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product types cleared successfully");
            response.put("deletedCount", count);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error clearing product types: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDataStatus() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("productGroups", productGroupRepository.count());
            response.put("productCategories", productCategoryRepository.count());
            response.put("productTypes", productTypeRepository.count());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error getting data status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
