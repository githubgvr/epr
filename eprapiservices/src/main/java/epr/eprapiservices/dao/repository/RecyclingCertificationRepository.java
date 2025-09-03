package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.RecyclingCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for RecyclingCertification entity operations
 */
@Repository
public interface RecyclingCertificationRepository extends JpaRepository<RecyclingCertification, Integer> {

    /**
     * Find all active recycling certifications
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findAllActive();

    /**
     * Find certification by certification number
     */
    Optional<RecyclingCertification> findByCertificationNumber(String certificationNumber);

    /**
     * Find certifications by certification name
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE LOWER(rc.certificationName) LIKE LOWER(CONCAT('%', :name, '%')) AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByCertificationNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find certifications by certification type
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.certificationType = :type AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByCertificationType(@Param("type") RecyclingCertification.CertificationType type);

    /**
     * Find certifications by issuing authority
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE LOWER(rc.issuingAuthority) LIKE LOWER(CONCAT('%', :authority, '%')) AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByIssuingAuthorityContainingIgnoreCase(@Param("authority") String authority);

    /**
     * Find certifications by material type
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE LOWER(rc.materialType) LIKE LOWER(CONCAT('%', :materialType, '%')) AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByMaterialTypeContainingIgnoreCase(@Param("materialType") String materialType);

    /**
     * Find certifications by recycler name
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE LOWER(rc.recyclerName) LIKE LOWER(CONCAT('%', :recyclerName, '%')) AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByRecyclerNameContainingIgnoreCase(@Param("recyclerName") String recyclerName);

    /**
     * Find certifications by recycler ID
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.recyclerId = :recyclerId AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByRecyclerId(@Param("recyclerId") String recyclerId);

    /**
     * Find certifications by status
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.certificationStatus = :status AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findByCertificationStatus(@Param("status") RecyclingCertification.CertificationStatus status);

    /**
     * Find certifications expiring within specified days
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.expiryDate <= :expiryDate AND rc.certificationStatus = 'VALID' AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findCertificationsExpiringBefore(@Param("expiryDate") LocalDate expiryDate);

    /**
     * Find expired certifications
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.expiryDate < CURRENT_DATE AND rc.certificationStatus = 'VALID' AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findExpiredCertifications();

    /**
     * Find valid certifications
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.expiryDate >= CURRENT_DATE AND rc.certificationStatus = 'VALID' AND rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> findValidCertifications();

    /**
     * Find certifications by date range
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE rc.issueDate BETWEEN :startDate AND :endDate AND rc.isActive = true ORDER BY rc.issueDate DESC")
    List<RecyclingCertification> findByIssueDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Check if certification number exists (excluding specific ID)
     */
    @Query("SELECT COUNT(rc) > 0 FROM RecyclingCertification rc WHERE LOWER(rc.certificationNumber) = LOWER(:number) AND rc.certificationId != :id")
    boolean existsByCertificationNumberIgnoreCaseAndCertificationIdNot(@Param("number") String number, @Param("id") Integer id);

    /**
     * Check if certification number exists
     */
    boolean existsByCertificationNumberIgnoreCase(String certificationNumber);

    /**
     * Get certification statistics by type
     */
    @Query("SELECT rc.certificationType, COUNT(rc) FROM RecyclingCertification rc WHERE rc.isActive = true GROUP BY rc.certificationType")
    List<Object[]> getCertificationStatsByType();

    /**
     * Get certification statistics by status
     */
    @Query("SELECT rc.certificationStatus, COUNT(rc) FROM RecyclingCertification rc WHERE rc.isActive = true GROUP BY rc.certificationStatus")
    List<Object[]> getCertificationStatsByStatus();

    /**
     * Search certifications by multiple criteria
     */
    @Query("SELECT rc FROM RecyclingCertification rc WHERE " +
           "(:certificationName IS NULL OR LOWER(rc.certificationName) LIKE LOWER(CONCAT('%', :certificationName, '%'))) AND " +
           "(:certificationType IS NULL OR rc.certificationType = :certificationType) AND " +
           "(:issuingAuthority IS NULL OR LOWER(rc.issuingAuthority) LIKE LOWER(CONCAT('%', :issuingAuthority, '%'))) AND " +
           "(:materialType IS NULL OR LOWER(rc.materialType) LIKE LOWER(CONCAT('%', :materialType, '%'))) AND " +
           "(:recyclerName IS NULL OR LOWER(rc.recyclerName) LIKE LOWER(CONCAT('%', :recyclerName, '%'))) AND " +
           "(:certificationStatus IS NULL OR rc.certificationStatus = :certificationStatus) AND " +
           "rc.isActive = true ORDER BY rc.expiryDate ASC")
    List<RecyclingCertification> searchCertifications(
            @Param("certificationName") String certificationName,
            @Param("certificationType") RecyclingCertification.CertificationType certificationType,
            @Param("issuingAuthority") String issuingAuthority,
            @Param("materialType") String materialType,
            @Param("recyclerName") String recyclerName,
            @Param("certificationStatus") RecyclingCertification.CertificationStatus certificationStatus
    );
}
