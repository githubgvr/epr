package epr.eprapiservices.service;

import epr.eprapiservices.entity.ProductCertification;
import epr.eprapiservices.dao.repository.ProductCertificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for ProductCertification operations
 * Handles business logic for product certification management
 */
@Service
@Transactional
public class ProductCertificationService {

    @Autowired
    private ProductCertificationRepository certificationRepository;

    @Value("${app.upload.dir:uploads/certifications}")
    private String uploadDir;

    @Value("${app.upload.max-file-size:10485760}") // 10MB default
    private long maxFileSize;

    /**
     * Get all certifications for a product
     */
    public List<ProductCertification> getCertificationsByProductId(Integer productId) {
        return certificationRepository.findByProductIdAndIsActiveTrue(productId);
    }

    /**
     * Get certification by ID
     */
    public Optional<ProductCertification> getCertificationById(Long certificationId) {
        return certificationRepository.findById(certificationId)
                .filter(cert -> cert.getIsActive());
    }

    /**
     * Get certification by ID and product ID
     */
    public Optional<ProductCertification> getCertificationByIdAndProductId(Long certificationId, Integer productId) {
        return certificationRepository.findByCertificationIdAndProductIdAndIsActiveTrue(certificationId, productId);
    }

    /**
     * Create a new certification
     */
    public ProductCertification createCertification(ProductCertification certification) {
        validateCertification(certification);
        
        // Set default values
        if (certification.getStatus() == null) {
            certification.setStatus("ACTIVE");
        }
        if (certification.getVerificationStatus() == null) {
            certification.setVerificationStatus("NOT_VERIFIED");
        }
        
        return certificationRepository.save(certification);
    }

    /**
     * Update an existing certification
     */
    public ProductCertification updateCertification(Long certificationId, ProductCertification updatedCertification) {
        Optional<ProductCertification> existingOpt = getCertificationById(certificationId);
        
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Certification not found with ID: " + certificationId);
        }
        
        ProductCertification existing = existingOpt.get();
        validateCertification(updatedCertification);
        
        // Update fields
        existing.setCertificationName(updatedCertification.getCertificationName());
        existing.setCertificationType(updatedCertification.getCertificationType());
        existing.setIssuingAuthority(updatedCertification.getIssuingAuthority());
        existing.setCertificateNumber(updatedCertification.getCertificateNumber());
        existing.setIssueDate(updatedCertification.getIssueDate());
        existing.setExpiryDate(updatedCertification.getExpiryDate());
        existing.setStatus(updatedCertification.getStatus());
        existing.setDescription(updatedCertification.getDescription());
        existing.setCompliancePercentage(updatedCertification.getCompliancePercentage());
        existing.setVerificationStatus(updatedCertification.getVerificationStatus());
        existing.setVerificationDate(updatedCertification.getVerificationDate());
        existing.setVerifiedBy(updatedCertification.getVerifiedBy());
        existing.setNotes(updatedCertification.getNotes());
        
        return certificationRepository.save(existing);
    }

    /**
     * Delete a certification (soft delete)
     */
    public void deleteCertification(Long certificationId) {
        Optional<ProductCertification> certificationOpt = getCertificationById(certificationId);
        
        if (certificationOpt.isEmpty()) {
            throw new RuntimeException("Certification not found with ID: " + certificationId);
        }
        
        ProductCertification certification = certificationOpt.get();
        
        // Delete associated file if exists
        if (certification.hasFile()) {
            deleteFile(certification.getFilePath());
        }
        
        // Soft delete
        certification.setIsActive(false);
        certificationRepository.save(certification);
    }

    /**
     * Upload certification file
     */
    public ProductCertification uploadCertificationFile(Long certificationId, MultipartFile file) throws IOException {
        Optional<ProductCertification> certificationOpt = getCertificationById(certificationId);
        
        if (certificationOpt.isEmpty()) {
            throw new RuntimeException("Certification not found with ID: " + certificationId);
        }
        
        ProductCertification certification = certificationOpt.get();
        
        // Validate file
        validateFile(file);
        
        // Delete existing file if any
        if (certification.hasFile()) {
            deleteFile(certification.getFilePath());
        }
        
        // Save new file
        String fileName = saveFile(file);
        String filePath = uploadDir + "/" + fileName;
        
        // Update certification with file info
        certification.setFileName(file.getOriginalFilename());
        certification.setFilePath(filePath);
        certification.setFileType(getFileExtension(file.getOriginalFilename()));
        certification.setFileSize(file.getSize());
        
        return certificationRepository.save(certification);
    }

    /**
     * Get certifications by type
     */
    public List<ProductCertification> getCertificationsByType(String certificationType) {
        return certificationRepository.findByCertificationTypeAndIsActiveTrue(certificationType);
    }

    /**
     * Get certifications by status
     */
    public List<ProductCertification> getCertificationsByStatus(String status) {
        return certificationRepository.findByStatusAndIsActiveTrue(status);
    }

    /**
     * Get expired certifications
     */
    public List<ProductCertification> getExpiredCertifications() {
        return certificationRepository.findExpiredCertifications(LocalDate.now());
    }

    /**
     * Get certifications expiring soon
     */
    public List<ProductCertification> getCertificationsExpiringSoon(int days) {
        LocalDate currentDate = LocalDate.now();
        LocalDate futureDate = currentDate.plusDays(days);
        return certificationRepository.findCertificationsExpiringSoon(currentDate, futureDate);
    }

    /**
     * Search certifications
     */
    public List<ProductCertification> searchCertifications(String searchTerm) {
        return certificationRepository.searchCertifications(searchTerm);
    }

    /**
     * Get all certification types
     */
    public List<String> getAllCertificationTypes() {
        return certificationRepository.findAllCertificationTypes();
    }

    /**
     * Get all issuing authorities
     */
    public List<String> getAllIssuingAuthorities() {
        return certificationRepository.findAllIssuingAuthorities();
    }

    /**
     * Verify a certification
     */
    public ProductCertification verifyCertification(Long certificationId, String verifiedBy) {
        Optional<ProductCertification> certificationOpt = getCertificationById(certificationId);
        
        if (certificationOpt.isEmpty()) {
            throw new RuntimeException("Certification not found with ID: " + certificationId);
        }
        
        ProductCertification certification = certificationOpt.get();
        certification.setVerificationStatus("VERIFIED");
        certification.setVerificationDate(LocalDate.now());
        certification.setVerifiedBy(verifiedBy);
        
        return certificationRepository.save(certification);
    }

    /**
     * Reject a certification
     */
    public ProductCertification rejectCertification(Long certificationId, String rejectedBy, String reason) {
        Optional<ProductCertification> certificationOpt = getCertificationById(certificationId);
        
        if (certificationOpt.isEmpty()) {
            throw new RuntimeException("Certification not found with ID: " + certificationId);
        }
        
        ProductCertification certification = certificationOpt.get();
        certification.setVerificationStatus("REJECTED");
        certification.setVerificationDate(LocalDate.now());
        certification.setVerifiedBy(rejectedBy);
        certification.setNotes(reason);
        
        return certificationRepository.save(certification);
    }

    /**
     * Get certification statistics for a product
     */
    public CertificationStats getCertificationStats(Integer productId) {
        List<ProductCertification> certifications = getCertificationsByProductId(productId);

        long total = certifications.size();
        long verified = certifications.stream().mapToLong(cert -> cert.isVerified() ? 1 : 0).sum();
        long expired = certifications.stream().mapToLong(cert -> cert.isExpired() ? 1 : 0).sum();
        long expiringSoon = certifications.stream().mapToLong(cert -> cert.isExpiringSoon(30) ? 1 : 0).sum();

        return new CertificationStats(total, verified, expired, expiringSoon);
    }

    // Private helper methods
    
    private void validateCertification(ProductCertification certification) {
        if (certification.getCertificationName() == null || certification.getCertificationName().trim().isEmpty()) {
            throw new IllegalArgumentException("Certification name is required");
        }
        
        if (certification.getCertificationType() == null || certification.getCertificationType().trim().isEmpty()) {
            throw new IllegalArgumentException("Certification type is required");
        }
        
        if (certification.getProductId() == null) {
            throw new IllegalArgumentException("Product ID is required");
        }
        
        // Validate date logic
        if (certification.getIssueDate() != null && certification.getExpiryDate() != null) {
            if (certification.getExpiryDate().isBefore(certification.getIssueDate())) {
                throw new IllegalArgumentException("Expiry date cannot be before issue date");
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size");
        }
        
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name is required");
        }
        
        String fileExtension = getFileExtension(fileName).toLowerCase();
        if (!isAllowedFileType(fileExtension)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: PDF, JPG, JPEG, PNG, DOC, DOCX");
        }
    }

    private boolean isAllowedFileType(String fileExtension) {
        return List.of("pdf", "jpg", "jpeg", "png", "doc", "docx").contains(fileExtension.toLowerCase());
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    private String saveFile(MultipartFile file) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique file name
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
        
        // Save file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return uniqueFileName;
    }

    private void deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete file: " + filePath + ", Error: " + e.getMessage());
        }
    }

    // Inner class for certification statistics
    public static class CertificationStats {
        private final long total;
        private final long verified;
        private final long expired;
        private final long expiringSoon;

        public CertificationStats(long total, long verified, long expired, long expiringSoon) {
            this.total = total;
            this.verified = verified;
            this.expired = expired;
            this.expiringSoon = expiringSoon;
        }

        // Getters
        public long getTotal() { return total; }
        public long getVerified() { return verified; }
        public long getExpired() { return expired; }
        public long getExpiringSoon() { return expiringSoon; }
    }
}
