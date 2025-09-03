package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductType entity operations
 */
@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Integer> {

    /**
     * Find all active product types ordered by name
     */
    @Query("SELECT pt FROM ProductType pt WHERE pt.isActive = true ORDER BY pt.productTypeName")
    List<ProductType> findAllActiveOrderByName();

    /**
     * Find ProductType by name (case-insensitive)
     */
    @Query("SELECT pt FROM ProductType pt WHERE LOWER(pt.productTypeName) = LOWER(:name)")
    Optional<ProductType> findByProductTypeNameIgnoreCase(@Param("name") String productTypeName);

    /**
     * Find ProductTypes by name containing (case-insensitive) - for search functionality
     */
    @Query("SELECT pt FROM ProductType pt WHERE LOWER(pt.productTypeName) LIKE LOWER(CONCAT('%', :name, '%')) AND pt.isActive = true ORDER BY pt.productTypeName")
    List<ProductType> findByProductTypeNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find ProductTypes by description containing (case-insensitive)
     */
    @Query("SELECT pt FROM ProductType pt WHERE LOWER(pt.productTypeDescription) LIKE LOWER(CONCAT('%', :description, '%')) AND pt.isActive = true ORDER BY pt.productTypeName")
    List<ProductType> findByDescriptionContainingIgnoreCase(@Param("description") String description);

    /**
     * Search ProductTypes by name or description
     */
    @Query("SELECT pt FROM ProductType pt WHERE " +
           "(LOWER(pt.productTypeName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(pt.productTypeDescription) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "pt.isActive = true ORDER BY pt.productTypeName")
    List<ProductType> searchByNameOrDescription(@Param("query") String query);

    /**
     * Check if ProductType name exists (case-insensitive) excluding specific ID
     */
    @Query("SELECT COUNT(pt) > 0 FROM ProductType pt WHERE LOWER(pt.productTypeName) = LOWER(:name) AND pt.productTypeId != :id")
    boolean existsByProductTypeNameIgnoreCaseAndIdNot(@Param("name") String productTypeName, @Param("id") Integer id);

    /**
     * Check if ProductType name exists (case-insensitive)
     */
    @Query("SELECT COUNT(pt) > 0 FROM ProductType pt WHERE LOWER(pt.productTypeName) = LOWER(:name)")
    boolean existsByProductTypeNameIgnoreCase(@Param("name") String productTypeName);

    /**
     * Count active ProductTypes
     */
    @Query("SELECT COUNT(pt) FROM ProductType pt WHERE pt.isActive = true")
    long countActiveProductTypes();
}
