package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.MaterialComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MaterialComposition entity
 */
@Repository
public interface MaterialCompositionRepository extends JpaRepository<MaterialComposition, Integer> {

    /**
     * Find all active material compositions ordered by sort order and name
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.isActive = true ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> findAllActiveOrderBySortOrderAndName();

    /**
     * Find material composition by ID and active status
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.materialCompositionId = :id AND mc.isActive = true")
    Optional<MaterialComposition> findByIdAndActive(@Param("id") Integer id);

    /**
     * Find all compositions using a specific material
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.materialId = :materialId AND mc.isActive = true ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> findByMaterialIdAndActive(@Param("materialId") Integer materialId);

    /**
     * Find material composition by composition code
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.compositionCode = :compositionCode AND mc.isActive = true")
    Optional<MaterialComposition> findByCompositionCodeAndActive(@Param("compositionCode") String compositionCode);

    /**
     * Check if composition code exists (excluding specific ID for updates)
     */
    @Query("SELECT COUNT(mc) > 0 FROM MaterialComposition mc WHERE mc.compositionCode = :compositionCode AND mc.isActive = true AND (:excludeId IS NULL OR mc.materialCompositionId != :excludeId)")
    boolean existsByCompositionCodeAndActiveExcludingId(@Param("compositionCode") String compositionCode, @Param("excludeId") Integer excludeId);

    /**
     * Search material compositions by name, code, or description
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.isActive = true AND " +
           "(LOWER(mc.compositionName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mc.compositionCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mc.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> searchByNameCodeOrDescription(@Param("searchTerm") String searchTerm);

    /**
     * Find compositions by active status
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.isActive = :isActive ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> findByActiveStatus(@Param("isActive") Boolean isActive);

    /**
     * Count total active material compositions
     */
    @Query("SELECT COUNT(mc) FROM MaterialComposition mc WHERE mc.isActive = true")
    long countActiveCompositions();

    /**
     * Count compositions by material
     */
    @Query("SELECT COUNT(mc) FROM MaterialComposition mc WHERE mc.materialId = :materialId AND mc.isActive = true")
    long countByMaterialIdAndActive(@Param("materialId") Integer materialId);

    /**
     * Find compositions with weight range
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.isActive = true AND mc.weightKg BETWEEN :minWeight AND :maxWeight ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> findByWeightRange(@Param("minWeight") java.math.BigDecimal minWeight, @Param("maxWeight") java.math.BigDecimal maxWeight);

    /**
     * Find compositions with percentage overlap
     */
    @Query("SELECT mc FROM MaterialComposition mc WHERE mc.isActive = true AND " +
           "((mc.minPercentage <= :maxPercentage AND mc.maxPercentage >= :minPercentage)) " +
           "ORDER BY mc.sortOrder ASC, mc.compositionName ASC")
    List<MaterialComposition> findByPercentageOverlap(@Param("minPercentage") java.math.BigDecimal minPercentage, @Param("maxPercentage") java.math.BigDecimal maxPercentage);
}
