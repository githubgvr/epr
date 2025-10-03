package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;

/**
 * Entity representing product categories for EPR compliance tracking
 */
@Entity
@Table(name = "productcategory")
public class ProductCategory extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productCategoryId")
    private Integer productCategoryId;

    @Column(name = "productCategoryName")
    private String productCategoryName;

    @Column(name = "description")
    private String description;

    @Column(name = "sortOrder")
    private Integer sortOrder;

    @Column(name = "productGroupId")
    private Integer productGroupId;

    // Default constructor
    public ProductCategory() {
    }

    // Constructor with required fields
    public ProductCategory(String productCategoryName) {
        this.productCategoryName = productCategoryName;
    }

    // Constructor with all fields
    public ProductCategory(String productCategoryName, String description, Integer sortOrder, Integer productGroupId) {
        this.productCategoryName = productCategoryName;
        this.description = description;
        this.sortOrder = sortOrder;
        this.productGroupId = productGroupId;
    }

    // Getters and Setters
    public Integer getProductCategoryId() {
        return productCategoryId;
    }

    public void setProductCategoryId(Integer productCategoryId) {
        this.productCategoryId = productCategoryId;
    }

    public String getProductCategoryName() {
        return productCategoryName;
    }

    public void setProductCategoryName(String productCategoryName) {
        this.productCategoryName = productCategoryName;
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

    public Integer getProductGroupId() {
        return productGroupId;
    }

    public void setProductGroupId(Integer productGroupId) {
        this.productGroupId = productGroupId;
    }

    @Override
    public String toString() {
        return "ProductCategory{" +
                "productCategoryId=" + productCategoryId +
                ", productCategoryName='" + productCategoryName + '\'' +
                ", description='" + description + '\'' +
                ", sortOrder=" + sortOrder +
                ", productGroupId=" + productGroupId +
                ", isActive=" + getIsActive() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductCategory that = (ProductCategory) o;
        return productCategoryId != null && productCategoryId.equals(that.productCategoryId);
    }

    @Override
    public int hashCode() {
        return productCategoryId != null ? productCategoryId.hashCode() : 0;
    }
}
