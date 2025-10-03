package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;

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

    @Column(name = "productGroupName")
    private String productGroupName;

    @Column(name = "description")
    private String description;

    @Column(name = "sortOrder")
    private Integer sortOrder;

    // Default constructor
    public ProductGroup() {
    }

    // Constructor with required fields
    public ProductGroup(String productGroupName) {
        this.productGroupName = productGroupName;
    }

    // Constructor with all fields
    public ProductGroup(String productGroupName, String description, Integer sortOrder) {
        this.productGroupName = productGroupName;
        this.description = description;
        this.sortOrder = sortOrder;
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

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    @Override
    public String toString() {
        return "ProductGroup{" +
                "productGroupId=" + productGroupId +
                ", productGroupName='" + productGroupName + '\'' +
                ", description='" + description + '\'' +
                ", sortOrder=" + sortOrder +
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
