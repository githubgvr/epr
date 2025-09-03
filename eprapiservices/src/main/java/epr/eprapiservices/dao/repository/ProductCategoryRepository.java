package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductCategory entity operations
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {

    /**
     * Find product category by name
     */
    Optional<ProductCategory> findByProductCategoryName(String productCategoryName);

    /**
     * Find all active product categories
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE pc.isActive = true ORDER BY pc.sortOrder ASC, pc.productCategoryName ASC")
    List<ProductCategory> findAllActive();

    /**
     * Find product categories by name containing (case insensitive)
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE LOWER(pc.productCategoryName) LIKE LOWER(CONCAT('%', :name, '%')) AND pc.isActive = true ORDER BY pc.sortOrder ASC, pc.productCategoryName ASC")
    List<ProductCategory> findByProductCategoryNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Check if product category name exists (excluding specific ID)
     */
    @Query("SELECT COUNT(pc) > 0 FROM ProductCategory pc WHERE LOWER(pc.productCategoryName) = LOWER(:name) AND pc.productCategoryId != :id")
    boolean existsByProductCategoryNameIgnoreCaseAndProductCategoryIdNot(@Param("name") String name, @Param("id") Integer id);

    /**
     * Check if product category name exists
     */
    boolean existsByProductCategoryNameIgnoreCase(String productCategoryName);

    /**
     * Find product category by category code
     */
    Optional<ProductCategory> findByCategoryCode(String categoryCode);

    /**
     * Check if category code exists (excluding specific ID)
     */
    @Query("SELECT COUNT(pc) > 0 FROM ProductCategory pc WHERE pc.categoryCode = :code AND pc.productCategoryId != :id")
    boolean existsByCategoryCodeAndProductCategoryIdNot(@Param("code") String categoryCode, @Param("id") Integer id);

    /**
     * Check if category code exists
     */
    boolean existsByCategoryCode(String categoryCode);

    /**
     * Count active product categories
     */
    @Query("SELECT COUNT(pc) FROM ProductCategory pc WHERE pc.isActive = true")
    long countActiveCategories();

    /**
     * Find categories by description containing (case insensitive)
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE LOWER(pc.description) LIKE LOWER(CONCAT('%', :description, '%')) AND pc.isActive = true ORDER BY pc.sortOrder ASC, pc.productCategoryName ASC")
    List<ProductCategory> findByDescriptionContainingIgnoreCase(@Param("description") String description);

    /**
     * Search categories by name or description
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE " +
           "(LOWER(pc.productCategoryName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pc.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "pc.isActive = true ORDER BY pc.sortOrder ASC, pc.productCategoryName ASC")
    List<ProductCategory> searchByNameOrDescription(@Param("searchTerm") String searchTerm);

    /**
     * Find categories ordered by sort order
     */
    @Query("SELECT pc FROM ProductCategory pc WHERE pc.isActive = true ORDER BY pc.sortOrder ASC NULLS LAST, pc.productCategoryName ASC")
    List<ProductCategory> findAllActiveBySortOrder();

    /**
     * Get next sort order value
     */
    @Query("SELECT COALESCE(MAX(pc.sortOrder), 0) + 1 FROM ProductCategory pc WHERE pc.isActive = true")
    Integer getNextSortOrder();
}
