package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {

    /**
     * Find all active materials ordered by sort order then material name
     */
    @Query("SELECT m FROM Material m WHERE m.isActive = true ORDER BY m.sortOrder, m.materialName")
    List<Material> findAllActiveMaterials();

    /**
     * Find material by material code
     */
    @Query("SELECT m FROM Material m WHERE m.materialCode = :materialCode")
    Optional<Material> findByMaterialCode(@Param("materialCode") String materialCode);

    /**
     * Find materials by material name containing (case-insensitive search)
     */
    @Query("SELECT m FROM Material m WHERE LOWER(m.materialName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND m.isActive = true ORDER BY m.sortOrder, m.materialName")
    List<Material> findByMaterialNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);

    /**
     * Check if material code exists (excluding specific material ID for updates)
     */
    @Query("SELECT COUNT(m) > 0 FROM Material m WHERE m.materialCode = :materialCode AND (:materialId IS NULL OR m.materialId != :materialId)")
    boolean existsByMaterialCodeAndNotMaterialId(@Param("materialCode") String materialCode, @Param("materialId") Integer materialId);

    /**
     * Find all active materials ordered by sort order
     */
    @Query("SELECT m FROM Material m WHERE m.isActive = true ORDER BY m.sortOrder, m.materialName")
    List<Material> findAllActiveMaterialsWithType();

    /**
     * Find material by ID
     */
    @Query("SELECT m FROM Material m WHERE m.materialId = :materialId")
    Optional<Material> findByIdWithType(@Param("materialId") Integer materialId);

    /**
     * Find materials by active status ordered by sort order
     */
    @Query("SELECT m FROM Material m WHERE m.isActive = :isActive ORDER BY m.sortOrder, m.materialName")
    List<Material> findByIsActive(@Param("isActive") Boolean isActive);
}
