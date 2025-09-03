package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing recycling activity logs
 */
@Entity
@Table(name = "recycle_log")
public class RecycleLog extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recycleLogId")
    private Integer recycleLogId;

    @NotBlank(message = "Material type is required")
    @Size(max = 100, message = "Material type must not exceed 100 characters")
    @Column(name = "materialType", nullable = false, length = 100)
    private String materialType;

    @NotNull(message = "Quantity recycled is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Quantity must be a valid decimal")
    @Column(name = "quantityRecycled", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantityRecycled;

    @NotBlank(message = "Unit is required")
    @Size(max = 20, message = "Unit must not exceed 20 characters")
    @Column(name = "unit", nullable = false, length = 20)
    private String unit; // kg, tonnes, pieces, etc.

    @NotNull(message = "Recycle date is required")
    @Column(name = "recycleDate", nullable = false)
    private LocalDateTime recycleDate;

    @NotBlank(message = "Recycler name is required")
    @Size(max = 100, message = "Recycler name must not exceed 100 characters")
    @Column(name = "recyclerName", nullable = false, length = 100)
    private String recyclerName;

    @Size(max = 50, message = "Recycler ID must not exceed 50 characters")
    @Column(name = "recyclerId", length = 50)
    private String recyclerId;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must not exceed 200 characters")
    @Column(name = "location", nullable = false, length = 200)
    private String location;

    @NotNull(message = "Processing method is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "processingMethod", nullable = false)
    private ProcessingMethod processingMethod;

    @NotNull(message = "Quality grade is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "qualityGrade", nullable = false)
    private QualityGrade qualityGrade;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    @Size(max = 200, message = "Batch number must not exceed 200 characters")
    @Column(name = "batchNumber", length = 200)
    private String batchNumber;

    @DecimalMin(value = "0.0", message = "Recovery rate must be non-negative")
    @DecimalMax(value = "100.0", message = "Recovery rate cannot exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Recovery rate must be a valid percentage")
    @Column(name = "recoveryRate", precision = 5, scale = 2)
    private BigDecimal recoveryRate; // Percentage

    // Enums
    public enum ProcessingMethod {
        MECHANICAL_RECYCLING,
        CHEMICAL_RECYCLING,
        ENERGY_RECOVERY,
        BIOLOGICAL_TREATMENT,
        REUSE,
        OTHER
    }

    public enum QualityGrade {
        GRADE_A, // High quality
        GRADE_B, // Medium quality
        GRADE_C, // Low quality
        CONTAMINATED,
        MIXED
    }

    // Default constructor
    public RecycleLog() {
        this.recycleDate = LocalDateTime.now();
        this.processingMethod = ProcessingMethod.MECHANICAL_RECYCLING;
        this.qualityGrade = QualityGrade.GRADE_B;
    }

    // Constructor with required fields
    public RecycleLog(String materialType, BigDecimal quantityRecycled, String unit, 
                     String recyclerName, String location) {
        this();
        this.materialType = materialType;
        this.quantityRecycled = quantityRecycled;
        this.unit = unit;
        this.recyclerName = recyclerName;
        this.location = location;
    }

    // Getters and Setters
    public Integer getRecycleLogId() {
        return recycleLogId;
    }

    public void setRecycleLogId(Integer recycleLogId) {
        this.recycleLogId = recycleLogId;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public BigDecimal getQuantityRecycled() {
        return quantityRecycled;
    }

    public void setQuantityRecycled(BigDecimal quantityRecycled) {
        this.quantityRecycled = quantityRecycled;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getRecycleDate() {
        return recycleDate;
    }

    public void setRecycleDate(LocalDateTime recycleDate) {
        this.recycleDate = recycleDate;
    }

    public String getRecyclerName() {
        return recyclerName;
    }

    public void setRecyclerName(String recyclerName) {
        this.recyclerName = recyclerName;
    }

    public String getRecyclerId() {
        return recyclerId;
    }

    public void setRecyclerId(String recyclerId) {
        this.recyclerId = recyclerId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ProcessingMethod getProcessingMethod() {
        return processingMethod;
    }

    public void setProcessingMethod(ProcessingMethod processingMethod) {
        this.processingMethod = processingMethod;
    }

    public QualityGrade getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(QualityGrade qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public BigDecimal getRecoveryRate() {
        return recoveryRate;
    }

    public void setRecoveryRate(BigDecimal recoveryRate) {
        this.recoveryRate = recoveryRate;
    }

    @Override
    public String toString() {
        return "RecycleLog{" +
                "recycleLogId=" + recycleLogId +
                ", materialType='" + materialType + '\'' +
                ", quantityRecycled=" + quantityRecycled +
                ", unit='" + unit + '\'' +
                ", recycleDate=" + recycleDate +
                ", recyclerName='" + recyclerName + '\'' +
                ", location='" + location + '\'' +
                ", processingMethod=" + processingMethod +
                ", qualityGrade=" + qualityGrade +
                '}';
    }
}
