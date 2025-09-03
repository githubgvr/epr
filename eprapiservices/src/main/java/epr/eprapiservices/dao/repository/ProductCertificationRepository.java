package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductCertification entity
 * Provides data access methods for product certification operations
 */
@Repository
public interface ProductCertificationRepository extends JpaRepository<ProductCertification, Long> {

    /**
     * Find all certifications for a specific product
     */
    List<ProductCertification> findByProductIdAndIsActiveTrue(Integer productId);

    /**
     * Find all active certifications for a specific product
     */
    List<ProductCertification> findByProductId(Integer productId);

    /**
     * Find certification by ID and product ID
     */
    Optional<ProductCertification> findByCertificationIdAndProductIdAndIsActiveTrue(Long certificationId, Integer productId);

    /**
     * Find certifications by type
     */
    List<ProductCertification> findByCertificationTypeAndIsActiveTrue(String certificationType);

    /**
     * Find certifications by status
     */
    List<ProductCertification> findByStatusAndIsActiveTrue(String status);

    /**
     * Find certifications by verification status
     */
    List<ProductCertification> findByVerificationStatusAndIsActiveTrue(String verificationStatus);

    /**
     * Find certifications by issuing authority
     */
    List<ProductCertification> findByIssuingAuthorityAndIsActiveTrue(String issuingAuthority);

    /**
     * Find certifications expiring within a date range
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.expiryDate BETWEEN :startDate AND :endDate AND pc.isActive = true")
    List<ProductCertification> findCertificationsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find expired certifications
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.expiryDate < :currentDate AND pc.isActive = true")
    List<ProductCertification> findExpiredCertifications(@Param("currentDate") LocalDate currentDate);

    /**
     * Find certifications expiring soon (within specified days)
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.expiryDate BETWEEN :currentDate AND :futureDate AND pc.isActive = true")
    List<ProductCertification> findCertificationsExpiringSoon(@Param("currentDate") LocalDate currentDate, @Param("futureDate") LocalDate futureDate);

    /**
     * Find certifications by certificate number
     */
    Optional<ProductCertification> findByCertificateNumberAndIsActiveTrue(String certificateNumber);

    /**
     * Find certifications with files
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.filePath IS NOT NULL AND pc.filePath != '' AND pc.isActive = true")
    List<ProductCertification> findCertificationsWithFiles();

    /**
     * Find certifications without files
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE (pc.filePath IS NULL OR pc.filePath = '') AND pc.isActive = true")
    List<ProductCertification> findCertificationsWithoutFiles();



    /**
     * Count certifications by product
     */
    @Query("SELECT COUNT(pc) FROM ProductCertification pc WHERE pc.productId = :productId AND pc.isActive = true")
    Long countByProductId(@Param("productId") Integer productId);

    /**
     * Count certifications by status
     */
    @Query("SELECT COUNT(pc) FROM ProductCertification pc WHERE pc.status = :status AND pc.isActive = true")
    Long countByStatus(@Param("status") String status);

    /**
     * Count expired certifications
     */
    @Query("SELECT COUNT(pc) FROM ProductCertification pc WHERE pc.expiryDate < :currentDate AND pc.isActive = true")
    Long countExpiredCertifications(@Param("currentDate") LocalDate currentDate);

    /**
     * Count certifications expiring soon
     */
    @Query("SELECT COUNT(pc) FROM ProductCertification pc WHERE pc.expiryDate BETWEEN :currentDate AND :futureDate AND pc.isActive = true")
    Long countCertificationsExpiringSoon(@Param("currentDate") LocalDate currentDate, @Param("futureDate") LocalDate futureDate);

    /**
     * Find certifications by product and type
     */
    List<ProductCertification> findByProductIdAndCertificationTypeAndIsActiveTrue(Integer productId, String certificationType);

    /**
     * Find certifications by product and status
     */
    List<ProductCertification> findByProductIdAndStatusAndIsActiveTrue(Integer productId, String status);

    /**
     * Find certifications by date range
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.issueDate BETWEEN :startDate AND :endDate AND pc.isActive = true")
    List<ProductCertification> findByIssueDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Search certifications by name or type
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE " +
           "(LOWER(pc.certificationName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pc.certificationType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pc.issuingAuthority) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "pc.isActive = true")
    List<ProductCertification> searchCertifications(@Param("searchTerm") String searchTerm);

    /**
     * Find certifications by compliance percentage range
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.compliancePercentage BETWEEN :minPercentage AND :maxPercentage AND pc.isActive = true")
    List<ProductCertification> findByCompliancePercentageBetween(@Param("minPercentage") Double minPercentage, @Param("maxPercentage") Double maxPercentage);

    /**
     * Find all certification types
     */
    @Query("SELECT DISTINCT pc.certificationType FROM ProductCertification pc WHERE pc.isActive = true ORDER BY pc.certificationType")
    List<String> findAllCertificationTypes();

    /**
     * Find all issuing authorities
     */
    @Query("SELECT DISTINCT pc.issuingAuthority FROM ProductCertification pc WHERE pc.issuingAuthority IS NOT NULL AND pc.isActive = true ORDER BY pc.issuingAuthority")
    List<String> findAllIssuingAuthorities();

    /**
     * Find certifications with high compliance percentage
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.compliancePercentage >= :threshold AND pc.isActive = true")
    List<ProductCertification> findHighComplianceCertifications(@Param("threshold") Double threshold);

    /**
     * Find recent certifications (issued within last N days)
     */
    @Query("SELECT pc FROM ProductCertification pc WHERE pc.issueDate >= :sinceDate AND pc.isActive = true ORDER BY pc.issueDate DESC")
    List<ProductCertification> findRecentCertifications(@Param("sinceDate") LocalDate sinceDate);

    /**
     * Delete certifications by product ID (soft delete)
     */
    @Query("UPDATE ProductCertification pc SET pc.isActive = false WHERE pc.productId = :productId")
    void softDeleteByProductId(@Param("productId") Integer productId);
}
