package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.RecycleLogRepository;
import epr.eprapiservices.entity.RecycleLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for RecycleLog entity operations
 */
@Service
@Transactional
public class RecycleLogService {

    @Autowired
    private RecycleLogRepository recycleLogRepository;

    /**
     * Get all active recycle logs
     */
    public List<RecycleLog> getAllActiveRecycleLogs() {
        return recycleLogRepository.findAllActive();
    }

    /**
     * Get recycle log by ID
     */
    public Optional<RecycleLog> getRecycleLogById(Integer recycleLogId) {
        return recycleLogRepository.findById(recycleLogId);
    }

    /**
     * Create a new recycle log
     */
    public RecycleLog createRecycleLog(RecycleLog recycleLog) {
        recycleLog.setRecycleLogId(null); // Ensure it's a new entity
        return recycleLogRepository.save(recycleLog);
    }

    /**
     * Update an existing recycle log
     */
    public RecycleLog updateRecycleLog(Integer recycleLogId, RecycleLog recycleLogDetails) {
        Optional<RecycleLog> optionalRecycleLog = recycleLogRepository.findById(recycleLogId);
        if (optionalRecycleLog.isPresent()) {
            RecycleLog existingRecycleLog = optionalRecycleLog.get();
            
            // Update fields
            existingRecycleLog.setMaterialType(recycleLogDetails.getMaterialType());
            existingRecycleLog.setQuantityRecycled(recycleLogDetails.getQuantityRecycled());
            existingRecycleLog.setUnit(recycleLogDetails.getUnit());
            existingRecycleLog.setRecycleDate(recycleLogDetails.getRecycleDate());
            existingRecycleLog.setRecyclerName(recycleLogDetails.getRecyclerName());
            existingRecycleLog.setRecyclerId(recycleLogDetails.getRecyclerId());
            existingRecycleLog.setLocation(recycleLogDetails.getLocation());
            existingRecycleLog.setProcessingMethod(recycleLogDetails.getProcessingMethod());
            existingRecycleLog.setQualityGrade(recycleLogDetails.getQualityGrade());
            existingRecycleLog.setNotes(recycleLogDetails.getNotes());
            existingRecycleLog.setBatchNumber(recycleLogDetails.getBatchNumber());
            existingRecycleLog.setRecoveryRate(recycleLogDetails.getRecoveryRate());
            
            return recycleLogRepository.save(existingRecycleLog);
        } else {
            throw new RuntimeException("RecycleLog not found with id: " + recycleLogId);
        }
    }

    /**
     * Delete a recycle log (soft delete)
     */
    public void deleteRecycleLog(Integer recycleLogId) {
        Optional<RecycleLog> optionalRecycleLog = recycleLogRepository.findById(recycleLogId);
        if (optionalRecycleLog.isPresent()) {
            RecycleLog recycleLog = optionalRecycleLog.get();
            recycleLog.setIsActive(false);
            recycleLogRepository.save(recycleLog);
        } else {
            throw new RuntimeException("RecycleLog not found with id: " + recycleLogId);
        }
    }

    /**
     * Search recycle logs by material type
     */
    public List<RecycleLog> searchByMaterialType(String materialType) {
        return recycleLogRepository.findByMaterialTypeContainingIgnoreCase(materialType);
    }

    /**
     * Search recycle logs by recycler name
     */
    public List<RecycleLog> searchByRecyclerName(String recyclerName) {
        return recycleLogRepository.findByRecyclerNameContainingIgnoreCase(recyclerName);
    }

    /**
     * Get recycle logs by recycler ID
     */
    public List<RecycleLog> getRecycleLogsByRecyclerId(String recyclerId) {
        return recycleLogRepository.findByRecyclerId(recyclerId);
    }

    /**
     * Get recycle logs by processing method
     */
    public List<RecycleLog> getRecycleLogsByProcessingMethod(RecycleLog.ProcessingMethod processingMethod) {
        return recycleLogRepository.findByProcessingMethod(processingMethod);
    }

    /**
     * Get recycle logs by quality grade
     */
    public List<RecycleLog> getRecycleLogsByQualityGrade(RecycleLog.QualityGrade qualityGrade) {
        return recycleLogRepository.findByQualityGrade(qualityGrade);
    }

    /**
     * Get recycle logs by date range
     */
    public List<RecycleLog> getRecycleLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return recycleLogRepository.findByRecycleDateBetween(startDate, endDate);
    }

    /**
     * Search recycle logs by location
     */
    public List<RecycleLog> searchByLocation(String location) {
        return recycleLogRepository.findByLocationContainingIgnoreCase(location);
    }

    /**
     * Get recycle logs by batch number
     */
    public List<RecycleLog> getRecycleLogsByBatchNumber(String batchNumber) {
        return recycleLogRepository.findByBatchNumber(batchNumber);
    }

    /**
     * Get total quantity recycled by material type
     */
    public Double getTotalQuantityByMaterialType(String materialType) {
        return recycleLogRepository.getTotalQuantityByMaterialType(materialType);
    }

    /**
     * Get total quantity recycled by recycler
     */
    public Double getTotalQuantityByRecycler(String recyclerId) {
        return recycleLogRepository.getTotalQuantityByRecycler(recyclerId);
    }

    /**
     * Get recycling statistics by processing method
     */
    public List<Object[]> getRecyclingStatsByProcessingMethod() {
        return recycleLogRepository.getRecyclingStatsByProcessingMethod();
    }

    /**
     * Get recycling statistics by quality grade
     */
    public List<Object[]> getRecyclingStatsByQualityGrade() {
        return recycleLogRepository.getRecyclingStatsByQualityGrade();
    }

    /**
     * Get recent recycle logs (last 30 days)
     */
    public List<RecycleLog> getRecentRecycleLogs() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return recycleLogRepository.findRecentRecycleLogs(thirtyDaysAgo);
    }

    /**
     * Search recycle logs by multiple criteria
     */
    public List<RecycleLog> searchRecycleLogs(String materialType, String recyclerName, String location,
                                            RecycleLog.ProcessingMethod processingMethod, 
                                            RecycleLog.QualityGrade qualityGrade) {
        return recycleLogRepository.searchRecycleLogs(materialType, recyclerName, location, 
                                                    processingMethod, qualityGrade);
    }

    /**
     * Validate recycle log data
     */
    public boolean validateRecycleLog(RecycleLog recycleLog) {
        if (recycleLog == null) {
            return false;
        }
        
        // Check required fields
        if (recycleLog.getMaterialType() == null || recycleLog.getMaterialType().trim().isEmpty()) {
            return false;
        }
        
        if (recycleLog.getQuantityRecycled() == null || recycleLog.getQuantityRecycled().doubleValue() <= 0) {
            return false;
        }
        
        if (recycleLog.getUnit() == null || recycleLog.getUnit().trim().isEmpty()) {
            return false;
        }
        
        if (recycleLog.getRecyclerName() == null || recycleLog.getRecyclerName().trim().isEmpty()) {
            return false;
        }
        
        if (recycleLog.getLocation() == null || recycleLog.getLocation().trim().isEmpty()) {
            return false;
        }
        
        if (recycleLog.getRecycleDate() == null) {
            return false;
        }
        
        // Check if recycle date is not in the future
        if (recycleLog.getRecycleDate().isAfter(LocalDateTime.now())) {
            return false;
        }
        
        return true;
    }
}
