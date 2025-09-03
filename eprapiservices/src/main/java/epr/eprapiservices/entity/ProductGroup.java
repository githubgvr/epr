package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entity representing product groups for EPR compliance tracking
 */
@Entity
@Table(name = "productgroup")
public class ProductGroup extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productGroupId")
    private Integer productGroupId;

    @NotBlank(message = "Product group name is required")
    @Size(max = 100, message = "Product group name must not exceed 100 characters")
    @Column(name = "productGroupName", nullable = false, unique = true, length = 100)
    private String productGroupName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    // Default constructor
    public ProductGroup() {
    }

    // Constructor with required fields
    public ProductGroup(String productGroupName) {
        this.productGroupName = productGroupName;
    }

    // Constructor with all fields
    public ProductGroup(String productGroupName, String description) {
        this.productGroupName = productGroupName;
        this.description = description;
    }

    // Getters and Setters
    public Integer getProductGroupId() {
        return productGroupId;
    }

    public void setProductGroupId(Integer productGroupId) {
        this.productGroupId = productGroupId;
    }

    public String getProductGroupName() {
        return productGroupName;
    }

    public void setProductGroupName(String productGroupName) {
        this.productGroupName = productGroupName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "ProductGroup{" +
                "productGroupId=" + productGroupId +
                ", productGroupName='" + productGroupName + '\'' +
                ", description='" + description + '\'' +
                ", isActive=" + getIsActive() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductGroup that = (ProductGroup) o;
        return productGroupId != null && productGroupId.equals(that.productGroupId);
    }

    @Override
    public int hashCode() {
        return productGroupId != null ? productGroupId.hashCode() : 0;
    }
}
