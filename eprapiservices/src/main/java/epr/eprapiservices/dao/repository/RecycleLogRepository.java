package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.RecycleLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for RecycleLog entity operations
 */
@Repository
public interface RecycleLogRepository extends JpaRepository<RecycleLog, Integer> {

    /**
     * Find all active recycle logs
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findAllActive();

    /**
     * Find recycle logs by material type
     */
    @Query("SELECT r FROM RecycleLog r WHERE LOWER(r.materialType) LIKE LOWER(CONCAT('%', :materialType, '%')) AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByMaterialTypeContainingIgnoreCase(@Param("materialType") String materialType);

    /**
     * Find recycle logs by recycler name
     */
    @Query("SELECT r FROM RecycleLog r WHERE LOWER(r.recyclerName) LIKE LOWER(CONCAT('%', :recyclerName, '%')) AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByRecyclerNameContainingIgnoreCase(@Param("recyclerName") String recyclerName);

    /**
     * Find recycle logs by recycler ID
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.recyclerId = :recyclerId AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByRecyclerId(@Param("recyclerId") String recyclerId);

    /**
     * Find recycle logs by processing method
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.processingMethod = :processingMethod AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByProcessingMethod(@Param("processingMethod") RecycleLog.ProcessingMethod processingMethod);

    /**
     * Find recycle logs by quality grade
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.qualityGrade = :qualityGrade AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByQualityGrade(@Param("qualityGrade") RecycleLog.QualityGrade qualityGrade);

    /**
     * Find recycle logs by date range
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.recycleDate BETWEEN :startDate AND :endDate AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByRecycleDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find recycle logs by location
     */
    @Query("SELECT r FROM RecycleLog r WHERE LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')) AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByLocationContainingIgnoreCase(@Param("location") String location);

    /**
     * Find recycle logs by batch number
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.batchNumber = :batchNumber AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findByBatchNumber(@Param("batchNumber") String batchNumber);

    /**
     * Get total quantity recycled by material type
     */
    @Query("SELECT COALESCE(SUM(r.quantityRecycled), 0) FROM RecycleLog r WHERE LOWER(r.materialType) = LOWER(:materialType) AND r.isActive = true")
    Double getTotalQuantityByMaterialType(@Param("materialType") String materialType);

    /**
     * Get total quantity recycled by recycler
     */
    @Query("SELECT COALESCE(SUM(r.quantityRecycled), 0) FROM RecycleLog r WHERE r.recyclerId = :recyclerId AND r.isActive = true")
    Double getTotalQuantityByRecycler(@Param("recyclerId") String recyclerId);

    /**
     * Get recycling statistics by processing method
     */
    @Query("SELECT r.processingMethod, COUNT(r), COALESCE(SUM(r.quantityRecycled), 0) FROM RecycleLog r WHERE r.isActive = true GROUP BY r.processingMethod")
    List<Object[]> getRecyclingStatsByProcessingMethod();

    /**
     * Get recycling statistics by quality grade
     */
    @Query("SELECT r.qualityGrade, COUNT(r), COALESCE(SUM(r.quantityRecycled), 0) FROM RecycleLog r WHERE r.isActive = true GROUP BY r.qualityGrade")
    List<Object[]> getRecyclingStatsByQualityGrade();

    /**
     * Get recent recycle logs (last 30 days)
     */
    @Query("SELECT r FROM RecycleLog r WHERE r.recycleDate >= :thirtyDaysAgo AND r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> findRecentRecycleLogs(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    /**
     * Search recycle logs by multiple criteria
     */
    @Query("SELECT r FROM RecycleLog r WHERE " +
           "(:materialType IS NULL OR LOWER(r.materialType) LIKE LOWER(CONCAT('%', :materialType, '%'))) AND " +
           "(:recyclerName IS NULL OR LOWER(r.recyclerName) LIKE LOWER(CONCAT('%', :recyclerName, '%'))) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:processingMethod IS NULL OR r.processingMethod = :processingMethod) AND " +
           "(:qualityGrade IS NULL OR r.qualityGrade = :qualityGrade) AND " +
           "r.isActive = true ORDER BY r.recycleDate DESC")
    List<RecycleLog> searchRecycleLogs(
            @Param("materialType") String materialType,
            @Param("recyclerName") String recyclerName,
            @Param("location") String location,
            @Param("processingMethod") RecycleLog.ProcessingMethod processingMethod,
            @Param("qualityGrade") RecycleLog.QualityGrade qualityGrade
    );
}
