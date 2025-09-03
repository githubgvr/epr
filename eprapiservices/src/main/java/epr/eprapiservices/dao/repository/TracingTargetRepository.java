package epr.eprapiservices.dao.repository;

import epr.eprapiservices.entity.TracingTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for TracingTarget entity operations
 */
@Repository
public interface TracingTargetRepository extends JpaRepository<TracingTarget, Integer> {

    /**
     * Find all active tracing targets
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findAllActive();

    /**
     * Find targets by target name
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE LOWER(tt.targetName) LIKE LOWER(CONCAT('%', :name, '%')) AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByTargetNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find targets by material type
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE LOWER(tt.materialType) LIKE LOWER(CONCAT('%', :materialType, '%')) AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByMaterialTypeContainingIgnoreCase(@Param("materialType") String materialType);

    /**
     * Find targets by target type
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetType = :targetType AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByTargetType(@Param("targetType") TracingTarget.TargetType targetType);

    /**
     * Find targets by priority level
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.priorityLevel = :priorityLevel AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByPriorityLevel(@Param("priorityLevel") TracingTarget.PriorityLevel priorityLevel);

    /**
     * Find targets by target status
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetStatus = :targetStatus AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByTargetStatus(@Param("targetStatus") TracingTarget.TargetStatus targetStatus);

    /**
     * Find targets by responsible party
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE LOWER(tt.responsibleParty) LIKE LOWER(CONCAT('%', :responsibleParty, '%')) AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByResponsiblePartyContainingIgnoreCase(@Param("responsibleParty") String responsibleParty);

    /**
     * Find targets by location
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE LOWER(tt.location) LIKE LOWER(CONCAT('%', :location, '%')) AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByLocationContainingIgnoreCase(@Param("location") String location);

    /**
     * Find targets by target date range
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetDate BETWEEN :startDate AND :endDate AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findByTargetDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Find overdue targets
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetDate < CURRENT_DATE AND tt.targetStatus NOT IN ('COMPLETED', 'CANCELLED', 'EXCEEDED') AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findOverdueTargets();

    /**
     * Find targets due within specified days
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetDate <= :dueDate AND tt.targetStatus NOT IN ('COMPLETED', 'CANCELLED', 'EXCEEDED') AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findTargetsDueBefore(@Param("dueDate") LocalDate dueDate);

    /**
     * Find active targets (not completed, cancelled, or exceeded)
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetStatus NOT IN ('COMPLETED', 'CANCELLED', 'EXCEEDED') AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findActiveTargets();

    /**
     * Find completed targets
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetStatus IN ('COMPLETED', 'EXCEEDED') AND tt.isActive = true ORDER BY tt.targetDate DESC")
    List<TracingTarget> findCompletedTargets();

    /**
     * Find high priority targets
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.priorityLevel IN ('HIGH', 'CRITICAL') AND tt.targetStatus NOT IN ('COMPLETED', 'CANCELLED', 'EXCEEDED') AND tt.isActive = true ORDER BY tt.priorityLevel DESC, tt.targetDate ASC")
    List<TracingTarget> findHighPriorityTargets();

    /**
     * Find targets at risk
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE tt.targetStatus IN ('AT_RISK', 'DELAYED') AND tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> findTargetsAtRisk();

    /**
     * Get target statistics by type
     */
    @Query("SELECT tt.targetType, COUNT(tt), COALESCE(AVG(tt.progressPercentage), 0) FROM TracingTarget tt WHERE tt.isActive = true GROUP BY tt.targetType")
    List<Object[]> getTargetStatsByType();

    /**
     * Get target statistics by status
     */
    @Query("SELECT tt.targetStatus, COUNT(tt) FROM TracingTarget tt WHERE tt.isActive = true GROUP BY tt.targetStatus")
    List<Object[]> getTargetStatsByStatus();

    /**
     * Get target statistics by priority level
     */
    @Query("SELECT tt.priorityLevel, COUNT(tt) FROM TracingTarget tt WHERE tt.isActive = true GROUP BY tt.priorityLevel")
    List<Object[]> getTargetStatsByPriority();

    /**
     * Get overall progress by material type
     */
    @Query("SELECT tt.materialType, COALESCE(SUM(tt.targetQuantity), 0), COALESCE(SUM(tt.achievedQuantity), 0), COALESCE(AVG(tt.progressPercentage), 0) FROM TracingTarget tt WHERE tt.isActive = true GROUP BY tt.materialType")
    List<Object[]> getProgressByMaterialType();

    /**
     * Search targets by multiple criteria
     */
    @Query("SELECT tt FROM TracingTarget tt WHERE " +
           "(:targetName IS NULL OR LOWER(tt.targetName) LIKE LOWER(CONCAT('%', :targetName, '%'))) AND " +
           "(:materialType IS NULL OR LOWER(tt.materialType) LIKE LOWER(CONCAT('%', :materialType, '%'))) AND " +
           "(:targetType IS NULL OR tt.targetType = :targetType) AND " +
           "(:priorityLevel IS NULL OR tt.priorityLevel = :priorityLevel) AND " +
           "(:targetStatus IS NULL OR tt.targetStatus = :targetStatus) AND " +
           "(:responsibleParty IS NULL OR LOWER(tt.responsibleParty) LIKE LOWER(CONCAT('%', :responsibleParty, '%'))) AND " +
           "(:location IS NULL OR LOWER(tt.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "tt.isActive = true ORDER BY tt.targetDate ASC")
    List<TracingTarget> searchTargets(
            @Param("targetName") String targetName,
            @Param("materialType") String materialType,
            @Param("targetType") TracingTarget.TargetType targetType,
            @Param("priorityLevel") TracingTarget.PriorityLevel priorityLevel,
            @Param("targetStatus") TracingTarget.TargetStatus targetStatus,
            @Param("responsibleParty") String responsibleParty,
            @Param("location") String location
    );
}
