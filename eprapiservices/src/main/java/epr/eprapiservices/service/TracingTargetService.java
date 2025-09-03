package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.TracingTargetRepository;
import epr.eprapiservices.entity.TracingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for TracingTarget entity operations
 */
@Service
@Transactional
public class TracingTargetService {

    @Autowired
    private TracingTargetRepository tracingTargetRepository;

    /**
     * Get all active tracing targets
     */
    public List<TracingTarget> getAllActiveTargets() {
        return tracingTargetRepository.findAllActive();
    }

    /**
     * Get target by ID
     */
    public Optional<TracingTarget> getTargetById(Integer targetId) {
        return tracingTargetRepository.findById(targetId);
    }

    /**
     * Create a new tracing target
     */
    public TracingTarget createTarget(TracingTarget target) {
        target.setTargetId(null); // Ensure it's a new entity
        target.updateProgress(); // Calculate initial progress
        return tracingTargetRepository.save(target);
    }

    /**
     * Update an existing tracing target
     */
    public TracingTarget updateTarget(Integer targetId, TracingTarget targetDetails) {
        Optional<TracingTarget> optionalTarget = tracingTargetRepository.findById(targetId);
        if (optionalTarget.isPresent()) {
            TracingTarget existingTarget = optionalTarget.get();
            
            // Update fields
            existingTarget.setTargetName(targetDetails.getTargetName());
            existingTarget.setMaterialType(targetDetails.getMaterialType());
            existingTarget.setTargetQuantity(targetDetails.getTargetQuantity());
            existingTarget.setAchievedQuantity(targetDetails.getAchievedQuantity());
            existingTarget.setUnit(targetDetails.getUnit());
            existingTarget.setTargetDate(targetDetails.getTargetDate());
            existingTarget.setStartDate(targetDetails.getStartDate());
            existingTarget.setTargetType(targetDetails.getTargetType());
            existingTarget.setPriorityLevel(targetDetails.getPriorityLevel());
            existingTarget.setTargetStatus(targetDetails.getTargetStatus());
            existingTarget.setResponsibleParty(targetDetails.getResponsibleParty());
            existingTarget.setDescription(targetDetails.getDescription());
            existingTarget.setLocation(targetDetails.getLocation());
            existingTarget.setNotes(targetDetails.getNotes());
            
            // Update progress calculation
            existingTarget.updateProgress();
            
            return tracingTargetRepository.save(existingTarget);
        } else {
            throw new RuntimeException("TracingTarget not found with id: " + targetId);
        }
    }

    /**
     * Delete a tracing target (soft delete)
     */
    public void deleteTarget(Integer targetId) {
        Optional<TracingTarget> optionalTarget = tracingTargetRepository.findById(targetId);
        if (optionalTarget.isPresent()) {
            TracingTarget target = optionalTarget.get();
            target.setIsActive(false);
            tracingTargetRepository.save(target);
        } else {
            throw new RuntimeException("TracingTarget not found with id: " + targetId);
        }
    }

    /**
     * Update achieved quantity for a target
     */
    public TracingTarget updateAchievedQuantity(Integer targetId, java.math.BigDecimal achievedQuantity) {
        Optional<TracingTarget> optionalTarget = tracingTargetRepository.findById(targetId);
        if (optionalTarget.isPresent()) {
            TracingTarget target = optionalTarget.get();
            target.setAchievedQuantity(achievedQuantity);
            target.updateProgress(); // This will recalculate progress and update status
            return tracingTargetRepository.save(target);
        } else {
            throw new RuntimeException("TracingTarget not found with id: " + targetId);
        }
    }

    /**
     * Search targets by name
     */
    public List<TracingTarget> searchByTargetName(String name) {
        return tracingTargetRepository.findByTargetNameContainingIgnoreCase(name);
    }

    /**
     * Search targets by material type
     */
    public List<TracingTarget> searchByMaterialType(String materialType) {
        return tracingTargetRepository.findByMaterialTypeContainingIgnoreCase(materialType);
    }

    /**
     * Get targets by target type
     */
    public List<TracingTarget> getTargetsByType(TracingTarget.TargetType targetType) {
        return tracingTargetRepository.findByTargetType(targetType);
    }

    /**
     * Get targets by priority level
     */
    public List<TracingTarget> getTargetsByPriority(TracingTarget.PriorityLevel priorityLevel) {
        return tracingTargetRepository.findByPriorityLevel(priorityLevel);
    }

    /**
     * Get targets by status
     */
    public List<TracingTarget> getTargetsByStatus(TracingTarget.TargetStatus targetStatus) {
        return tracingTargetRepository.findByTargetStatus(targetStatus);
    }

    /**
     * Search targets by responsible party
     */
    public List<TracingTarget> searchByResponsibleParty(String responsibleParty) {
        return tracingTargetRepository.findByResponsiblePartyContainingIgnoreCase(responsibleParty);
    }

    /**
     * Search targets by location
     */
    public List<TracingTarget> searchByLocation(String location) {
        return tracingTargetRepository.findByLocationContainingIgnoreCase(location);
    }

    /**
     * Get targets by date range
     */
    public List<TracingTarget> getTargetsByDateRange(LocalDate startDate, LocalDate endDate) {
        return tracingTargetRepository.findByTargetDateBetween(startDate, endDate);
    }

    /**
     * Get overdue targets
     */
    public List<TracingTarget> getOverdueTargets() {
        return tracingTargetRepository.findOverdueTargets();
    }

    /**
     * Get targets due within specified days
     */
    public List<TracingTarget> getTargetsDueWithinDays(int days) {
        LocalDate dueDate = LocalDate.now().plusDays(days);
        return tracingTargetRepository.findTargetsDueBefore(dueDate);
    }

    /**
     * Get active targets (not completed, cancelled, or exceeded)
     */
    public List<TracingTarget> getActiveTargets() {
        return tracingTargetRepository.findActiveTargets();
    }

    /**
     * Get completed targets
     */
    public List<TracingTarget> getCompletedTargets() {
        return tracingTargetRepository.findCompletedTargets();
    }

    /**
     * Get high priority targets
     */
    public List<TracingTarget> getHighPriorityTargets() {
        return tracingTargetRepository.findHighPriorityTargets();
    }

    /**
     * Get targets at risk
     */
    public List<TracingTarget> getTargetsAtRisk() {
        return tracingTargetRepository.findTargetsAtRisk();
    }

    /**
     * Get target statistics by type
     */
    public List<Object[]> getTargetStatsByType() {
        return tracingTargetRepository.getTargetStatsByType();
    }

    /**
     * Get target statistics by status
     */
    public List<Object[]> getTargetStatsByStatus() {
        return tracingTargetRepository.getTargetStatsByStatus();
    }

    /**
     * Get target statistics by priority level
     */
    public List<Object[]> getTargetStatsByPriority() {
        return tracingTargetRepository.getTargetStatsByPriority();
    }

    /**
     * Get overall progress by material type
     */
    public List<Object[]> getProgressByMaterialType() {
        return tracingTargetRepository.getProgressByMaterialType();
    }

    /**
     * Search targets by multiple criteria
     */
    public List<TracingTarget> searchTargets(String targetName, String materialType,
                                           TracingTarget.TargetType targetType,
                                           TracingTarget.PriorityLevel priorityLevel,
                                           TracingTarget.TargetStatus targetStatus,
                                           String responsibleParty, String location) {
        return tracingTargetRepository.searchTargets(targetName, materialType, targetType,
                priorityLevel, targetStatus, responsibleParty, location);
    }

    /**
     * Update all target statuses based on current date and progress
     */
    public void updateTargetStatuses() {
        List<TracingTarget> activeTargets = getActiveTargets();
        for (TracingTarget target : activeTargets) {
            target.updateProgress();
            tracingTargetRepository.save(target);
        }
    }

    /**
     * Validate target data
     */
    public boolean validateTarget(TracingTarget target) {
        if (target == null) {
            return false;
        }
        
        // Check required fields
        if (target.getTargetName() == null || target.getTargetName().trim().isEmpty()) {
            return false;
        }
        
        if (target.getMaterialType() == null || target.getMaterialType().trim().isEmpty()) {
            return false;
        }
        
        if (target.getTargetQuantity() == null || target.getTargetQuantity().doubleValue() <= 0) {
            return false;
        }
        
        if (target.getUnit() == null || target.getUnit().trim().isEmpty()) {
            return false;
        }
        
        if (target.getTargetDate() == null || target.getStartDate() == null) {
            return false;
        }
        
        // Check if target date is after start date
        if (target.getTargetDate().isBefore(target.getStartDate())) {
            return false;
        }
        
        // Check if achieved quantity is not negative
        if (target.getAchievedQuantity() != null && target.getAchievedQuantity().doubleValue() < 0) {
            return false;
        }
        
        return true;
    }
}
