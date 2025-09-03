package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.MaterialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MaterialType entity operations
 */
@Repository
public interface MaterialTypeRepository extends JpaRepository<MaterialType, Integer> {

    /**
     * Find MaterialType by name (case-insensitive)
     */
    @Query("SELECT mt FROM MaterialType mt WHERE LOWER(mt.materialTypeName) = LOWER(:name)")
    Optional<MaterialType> findByMaterialTypeNameIgnoreCase(@Param("name") String materialTypeName);

    /**
     * Find all active MaterialTypes
     */
    List<MaterialType> findByIsActiveTrue();

    /**
     * Find MaterialTypes by name containing (case-insensitive)
     */
    @Query("SELECT mt FROM MaterialType mt WHERE LOWER(mt.materialTypeName) LIKE LOWER(CONCAT('%', :name, '%')) AND mt.isActive = true")
    List<MaterialType> findByMaterialTypeNameContainingIgnoreCase(@Param("name") String materialTypeName);

    /**
     * Check if MaterialType exists by name (case-insensitive)
     */
    @Query("SELECT COUNT(mt) > 0 FROM MaterialType mt WHERE LOWER(mt.materialTypeName) = LOWER(:name)")
    boolean existsByMaterialTypeNameIgnoreCase(@Param("name") String materialTypeName);

    /**
     * Find MaterialTypes ordered by name
     */
    List<MaterialType> findByIsActiveTrueOrderByMaterialTypeNameAsc();
}
