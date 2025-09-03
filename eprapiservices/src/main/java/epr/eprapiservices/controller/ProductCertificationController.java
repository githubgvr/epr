package epr.eprapiservices.controller;

import epr.eprapiservices.entity.ProductCertification;
import epr.eprapiservices.service.ProductCertificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for ProductCertification operations
 * Handles HTTP requests for product certification management
 */
@RestController
@RequestMapping("/api/products/{productId}/certifications")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class ProductCertificationController {

    @Autowired
    private ProductCertificationService certificationService;

    /**
     * Get all certifications for a product
     */
    @GetMapping
    public ResponseEntity<List<ProductCertification>> getCertificationsByProductId(@PathVariable Integer productId) {
        try {
            List<ProductCertification> certifications = certificationService.getCertificationsByProductId(productId);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get a specific certification by ID
     */
    @GetMapping("/{certificationId}")
    public ResponseEntity<ProductCertification> getCertificationById(
            @PathVariable Integer productId,
            @PathVariable Long certificationId) {
        try {
            Optional<ProductCertification> certification = certificationService.getCertificationByIdAndProductId(certificationId, productId);
            return certification.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new certification
     */
    @PostMapping
    public ResponseEntity<ProductCertification> createCertification(
            @PathVariable Integer productId,
            @Valid @RequestBody ProductCertification certification) {
        try {
            certification.setProductId(productId);
            ProductCertification createdCertification = certificationService.createCertification(certification);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCertification);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing certification
     */
    @PutMapping("/{certificationId}")
    public ResponseEntity<ProductCertification> updateCertification(
            @PathVariable Integer productId,
            @PathVariable Long certificationId,
            @Valid @RequestBody ProductCertification certification) {
        try {
            certification.setProductId(productId);
            ProductCertification updatedCertification = certificationService.updateCertification(certificationId, certification);
            return ResponseEntity.ok(updatedCertification);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a certification
     */
    @DeleteMapping("/{certificationId}")
    public ResponseEntity<Void> deleteCertification(
            @PathVariable Integer productId,
            @PathVariable Long certificationId) {
        try {
            certificationService.deleteCertification(certificationId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Upload certification file
     */
    @PostMapping("/{certificationId}/upload")
    public ResponseEntity<ProductCertification> uploadCertificationFile(
            @PathVariable Integer productId,
            @PathVariable Long certificationId,
            @RequestParam("file") MultipartFile file) {
        try {
            ProductCertification updatedCertification = certificationService.uploadCertificationFile(certificationId, file);
            return ResponseEntity.ok(updatedCertification);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Download certification file
     */
    @GetMapping("/{certificationId}/download")
    public ResponseEntity<Resource> downloadCertificationFile(
            @PathVariable Integer productId,
            @PathVariable Long certificationId) {
        try {
            Optional<ProductCertification> certificationOpt = certificationService.getCertificationByIdAndProductId(certificationId, productId);
            
            if (certificationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            ProductCertification certification = certificationOpt.get();
            
            if (!certification.hasFile()) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get(certification.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            String contentType = getContentType(certification.getFileType());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + certification.getFileName() + "\"")
                    .body(resource);
                    
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Verify a certification
     */
    @PostMapping("/{certificationId}/verify")
    public ResponseEntity<ProductCertification> verifyCertification(
            @PathVariable Integer productId,
            @PathVariable Long certificationId,
            @RequestBody Map<String, String> request) {
        try {
            String verifiedBy = request.get("verifiedBy");
            if (verifiedBy == null || verifiedBy.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            ProductCertification verifiedCertification = certificationService.verifyCertification(certificationId, verifiedBy);
            return ResponseEntity.ok(verifiedCertification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Reject a certification
     */
    @PostMapping("/{certificationId}/reject")
    public ResponseEntity<ProductCertification> rejectCertification(
            @PathVariable Integer productId,
            @PathVariable Long certificationId,
            @RequestBody Map<String, String> request) {
        try {
            String rejectedBy = request.get("rejectedBy");
            String reason = request.get("reason");
            
            if (rejectedBy == null || rejectedBy.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            ProductCertification rejectedCertification = certificationService.rejectCertification(certificationId, rejectedBy, reason);
            return ResponseEntity.ok(rejectedCertification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get certification statistics for a product
     */
    @GetMapping("/stats")
    public ResponseEntity<ProductCertificationService.CertificationStats> getCertificationStats(@PathVariable Integer productId) {
        try {
            ProductCertificationService.CertificationStats stats = certificationService.getCertificationStats(productId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Additional endpoints for global certification operations
    
    /**
     * Get all certification types
     */
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllCertificationTypes() {
        try {
            List<String> types = certificationService.getAllCertificationTypes();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all issuing authorities
     */
    @GetMapping("/authorities")
    public ResponseEntity<List<String>> getAllIssuingAuthorities() {
        try {
            List<String> authorities = certificationService.getAllIssuingAuthorities();
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search certifications
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductCertification>> searchCertifications(@RequestParam String q) {
        try {
            List<ProductCertification> certifications = certificationService.searchCertifications(q);
            return ResponseEntity.ok(certifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper methods
    
    private String getContentType(String fileExtension) {
        if (fileExtension == null) {
            return "application/octet-stream";
        }
        
        switch (fileExtension.toLowerCase()) {
            case "pdf":
                return "application/pdf";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
                return "application/octet-stream";
        }
    }
}
