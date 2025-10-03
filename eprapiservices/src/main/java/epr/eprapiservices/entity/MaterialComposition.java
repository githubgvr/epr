package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Entity representing material compositions with weight and percentage ranges
 */
@Entity
@Table(name = "materialcomposition")
public class MaterialComposition extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_composition_id")
    private Integer materialCompositionId;

    @NotBlank(message = "Composition name is required")
    @Size(max = 100, message = "Composition name must not exceed 100 characters")
    @Column(name = "composition_name")
    private String compositionName;

    @NotBlank(message = "Composition code is required")
    @Size(max = 50, message = "Composition code must not exceed 50 characters")
    @Column(name = "composition_code")
    private String compositionCode;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description")
    private String description;

    @NotNull(message = "Material ID is required")
    @Column(name = "material_id")
    private Integer materialId;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.01", message = "Weight must be greater than 0")
    @Digits(integer = 10, fraction = 3, message = "Weight must have at most 10 integer digits and 3 decimal places")
    @Column(name = "weight_kg", precision = 13, scale = 3)
    private BigDecimal weightKg;

    @NotNull(message = "Minimum percentage is required")
    @DecimalMin(value = "0.00", message = "Minimum percentage must be 0 or greater")
    @DecimalMax(value = "100.00", message = "Minimum percentage must be 100 or less")
    @Digits(integer = 3, fraction = 2, message = "Percentage must have at most 3 integer digits and 2 decimal places")
    @Column(name = "min_percentage", precision = 5, scale = 2)
    private BigDecimal minPercentage;

    @NotNull(message = "Maximum percentage is required")
    @DecimalMin(value = "0.00", message = "Maximum percentage must be 0 or greater")
    @DecimalMax(value = "100.00", message = "Maximum percentage must be 100 or less")
    @Digits(integer = 3, fraction = 2, message = "Percentage must have at most 3 integer digits and 2 decimal places")
    @Column(name = "max_percentage", precision = 5, scale = 2)
    private BigDecimal maxPercentage;

    @Column(name = "sort_order")
    private Integer sortOrder = 1;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes")
    private String notes;

    // Default constructor
    public MaterialComposition() {
        super();
    }

    // Constructor with required fields
    public MaterialComposition(String compositionName, String compositionCode, Integer materialId,
                             BigDecimal weightKg, BigDecimal minPercentage, BigDecimal maxPercentage) {
        this();
        this.compositionName = compositionName;
        this.compositionCode = compositionCode;
        this.materialId = materialId;
        this.weightKg = weightKg;
        this.minPercentage = minPercentage;
        this.maxPercentage = maxPercentage;
    }

    // Getters and Setters
    public Integer getMaterialCompositionId() {
        return materialCompositionId;
    }

    public void setMaterialCompositionId(Integer materialCompositionId) {
        this.materialCompositionId = materialCompositionId;
    }

    public String getCompositionName() {
        return compositionName;
    }

    public void setCompositionName(String compositionName) {
        this.compositionName = compositionName;
    }

    public String getCompositionCode() {
        return compositionCode;
    }

    public void setCompositionCode(String compositionCode) {
        this.compositionCode = compositionCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(BigDecimal weightKg) {
        this.weightKg = weightKg;
    }

    public BigDecimal getMinPercentage() {
        return minPercentage;
    }

    public void setMinPercentage(BigDecimal minPercentage) {
        this.minPercentage = minPercentage;
    }

    public BigDecimal getMaxPercentage() {
        return maxPercentage;
    }

    public void setMaxPercentage(BigDecimal maxPercentage) {
        this.maxPercentage = maxPercentage;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "MaterialComposition{" +
                "materialCompositionId=" + materialCompositionId +
                ", compositionName='" + compositionName + '\'' +
                ", compositionCode='" + compositionCode + '\'' +
                ", materialId=" + materialId +
                ", weightKg=" + weightKg +
                ", minPercentage=" + minPercentage +
                ", maxPercentage=" + maxPercentage +
                ", sortOrder=" + sortOrder +
                '}';
    }
}
