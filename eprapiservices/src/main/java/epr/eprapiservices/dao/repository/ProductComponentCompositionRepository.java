package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.ProductComponentComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ProductComponentComposition entity
 * Provides database operations for product-component composition relationships
 */
@Repository
public interface ProductComponentCompositionRepository extends JpaRepository<ProductComponentComposition, Long> {

    /**
     * Find all component compositions for a specific product
     */
    @Query("SELECT pcc FROM ProductComponentComposition pcc WHERE pcc.product.productId = :productId AND pcc.isActive = true")
    List<ProductComponentComposition> findByProductId(@Param("productId") Long productId);

    /**
     * Find all products using a specific component
     */
    @Query("SELECT pcc FROM ProductComponentComposition pcc WHERE pcc.component.componentId = :componentId AND pcc.isActive = true")
    List<ProductComponentComposition> findByComponentId(@Param("componentId") Long componentId);

    /**
     * Count component compositions for a product
     */
    @Query("SELECT COUNT(pcc) FROM ProductComponentComposition pcc WHERE pcc.product.productId = :productId AND pcc.isActive = true")
    long countByProductId(@Param("productId") Long productId);
}

