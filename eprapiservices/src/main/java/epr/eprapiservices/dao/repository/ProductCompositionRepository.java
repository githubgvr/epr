package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductComposition entity
 */
@Repository
public interface ProductCompositionRepository extends JpaRepository<ProductComposition, Integer> {

    /**
     * Find all compositions for a specific product
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.productId = :productId AND pc.isActive = true")
    List<ProductComposition> findByProductId(@Param("productId") Integer productId);

    /**
     * Find all compositions using a specific material
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.materialId = :materialId AND pc.isActive = true")
    List<ProductComposition> findByMaterialId(@Param("materialId") Integer materialId);

    /**
     * Find all compositions for a specific product group
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.productGroupId = :productGroupId AND pc.isActive = true")
    List<ProductComposition> findByProductGroupId(@Param("productGroupId") Integer productGroupId);

    /**
     * Find composition by product and material
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.productId = :productId AND pc.materialId = :materialId AND pc.isActive = true")
    Optional<ProductComposition> findByProductIdAndMaterialId(@Param("productId") Integer productId, 
                                                             @Param("materialId") Integer materialId);

    /**
     * Find all active compositions (relationships removed)
     */
    @Query("SELECT pc FROM ProductComposition pc " +
           "WHERE pc.isActive = true " +
           "ORDER BY pc.productId, pc.materialId")
    List<ProductComposition> findAllActiveWithDetails();

    /**
     * Find compositions by product (relationships removed)
     */
    @Query("SELECT pc FROM ProductComposition pc " +
           "WHERE pc.productId = :productId AND pc.isActive = true " +
           "ORDER BY pc.materialId")
    List<ProductComposition> findByProductIdWithDetails(@Param("productId") Integer productId);

    /**
     * Calculate total composition percentage for a product
     */
    @Query("SELECT COALESCE(SUM(pc.compositionPercentage), 0) FROM ProductComposition pc " +
           "WHERE pc.productId = :productId AND pc.isActive = true")
    Double getTotalCompositionPercentageByProductId(@Param("productId") Integer productId);

    /**
     * Find compositions with composition percentage greater than specified value
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.compositionPercentage > :percentage AND pc.isActive = true")
    List<ProductComposition> findByCompositionPercentageGreaterThan(@Param("percentage") Double percentage);

    /**
     * Check if a product-material combination already exists
     */
    @Query("SELECT COUNT(pc) > 0 FROM ProductComposition pc " +
           "WHERE pc.productId = :productId AND pc.materialId = :materialId AND pc.isActive = true")
    boolean existsByProductIdAndMaterialId(@Param("productId") Integer productId, 
                                         @Param("materialId") Integer materialId);

    /**
     * Find all active compositions
     */
    @Query("SELECT pc FROM ProductComposition pc WHERE pc.isActive = true ORDER BY pc.productId, pc.materialId")
    List<ProductComposition> findAllActive();

    /**
     * Delete composition by product and material (soft delete)
     */
    @Query("UPDATE ProductComposition pc SET pc.isActive = false WHERE pc.productId = :productId AND pc.materialId = :materialId")
    void softDeleteByProductIdAndMaterialId(@Param("productId") Integer productId, 
                                          @Param("materialId") Integer materialId);
}
