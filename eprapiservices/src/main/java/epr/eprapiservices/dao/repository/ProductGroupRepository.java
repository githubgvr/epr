package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProductGroup entity operations
 */
@Repository
public interface ProductGroupRepository extends JpaRepository<ProductGroup, Integer> {

    /**
     * Find product group by name
     */
    Optional<ProductGroup> findByProductGroupName(String productGroupName);

    /**
     * Find all active product groups
     */
    @Query("SELECT pg FROM ProductGroup pg WHERE pg.isActive = true")
    List<ProductGroup> findAllActive();

    /**
     * Find product groups by name containing (case insensitive)
     */
    @Query("SELECT pg FROM ProductGroup pg WHERE LOWER(pg.productGroupName) LIKE LOWER(CONCAT('%', :name, '%')) AND pg.isActive = true")
    List<ProductGroup> findByProductGroupNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Check if product group name exists (excluding specific ID)
     */
    @Query("SELECT COUNT(pg) > 0 FROM ProductGroup pg WHERE LOWER(pg.productGroupName) = LOWER(:name) AND pg.productGroupId != :id")
    boolean existsByProductGroupNameIgnoreCaseAndProductGroupIdNot(@Param("name") String name, @Param("id") Integer id);

    /**
     * Check if product group name exists
     */
    boolean existsByProductGroupNameIgnoreCase(String productGroupName);
}
