package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entity representing recycling tracing targets and goals
 */
@Entity
@Table(name = "tracing_target")
public class TracingTarget extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "targetId")
    private Integer targetId;

    @NotBlank(message = "Target name is required")
    @Size(max = 100, message = "Target name must not exceed 100 characters")
    @Column(name = "targetName", nullable = false, length = 100)
    private String targetName;

    @NotBlank(message = "Material type is required")
    @Size(max = 100, message = "Material type must not exceed 100 characters")
    @Column(name = "materialType", nullable = false, length = 100)
    private String materialType;

    @NotNull(message = "Target quantity is required")
    @DecimalMin(value = "0.01", message = "Target quantity must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Target quantity must be a valid decimal")
    @Column(name = "targetQuantity", nullable = false, precision = 12, scale = 2)
    private BigDecimal targetQuantity;

    @DecimalMin(value = "0.0", message = "Achieved quantity must be non-negative")
    @Digits(integer = 10, fraction = 2, message = "Achieved quantity must be a valid decimal")
    @Column(name = "achievedQuantity", precision = 12, scale = 2)
    private BigDecimal achievedQuantity;

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit must not exceed 20 characters")
    @Column(name = "unit", nullable = false, length = 20)
    private String unit; // kg, tonnes, pieces, etc.

    @NotNull(message = "Target date is required")
    @Column(name = "targetDate", nullable = false)
    private LocalDate targetDate;

    @NotNull(message = "Start date is required")
    @Column(name = "startDate", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "Target type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "targetType", nullable = false)
    private TargetType targetType;

    @NotNull(message = "Priority level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "priorityLevel", nullable = false)
    private PriorityLevel priorityLevel;

    @NotNull(message = "Target status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "targetStatus", nullable = false)
    private TargetStatus targetStatus;

    @Size(max = 100, message = "Responsible party must not exceed 100 characters")
    @Column(name = "responsibleParty", length = 100)
    private String responsibleParty;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Column(name = "location", length = 200)
    private String location;

    @DecimalMin(value = "0.0", message = "Progress percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Progress percentage cannot exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Progress percentage must be a valid percentage")
    @Column(name = "progressPercentage", precision = 5, scale = 2)
    private BigDecimal progressPercentage;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    // Enums
    public enum TargetType {
        COLLECTION_TARGET,
        RECYCLING_TARGET,
        RECOVERY_TARGET,
        REDUCTION_TARGET,
        REUSE_TARGET,
        COMPLIANCE_TARGET,
        ENVIRONMENTAL_TARGET
    }

    public enum PriorityLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum TargetStatus {
        NOT_STARTED,
        IN_PROGRESS,
        ON_TRACK,
        AT_RISK,
        DELAYED,
        COMPLETED,
        CANCELLED,
        EXCEEDED
    }

    // Default constructor
    public TracingTarget() {
        this.achievedQuantity = BigDecimal.ZERO;
        this.progressPercentage = BigDecimal.ZERO;
        this.targetStatus = TargetStatus.NOT_STARTED;
        this.priorityLevel = PriorityLevel.MEDIUM;
        this.targetType = TargetType.RECYCLING_TARGET;
        this.startDate = LocalDate.now();
    }

    // Constructor with required fields
    public TracingTarget(String targetName, String materialType, BigDecimal targetQuantity,
                        String unit, LocalDate targetDate, TargetType targetType) {
        this();
        this.targetName = targetName;
        this.materialType = materialType;
        this.targetQuantity = targetQuantity;
        this.unit = unit;
        this.targetDate = targetDate;
        this.targetType = targetType;
    }

    // Business methods
    public void updateProgress() {
        if (targetQuantity != null && achievedQuantity != null && targetQuantity.compareTo(BigDecimal.ZERO) > 0) {
            this.progressPercentage = achievedQuantity
                    .divide(targetQuantity, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
            
            // Update status based on progress
            if (progressPercentage.compareTo(new BigDecimal("100")) >= 0) {
                this.targetStatus = TargetStatus.COMPLETED;
            } else if (progressPercentage.compareTo(new BigDecimal("75")) >= 0) {
                this.targetStatus = TargetStatus.ON_TRACK;
            } else if (targetDate != null && LocalDate.now().isAfter(targetDate)) {
                this.targetStatus = TargetStatus.DELAYED;
            } else {
                this.targetStatus = TargetStatus.IN_PROGRESS;
            }
        }
    }

    // Getters and Setters
    public Integer getTargetId() {
        return targetId;
    }

    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }

    public String getTargetName() {
        return targetName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public BigDecimal getTargetQuantity() {
        return targetQuantity;
    }

    public void setTargetQuantity(BigDecimal targetQuantity) {
        this.targetQuantity = targetQuantity;
        updateProgress();
    }

    public BigDecimal getAchievedQuantity() {
        return achievedQuantity;
    }

    public void setAchievedQuantity(BigDecimal achievedQuantity) {
        this.achievedQuantity = achievedQuantity;
        updateProgress();
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public TargetType getTargetType() {
        return targetType;
    }

    public void setTargetType(TargetType targetType) {
        this.targetType = targetType;
    }

    public PriorityLevel getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(PriorityLevel priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public TargetStatus getTargetStatus() {
        return targetStatus;
    }

    public void setTargetStatus(TargetStatus targetStatus) {
        this.targetStatus = targetStatus;
    }

    public String getResponsibleParty() {
        return responsibleParty;
    }

    public void setResponsibleParty(String responsibleParty) {
        this.responsibleParty = responsibleParty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(BigDecimal progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "TracingTarget{" +
                "targetId=" + targetId +
                ", targetName='" + targetName + '\'' +
                ", materialType='" + materialType + '\'' +
                ", targetQuantity=" + targetQuantity +
                ", achievedQuantity=" + achievedQuantity +
                ", unit='" + unit + '\'' +
                ", targetDate=" + targetDate +
                ", targetType=" + targetType +
                ", targetStatus=" + targetStatus +
                ", progressPercentage=" + progressPercentage +
                '}';
    }
}
