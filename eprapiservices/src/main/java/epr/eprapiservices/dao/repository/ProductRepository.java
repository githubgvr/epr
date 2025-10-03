package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product entity operations
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /**
     * Find all active products ordered by product name
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.productName")
    List<Product> findAllActiveProducts();

    /**
     * Find product by SKU/Product Code
     */
    @Query("SELECT p FROM Product p WHERE p.skuProductCode = :skuProductCode")
    Optional<Product> findBySkuProductCode(@Param("skuProductCode") String skuProductCode);

    /**
     * Search products by name, SKU, or description (case-insensitive)
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.skuProductCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY p.productName")
    List<Product> searchProducts(@Param("searchTerm") String searchTerm);

    /**
     * Find products by registration date range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.registrationDate BETWEEN :startDate AND :endDate ORDER BY p.registrationDate DESC")
    List<Product> findByRegistrationDateBetween(@Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);

    /**
     * Find products expiring within a date range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.productExpiryDate BETWEEN :startDate AND :endDate ORDER BY p.productExpiryDate")
    List<Product> findByExpiryDateBetween(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);

    /**
     * Find products by compliance target percentage range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.complianceTargetPercentage BETWEEN :minPercentage AND :maxPercentage ORDER BY p.complianceTargetPercentage DESC")
    List<Product> findByComplianceTargetPercentageBetween(@Param("minPercentage") java.math.BigDecimal minPercentage, 
                                                         @Param("maxPercentage") java.math.BigDecimal maxPercentage);

    /**
     * Find products by weight range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.productWeight BETWEEN :minWeight AND :maxWeight ORDER BY p.productWeight")
    List<Product> findByProductWeightBetween(@Param("minWeight") java.math.BigDecimal minWeight, 
                                           @Param("maxWeight") java.math.BigDecimal maxWeight);

    /**
     * Find products by lifecycle duration range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.productLifecycleDuration BETWEEN :minDuration AND :maxDuration ORDER BY p.productLifecycleDuration")
    List<Product> findByLifecycleDurationBetween(@Param("minDuration") Integer minDuration, 
                                               @Param("maxDuration") Integer maxDuration);

    /**
     * Check if SKU/Product Code exists (case-insensitive)
     */
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE LOWER(p.skuProductCode) = LOWER(:skuProductCode)")
    boolean existsBySkuProductCodeIgnoreCase(@Param("skuProductCode") String skuProductCode);

    /**
     * Check if SKU/Product Code exists excluding specific ID (case-insensitive)
     */
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE LOWER(p.skuProductCode) = LOWER(:skuProductCode) AND p.productId != :id")
    boolean existsBySkuProductCodeIgnoreCaseAndIdNot(@Param("skuProductCode") String skuProductCode, @Param("id") Integer id);

    /**
     * Count active products
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = true")
    long countActiveProducts();

    /**
     * Find products with regulatory certifications
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.regulatoryCertificationsPath IS NOT NULL AND p.regulatoryCertificationsPath != '' ORDER BY p.productName")
    List<Product> findProductsWithCertifications();

    /**
     * Find products without regulatory certifications
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (p.regulatoryCertificationsPath IS NULL OR p.regulatoryCertificationsPath = '') ORDER BY p.productName")
    List<Product> findProductsWithoutCertifications();

    /**
     * Find products by manufacturing date range
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.productManufacturingDate BETWEEN :startDate AND :endDate ORDER BY p.productManufacturingDate DESC")
    List<Product> findByManufacturingDateBetween(@Param("startDate") LocalDate startDate, 
                                                @Param("endDate") LocalDate endDate);

    /**
     * Find recently registered products (last N days)
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.registrationDate >= :sinceDate ORDER BY p.registrationDate DESC")
    List<Product> findRecentlyRegisteredProducts(@Param("sinceDate") LocalDate sinceDate);

    /**
     * Find products with high compliance targets (above threshold)
     */
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "p.complianceTargetPercentage >= :threshold ORDER BY p.complianceTargetPercentage DESC")
    List<Product> findHighComplianceProducts(@Param("threshold") java.math.BigDecimal threshold);
}
