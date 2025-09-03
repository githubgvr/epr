package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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

    @NotBlank(message = "Product category name is required")
    @Size(max = 100, message = "Product category name must not exceed 100 characters")
    @Column(name = "productCategoryName", nullable = false, unique = true, length = 100)
    private String productCategoryName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "categoryCode", length = 20)
    private String categoryCode;

    @Column(name = "sortOrder")
    private Integer sortOrder;

    // Default constructor
    public ProductCategory() {
    }

    // Constructor with required fields
    public ProductCategory(String productCategoryName) {
        this.productCategoryName = productCategoryName;
    }

    // Constructor with all fields
    public ProductCategory(String productCategoryName, String description, String categoryCode) {
        this.productCategoryName = productCategoryName;
        this.description = description;
        this.categoryCode = categoryCode;
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

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    @Override
    public String toString() {
        return "ProductCategory{" +
                "productCategoryId=" + productCategoryId +
                ", productCategoryName='" + productCategoryName + '\'' +
                ", description='" + description + '\'' +
                ", categoryCode='" + categoryCode + '\'' +
                ", sortOrder=" + sortOrder +
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
