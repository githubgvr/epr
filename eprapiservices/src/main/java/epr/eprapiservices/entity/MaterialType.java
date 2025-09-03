package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entity representing different types of materials for EPR compliance tracking
 */
@Entity
@Table(name = "materialtype")
public class MaterialType extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "materialTypeId")
    private Integer materialTypeId;

    @NotBlank(message = "Material type name is required")
    @Size(max = 100, message = "Material type name must not exceed 100 characters")
    @Column(name = "materialTypeName", nullable = false, unique = true, length = 100)
    private String materialTypeName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Default constructor
     */
    public MaterialType() {
    }

    /**
     * Constructor for creating a new MaterialType with name and description
     */
    public MaterialType(String materialTypeName, String description) {
        this.materialTypeName = materialTypeName;
        this.description = description;
    }

    /**
     * Constructor for creating a new MaterialType with only name
     */
    public MaterialType(String materialTypeName) {
        this.materialTypeName = materialTypeName;
    }

    // Getters and Setters
    public Integer getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(Integer materialTypeId) {
        this.materialTypeId = materialTypeId;
    }

    public String getMaterialTypeName() {
        return materialTypeName;
    }

    public void setMaterialTypeName(String materialTypeName) {
        this.materialTypeName = materialTypeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
