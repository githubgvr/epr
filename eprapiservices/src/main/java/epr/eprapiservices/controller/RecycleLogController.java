package epr.eprapiservices.controller;

import epr.eprapiservices.entity.RecycleLog;
import epr.eprapiservices.service.RecycleLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for RecycleLog management operations
 */
@RestController
@RequestMapping("/api/recycle-logs")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class RecycleLogController {

    @Autowired
    private RecycleLogService recycleLogService;

    /**
     * Get all active recycle logs
     */
    @GetMapping
    public ResponseEntity<List<RecycleLog>> getAllRecycleLogs() {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getAllActiveRecycleLogs();
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle log by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecycleLog> getRecycleLogById(@PathVariable Integer id) {
        try {
            Optional<RecycleLog> recycleLog = recycleLogService.getRecycleLogById(id);
            return recycleLog.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new recycle log
     */
    @PostMapping
    public ResponseEntity<RecycleLog> createRecycleLog(@Valid @RequestBody RecycleLog recycleLog) {
        try {
            if (!recycleLogService.validateRecycleLog(recycleLog)) {
                return ResponseEntity.badRequest().build();
            }
            
            RecycleLog createdRecycleLog = recycleLogService.createRecycleLog(recycleLog);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecycleLog);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing recycle log
     */
    @PutMapping("/{id}")
    public ResponseEntity<RecycleLog> updateRecycleLog(@PathVariable Integer id, 
                                                      @Valid @RequestBody RecycleLog recycleLogDetails) {
        try {
            if (!recycleLogService.validateRecycleLog(recycleLogDetails)) {
                return ResponseEntity.badRequest().build();
            }
            
            RecycleLog updatedRecycleLog = recycleLogService.updateRecycleLog(id, recycleLogDetails);
            return ResponseEntity.ok(updatedRecycleLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a recycle log (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecycleLog(@PathVariable Integer id) {
        try {
            recycleLogService.deleteRecycleLog(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search recycle logs by material type
     */
    @GetMapping("/search/material-type")
    public ResponseEntity<List<RecycleLog>> searchByMaterialType(@RequestParam String materialType) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.searchByMaterialType(materialType);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search recycle logs by recycler name
     */
    @GetMapping("/search/recycler-name")
    public ResponseEntity<List<RecycleLog>> searchByRecyclerName(@RequestParam String recyclerName) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.searchByRecyclerName(recyclerName);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle logs by recycler ID
     */
    @GetMapping("/recycler/{recyclerId}")
    public ResponseEntity<List<RecycleLog>> getRecycleLogsByRecyclerId(@PathVariable String recyclerId) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecycleLogsByRecyclerId(recyclerId);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle logs by processing method
     */
    @GetMapping("/processing-method/{processingMethod}")
    public ResponseEntity<List<RecycleLog>> getRecycleLogsByProcessingMethod(
            @PathVariable RecycleLog.ProcessingMethod processingMethod) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecycleLogsByProcessingMethod(processingMethod);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle logs by quality grade
     */
    @GetMapping("/quality-grade/{qualityGrade}")
    public ResponseEntity<List<RecycleLog>> getRecycleLogsByQualityGrade(
            @PathVariable RecycleLog.QualityGrade qualityGrade) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecycleLogsByQualityGrade(qualityGrade);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle logs by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<RecycleLog>> getRecycleLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecycleLogsByDateRange(startDate, endDate);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search recycle logs by location
     */
    @GetMapping("/search/location")
    public ResponseEntity<List<RecycleLog>> searchByLocation(@RequestParam String location) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.searchByLocation(location);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycle logs by batch number
     */
    @GetMapping("/batch/{batchNumber}")
    public ResponseEntity<List<RecycleLog>> getRecycleLogsByBatchNumber(@PathVariable String batchNumber) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecycleLogsByBatchNumber(batchNumber);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total quantity recycled by material type
     */
    @GetMapping("/stats/quantity/material-type/{materialType}")
    public ResponseEntity<Double> getTotalQuantityByMaterialType(@PathVariable String materialType) {
        try {
            Double totalQuantity = recycleLogService.getTotalQuantityByMaterialType(materialType);
            return ResponseEntity.ok(totalQuantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total quantity recycled by recycler
     */
    @GetMapping("/stats/quantity/recycler/{recyclerId}")
    public ResponseEntity<Double> getTotalQuantityByRecycler(@PathVariable String recyclerId) {
        try {
            Double totalQuantity = recycleLogService.getTotalQuantityByRecycler(recyclerId);
            return ResponseEntity.ok(totalQuantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycling statistics by processing method
     */
    @GetMapping("/stats/processing-method")
    public ResponseEntity<List<Object[]>> getRecyclingStatsByProcessingMethod() {
        try {
            List<Object[]> stats = recycleLogService.getRecyclingStatsByProcessingMethod();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recycling statistics by quality grade
     */
    @GetMapping("/stats/quality-grade")
    public ResponseEntity<List<Object[]>> getRecyclingStatsByQualityGrade() {
        try {
            List<Object[]> stats = recycleLogService.getRecyclingStatsByQualityGrade();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent recycle logs (last 30 days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<RecycleLog>> getRecentRecycleLogs() {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.getRecentRecycleLogs();
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search recycle logs by multiple criteria
     */
    @GetMapping("/search")
    public ResponseEntity<List<RecycleLog>> searchRecycleLogs(
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String recyclerName,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) RecycleLog.ProcessingMethod processingMethod,
            @RequestParam(required = false) RecycleLog.QualityGrade qualityGrade) {
        try {
            List<RecycleLog> recycleLogs = recycleLogService.searchRecycleLogs(
                    materialType, recyclerName, location, processingMethod, qualityGrade);
            return ResponseEntity.ok(recycleLogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
