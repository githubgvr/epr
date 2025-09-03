package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Vendor entity operations
 */
@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {

    /**
     * Find vendor by vendor code
     */
    Optional<Vendor> findByVendorCode(String vendorCode);

    /**
     * Find vendor by vendor name
     */
    Optional<Vendor> findByVendorName(String vendorName);

    /**
     * Find all active vendors
     */
    @Query("SELECT v FROM Vendor v WHERE v.isActive = true")
    List<Vendor> findAllActive();

    /**
     * Find vendors by name containing (case insensitive)
     */
    @Query("SELECT v FROM Vendor v WHERE LOWER(v.vendorName) LIKE LOWER(CONCAT('%', :name, '%')) AND v.isActive = true")
    List<Vendor> findByVendorNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find vendors by certification status
     */
    @Query("SELECT v FROM Vendor v WHERE v.vendorCertificationStatus = :status AND v.isActive = true")
    List<Vendor> findByVendorCertificationStatus(@Param("status") Vendor.CertificationStatus status);

    /**
     * Check if vendor code exists (excluding specific ID)
     */
    @Query("SELECT COUNT(v) > 0 FROM Vendor v WHERE LOWER(v.vendorCode) = LOWER(:code) AND v.vendorId != :id")
    boolean existsByVendorCodeIgnoreCaseAndVendorIdNot(@Param("code") String code, @Param("id") Integer id);

    /**
     * Check if vendor code exists
     */
    boolean existsByVendorCodeIgnoreCase(String vendorCode);

    /**
     * Check if vendor name exists (excluding specific ID)
     */
    @Query("SELECT COUNT(v) > 0 FROM Vendor v WHERE LOWER(v.vendorName) = LOWER(:name) AND v.vendorId != :id")
    boolean existsByVendorNameIgnoreCaseAndVendorIdNot(@Param("name") String name, @Param("id") Integer id);

    /**
     * Check if vendor name exists
     */
    boolean existsByVendorNameIgnoreCase(String vendorName);
}
