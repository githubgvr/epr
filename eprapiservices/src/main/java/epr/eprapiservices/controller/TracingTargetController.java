package epr.eprapiservices.controller;

import epr.eprapiservices.entity.TracingTarget;
import epr.eprapiservices.service.TracingTargetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for TracingTarget management operations
 */
@RestController
@RequestMapping("/api/tracing-targets")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class TracingTargetController {

    @Autowired
    private TracingTargetService tracingTargetService;

    /**
     * Get all active tracing targets
     */
    @GetMapping
    public ResponseEntity<List<TracingTarget>> getAllTargets() {
        try {
            List<TracingTarget> targets = tracingTargetService.getAllActiveTargets();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get target by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TracingTarget> getTargetById(@PathVariable Integer id) {
        try {
            Optional<TracingTarget> target = tracingTargetService.getTargetById(id);
            return target.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new tracing target
     */
    @PostMapping
    public ResponseEntity<TracingTarget> createTarget(@Valid @RequestBody TracingTarget target) {
        try {
            if (!tracingTargetService.validateTarget(target)) {
                return ResponseEntity.badRequest().build();
            }
            
            TracingTarget createdTarget = tracingTargetService.createTarget(target);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTarget);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing tracing target
     */
    @PutMapping("/{id}")
    public ResponseEntity<TracingTarget> updateTarget(@PathVariable Integer id, 
                                                     @Valid @RequestBody TracingTarget targetDetails) {
        try {
            if (!tracingTargetService.validateTarget(targetDetails)) {
                return ResponseEntity.badRequest().build();
            }
            
            TracingTarget updatedTarget = tracingTargetService.updateTarget(id, targetDetails);
            return ResponseEntity.ok(updatedTarget);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a tracing target (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTarget(@PathVariable Integer id) {
        try {
            tracingTargetService.deleteTarget(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update achieved quantity for a target
     */
    @PatchMapping("/{id}/achieved-quantity")
    public ResponseEntity<TracingTarget> updateAchievedQuantity(@PathVariable Integer id, 
                                                               @RequestBody BigDecimal achievedQuantity) {
        try {
            TracingTarget updatedTarget = tracingTargetService.updateAchievedQuantity(id, achievedQuantity);
            return ResponseEntity.ok(updatedTarget);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search targets by name
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<TracingTarget>> searchByTargetName(@RequestParam String name) {
        try {
            List<TracingTarget> targets = tracingTargetService.searchByTargetName(name);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search targets by material type
     */
    @GetMapping("/search/material-type")
    public ResponseEntity<List<TracingTarget>> searchByMaterialType(@RequestParam String materialType) {
        try {
            List<TracingTarget> targets = tracingTargetService.searchByMaterialType(materialType);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets by target type
     */
    @GetMapping("/type/{targetType}")
    public ResponseEntity<List<TracingTarget>> getTargetsByType(@PathVariable TracingTarget.TargetType targetType) {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsByType(targetType);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets by priority level
     */
    @GetMapping("/priority/{priorityLevel}")
    public ResponseEntity<List<TracingTarget>> getTargetsByPriority(@PathVariable TracingTarget.PriorityLevel priorityLevel) {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsByPriority(priorityLevel);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets by status
     */
    @GetMapping("/status/{targetStatus}")
    public ResponseEntity<List<TracingTarget>> getTargetsByStatus(@PathVariable TracingTarget.TargetStatus targetStatus) {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsByStatus(targetStatus);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search targets by responsible party
     */
    @GetMapping("/search/responsible-party")
    public ResponseEntity<List<TracingTarget>> searchByResponsibleParty(@RequestParam String responsibleParty) {
        try {
            List<TracingTarget> targets = tracingTargetService.searchByResponsibleParty(responsibleParty);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search targets by location
     */
    @GetMapping("/search/location")
    public ResponseEntity<List<TracingTarget>> searchByLocation(@RequestParam String location) {
        try {
            List<TracingTarget> targets = tracingTargetService.searchByLocation(location);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<TracingTarget>> getTargetsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsByDateRange(startDate, endDate);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get overdue targets
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<TracingTarget>> getOverdueTargets() {
        try {
            List<TracingTarget> targets = tracingTargetService.getOverdueTargets();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets due within specified days
     */
    @GetMapping("/due/{days}")
    public ResponseEntity<List<TracingTarget>> getTargetsDueWithinDays(@PathVariable int days) {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsDueWithinDays(days);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get active targets (not completed, cancelled, or exceeded)
     */
    @GetMapping("/active")
    public ResponseEntity<List<TracingTarget>> getActiveTargets() {
        try {
            List<TracingTarget> targets = tracingTargetService.getActiveTargets();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get completed targets
     */
    @GetMapping("/completed")
    public ResponseEntity<List<TracingTarget>> getCompletedTargets() {
        try {
            List<TracingTarget> targets = tracingTargetService.getCompletedTargets();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get high priority targets
     */
    @GetMapping("/high-priority")
    public ResponseEntity<List<TracingTarget>> getHighPriorityTargets() {
        try {
            List<TracingTarget> targets = tracingTargetService.getHighPriorityTargets();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get targets at risk
     */
    @GetMapping("/at-risk")
    public ResponseEntity<List<TracingTarget>> getTargetsAtRisk() {
        try {
            List<TracingTarget> targets = tracingTargetService.getTargetsAtRisk();
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get target statistics by type
     */
    @GetMapping("/stats/type")
    public ResponseEntity<List<Object[]>> getTargetStatsByType() {
        try {
            List<Object[]> stats = tracingTargetService.getTargetStatsByType();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get target statistics by status
     */
    @GetMapping("/stats/status")
    public ResponseEntity<List<Object[]>> getTargetStatsByStatus() {
        try {
            List<Object[]> stats = tracingTargetService.getTargetStatsByStatus();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get target statistics by priority level
     */
    @GetMapping("/stats/priority")
    public ResponseEntity<List<Object[]>> getTargetStatsByPriority() {
        try {
            List<Object[]> stats = tracingTargetService.getTargetStatsByPriority();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get overall progress by material type
     */
    @GetMapping("/progress/material-type")
    public ResponseEntity<List<Object[]>> getProgressByMaterialType() {
        try {
            List<Object[]> progress = tracingTargetService.getProgressByMaterialType();
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search targets by multiple criteria
     */
    @GetMapping("/search")
    public ResponseEntity<List<TracingTarget>> searchTargets(
            @RequestParam(required = false) String targetName,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) TracingTarget.TargetType targetType,
            @RequestParam(required = false) TracingTarget.PriorityLevel priorityLevel,
            @RequestParam(required = false) TracingTarget.TargetStatus targetStatus,
            @RequestParam(required = false) String responsibleParty,
            @RequestParam(required = false) String location) {
        try {
            List<TracingTarget> targets = tracingTargetService.searchTargets(
                    targetName, materialType, targetType, priorityLevel, targetStatus, responsibleParty, location);
            return ResponseEntity.ok(targets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update all target statuses based on current date and progress
     */
    @PostMapping("/update-statuses")
    public ResponseEntity<Void> updateTargetStatuses() {
        try {
            tracingTargetService.updateTargetStatuses();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
