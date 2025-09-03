package epr.eprapiservices.controller;

import epr.eprapiservices.entity.RecyclingCertification;
import epr.eprapiservices.service.RecyclingCertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for RecyclingCertification management operations
 */
@RestController
@RequestMapping("/api/recycling-certifications")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class RecyclingCertificationController {

    @Autowired
    private RecyclingCertificationService recyclingCertificationService;

    /**
     * Get all active recycling certifications
     */
    @GetMapping
    public ResponseEntity<List<RecyclingCertification>> getAllCertifications() {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getAllActiveCertifications();
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certification by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecyclingCertification> getCertificationById(@PathVariable Integer id) {
        try {
            Optional<RecyclingCertification> certification = recyclingCertificationService.getCertificationById(id);
            return certification.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certification by certification number
     */
    @GetMapping("/number/{certificationNumber}")
    public ResponseEntity<RecyclingCertification> getCertificationByNumber(@PathVariable String certificationNumber) {
        try {
            Optional<RecyclingCertification> certification = recyclingCertificationService.getCertificationByNumber(certificationNumber);
            return certification.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new recycling certification
     */
    @PostMapping
    public ResponseEntity<RecyclingCertification> createCertification(@Valid @RequestBody RecyclingCertification certification) {
        try {
            if (!recyclingCertificationService.validateCertification(certification)) {
                return ResponseEntity.badRequest().build();
            }
            
            RecyclingCertification createdCertification = recyclingCertificationService.createCertification(certification);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCertification);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Certification number already exists
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing recycling certification
     */
    @PutMapping("/{id}")
    public ResponseEntity<RecyclingCertification> updateCertification(@PathVariable Integer id, 
                                                                    @Valid @RequestBody RecyclingCertification certificationDetails) {
        try {
            if (!recyclingCertificationService.validateCertification(certificationDetails)) {
                return ResponseEntity.badRequest().build();
            }
            
            RecyclingCertification updatedCertification = recyclingCertificationService.updateCertification(id, certificationDetails);
            return ResponseEntity.ok(updatedCertification);
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
     * Delete a recycling certification (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Integer id) {
        try {
            recyclingCertificationService.deleteCertification(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications by name
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<RecyclingCertification>> searchByName(@RequestParam String name) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.searchByName(name);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certifications by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<RecyclingCertification>> getCertificationsByType(
            @PathVariable RecyclingCertification.CertificationType type) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getCertificationsByType(type);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications by issuing authority
     */
    @GetMapping("/search/authority")
    public ResponseEntity<List<RecyclingCertification>> searchByIssuingAuthority(@RequestParam String authority) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.searchByIssuingAuthority(authority);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications by material type
     */
    @GetMapping("/search/material-type")
    public ResponseEntity<List<RecyclingCertification>> searchByMaterialType(@RequestParam String materialType) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.searchByMaterialType(materialType);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications by recycler name
     */
    @GetMapping("/search/recycler-name")
    public ResponseEntity<List<RecyclingCertification>> searchByRecyclerName(@RequestParam String recyclerName) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.searchByRecyclerName(recyclerName);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certifications by recycler ID
     */
    @GetMapping("/recycler/{recyclerId}")
    public ResponseEntity<List<RecyclingCertification>> getCertificationsByRecyclerId(@PathVariable String recyclerId) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getCertificationsByRecyclerId(recyclerId);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certifications by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RecyclingCertification>> getCertificationsByStatus(
            @PathVariable RecyclingCertification.CertificationStatus status) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getCertificationsByStatus(status);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certifications expiring within specified days
     */
    @GetMapping("/expiring/{days}")
    public ResponseEntity<List<RecyclingCertification>> getCertificationsExpiringWithinDays(@PathVariable int days) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getCertificationsExpiringWithinDays(days);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get expired certifications
     */
    @GetMapping("/expired")
    public ResponseEntity<List<RecyclingCertification>> getExpiredCertifications() {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getExpiredCertifications();
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get valid certifications
     */
    @GetMapping("/valid")
    public ResponseEntity<List<RecyclingCertification>> getValidCertifications() {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getValidCertifications();
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certifications by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<RecyclingCertification>> getCertificationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.getCertificationsByDateRange(startDate, endDate);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if certification number exists
     */
    @GetMapping("/exists/number/{certificationNumber}")
    public ResponseEntity<Boolean> checkCertificationNumberExists(@PathVariable String certificationNumber) {
        try {
            boolean exists = recyclingCertificationService.isCertificationNumberExists(certificationNumber);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certification statistics by type
     */
    @GetMapping("/stats/type")
    public ResponseEntity<List<Object[]>> getCertificationStatsByType() {
        try {
            List<Object[]> stats = recyclingCertificationService.getCertificationStatsByType();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certification statistics by status
     */
    @GetMapping("/stats/status")
    public ResponseEntity<List<Object[]>> getCertificationStatsByStatus() {
        try {
            List<Object[]> stats = recyclingCertificationService.getCertificationStatsByStatus();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications by multiple criteria
     */
    @GetMapping("/search")
    public ResponseEntity<List<RecyclingCertification>> searchCertifications(
            @RequestParam(required = false) String certificationName,
            @RequestParam(required = false) RecyclingCertification.CertificationType certificationType,
            @RequestParam(required = false) String issuingAuthority,
            @RequestParam(required = false) String materialType,
            @RequestParam(required = false) String recyclerName,
            @RequestParam(required = false) RecyclingCertification.CertificationStatus certificationStatus) {
        try {
            List<RecyclingCertification> certifications = recyclingCertificationService.searchCertifications(
                    certificationName, certificationType, issuingAuthority, materialType, recyclerName, certificationStatus);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update expired certifications status
     */
    @PostMapping("/update-expired")
    public ResponseEntity<Void> updateExpiredCertifications() {
        try {
            recyclingCertificationService.updateExpiredCertifications();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
