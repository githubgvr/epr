package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.RecyclingCertificationRepository;
import epr.eprapiservices.entity.RecyclingCertification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for RecyclingCertification entity operations
 */
@Service
@Transactional
public class RecyclingCertificationService {

    @Autowired
    private RecyclingCertificationRepository recyclingCertificationRepository;

    /**
     * Get all active recycling certifications
     */
    public List<RecyclingCertification> getAllActiveCertifications() {
        return recyclingCertificationRepository.findAllActive();
    }

    /**
     * Get certification by ID
     */
    public Optional<RecyclingCertification> getCertificationById(Integer certificationId) {
        return recyclingCertificationRepository.findById(certificationId);
    }

    /**
     * Get certification by certification number
     */
    public Optional<RecyclingCertification> getCertificationByNumber(String certificationNumber) {
        return recyclingCertificationRepository.findByCertificationNumber(certificationNumber);
    }

    /**
     * Create a new recycling certification
     */
    public RecyclingCertification createCertification(RecyclingCertification certification) {
        // Check if certification number already exists
        if (isCertificationNumberExists(certification.getCertificationNumber())) {
            throw new RuntimeException("Certification number already exists: " + certification.getCertificationNumber());
        }
        
        certification.setCertificationId(null); // Ensure it's a new entity
        return recyclingCertificationRepository.save(certification);
    }

    /**
     * Update an existing recycling certification
     */
    public RecyclingCertification updateCertification(Integer certificationId, RecyclingCertification certificationDetails) {
        Optional<RecyclingCertification> optionalCertification = recyclingCertificationRepository.findById(certificationId);
        if (optionalCertification.isPresent()) {
            RecyclingCertification existingCertification = optionalCertification.get();
            
            // Check if certification number is being changed and if it already exists
            if (!existingCertification.getCertificationNumber().equals(certificationDetails.getCertificationNumber())) {
                if (recyclingCertificationRepository.existsByCertificationNumberIgnoreCaseAndCertificationIdNot(
                        certificationDetails.getCertificationNumber(), certificationId)) {
                    throw new RuntimeException("Certification number already exists: " + certificationDetails.getCertificationNumber());
                }
            }
            
            // Update fields
            existingCertification.setCertificationName(certificationDetails.getCertificationName());
            existingCertification.setCertificationNumber(certificationDetails.getCertificationNumber());
            existingCertification.setCertificationType(certificationDetails.getCertificationType());
            existingCertification.setIssuingAuthority(certificationDetails.getIssuingAuthority());
            existingCertification.setIssueDate(certificationDetails.getIssueDate());
            existingCertification.setExpiryDate(certificationDetails.getExpiryDate());
            existingCertification.setMaterialType(certificationDetails.getMaterialType());
            existingCertification.setRecyclerName(certificationDetails.getRecyclerName());
            existingCertification.setRecyclerId(certificationDetails.getRecyclerId());
            existingCertification.setCertificationStatus(certificationDetails.getCertificationStatus());
            existingCertification.setCertificationFilePath(certificationDetails.getCertificationFilePath());
            existingCertification.setDescription(certificationDetails.getDescription());
            existingCertification.setScope(certificationDetails.getScope());
            existingCertification.setStandards(certificationDetails.getStandards());
            
            return recyclingCertificationRepository.save(existingCertification);
        } else {
            throw new RuntimeException("RecyclingCertification not found with id: " + certificationId);
        }
    }

    /**
     * Delete a recycling certification (soft delete)
     */
    public void deleteCertification(Integer certificationId) {
        Optional<RecyclingCertification> optionalCertification = recyclingCertificationRepository.findById(certificationId);
        if (optionalCertification.isPresent()) {
            RecyclingCertification certification = optionalCertification.get();
            certification.setIsActive(false);
            recyclingCertificationRepository.save(certification);
        } else {
            throw new RuntimeException("RecyclingCertification not found with id: " + certificationId);
        }
    }

    /**
     * Search certifications by name
     */
    public List<RecyclingCertification> searchByName(String name) {
        return recyclingCertificationRepository.findByCertificationNameContainingIgnoreCase(name);
    }

    /**
     * Get certifications by type
     */
    public List<RecyclingCertification> getCertificationsByType(RecyclingCertification.CertificationType type) {
        return recyclingCertificationRepository.findByCertificationType(type);
    }

    /**
     * Search certifications by issuing authority
     */
    public List<RecyclingCertification> searchByIssuingAuthority(String authority) {
        return recyclingCertificationRepository.findByIssuingAuthorityContainingIgnoreCase(authority);
    }

    /**
     * Search certifications by material type
     */
    public List<RecyclingCertification> searchByMaterialType(String materialType) {
        return recyclingCertificationRepository.findByMaterialTypeContainingIgnoreCase(materialType);
    }

    /**
     * Search certifications by recycler name
     */
    public List<RecyclingCertification> searchByRecyclerName(String recyclerName) {
        return recyclingCertificationRepository.findByRecyclerNameContainingIgnoreCase(recyclerName);
    }

    /**
     * Get certifications by recycler ID
     */
    public List<RecyclingCertification> getCertificationsByRecyclerId(String recyclerId) {
        return recyclingCertificationRepository.findByRecyclerId(recyclerId);
    }

    /**
     * Get certifications by status
     */
    public List<RecyclingCertification> getCertificationsByStatus(RecyclingCertification.CertificationStatus status) {
        return recyclingCertificationRepository.findByCertificationStatus(status);
    }

    /**
     * Get certifications expiring within specified days
     */
    public List<RecyclingCertification> getCertificationsExpiringWithinDays(int days) {
        LocalDate expiryDate = LocalDate.now().plusDays(days);
        return recyclingCertificationRepository.findCertificationsExpiringBefore(expiryDate);
    }

    /**
     * Get expired certifications
     */
    public List<RecyclingCertification> getExpiredCertifications() {
        return recyclingCertificationRepository.findExpiredCertifications();
    }

    /**
     * Get valid certifications
     */
    public List<RecyclingCertification> getValidCertifications() {
        return recyclingCertificationRepository.findValidCertifications();
    }

    /**
     * Get certifications by date range
     */
    public List<RecyclingCertification> getCertificationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return recyclingCertificationRepository.findByIssueDateBetween(startDate, endDate);
    }

    /**
     * Check if certification number exists
     */
    public boolean isCertificationNumberExists(String certificationNumber) {
        return recyclingCertificationRepository.existsByCertificationNumberIgnoreCase(certificationNumber);
    }

    /**
     * Get certification statistics by type
     */
    public List<Object[]> getCertificationStatsByType() {
        return recyclingCertificationRepository.getCertificationStatsByType();
    }

    /**
     * Get certification statistics by status
     */
    public List<Object[]> getCertificationStatsByStatus() {
        return recyclingCertificationRepository.getCertificationStatsByStatus();
    }

    /**
     * Search certifications by multiple criteria
     */
    public List<RecyclingCertification> searchCertifications(String certificationName,
                                                           RecyclingCertification.CertificationType certificationType,
                                                           String issuingAuthority, String materialType,
                                                           String recyclerName,
                                                           RecyclingCertification.CertificationStatus certificationStatus) {
        return recyclingCertificationRepository.searchCertifications(certificationName, certificationType,
                issuingAuthority, materialType, recyclerName, certificationStatus);
    }

    /**
     * Update certification status based on expiry date
     */
    public void updateExpiredCertifications() {
        List<RecyclingCertification> expiredCertifications = getExpiredCertifications();
        for (RecyclingCertification certification : expiredCertifications) {
            certification.setCertificationStatus(RecyclingCertification.CertificationStatus.EXPIRED);
            recyclingCertificationRepository.save(certification);
        }
    }

    /**
     * Validate certification data
     */
    public boolean validateCertification(RecyclingCertification certification) {
        if (certification == null) {
            return false;
        }
        
        // Check required fields
        if (certification.getCertificationName() == null || certification.getCertificationName().trim().isEmpty()) {
            return false;
        }
        
        if (certification.getCertificationNumber() == null || certification.getCertificationNumber().trim().isEmpty()) {
            return false;
        }
        
        if (certification.getIssuingAuthority() == null || certification.getIssuingAuthority().trim().isEmpty()) {
            return false;
        }
        
        if (certification.getMaterialType() == null || certification.getMaterialType().trim().isEmpty()) {
            return false;
        }
        
        if (certification.getRecyclerName() == null || certification.getRecyclerName().trim().isEmpty()) {
            return false;
        }
        
        if (certification.getIssueDate() == null || certification.getExpiryDate() == null) {
            return false;
        }
        
        // Check if expiry date is after issue date
        if (certification.getExpiryDate().isBefore(certification.getIssueDate())) {
            return false;
        }
        
        return true;
    }
}
