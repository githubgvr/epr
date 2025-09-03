package epr.eprapiservices.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "material")
public class Material extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "materialId")
    private Integer materialId;

    @NotBlank(message = "Material name is required")
    @Size(max = 100, message = "Material name must not exceed 100 characters")
    @Column(name = "materialName", nullable = false, length = 100)
    private String materialName;

    @NotBlank(message = "Material code is required")
    @Size(max = 50, message = "Material code must not exceed 50 characters")
    @Column(name = "materialCode", nullable = false, length = 50, unique = true)
    private String materialCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Material type is required")
    @Column(name = "materialTypeId", nullable = false)
    private Integer materialTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materialTypeId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MaterialType materialType;

    // Default constructor
    public Material() {
    }

    // Constructor with required fields
    public Material(String materialName, String materialCode, Integer materialTypeId) {
        this.materialName = materialName;
        this.materialCode = materialCode;
        this.materialTypeId = materialTypeId;
    }

    // Getters and Setters
    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer materialId) {
        this.materialId = materialId;
    }

    public String getMaterialName() {
        return materialName;
    }

    public void setMaterialName(String materialName) {
        this.materialName = materialName;
    }

    public String getMaterialCode() {
        return materialCode;
    }

    public void setMaterialCode(String materialCode) {
        this.materialCode = materialCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(Integer materialTypeId) {
        this.materialTypeId = materialTypeId;
    }

    public MaterialType getMaterialType() {
        return materialType;
    }

    public void setMaterialType(MaterialType materialType) {
        this.materialType = materialType;
    }

    @Override
    public String toString() {
        return "Material{" +
                "materialId=" + materialId +
                ", materialName='" + materialName + '\'' +
                ", materialCode='" + materialCode + '\'' +
                ", description='" + description + '\'' +
                ", materialTypeId=" + materialTypeId +
                ", isActive=" + getIsActive() +
                '}';
    }
}
