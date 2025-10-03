package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;

@Entity
@Table(name = "producttype")
public class ProductType extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productTypeId")
    private Integer productTypeId;

    @Column(name = "productTypeName")
    private String productTypeName;

    @Column(name = "productTypeDescription")
    private String productTypeDescription;

    @Column(name = "sortOrder")
    private Integer sortOrder;

    @Column(name = "productCategoryId")
    private Integer productCategoryId;

    // Constructors+
    public ProductType() {}

    public ProductType(String productTypeName, String productTypeDescription, Integer sortOrder, Integer productCategoryId) {
        this.productTypeName = productTypeName;
        this.productTypeDescription = productTypeDescription;
        this.sortOrder = sortOrder;
        this.productCategoryId = productCategoryId;
    }

    // Getters and Setters
    public Integer getProductTypeId() {
        return productTypeId;
    }

    public void setProductTypeId(Integer productTypeId) {
        this.productTypeId = productTypeId;
    }

    public String getProductTypeName() {
        return productTypeName;
    }

    public void setProductTypeName(String productTypeName) {
        this.productTypeName = productTypeName;
    }

    public String getProductTypeDescription() {
        return productTypeDescription;
    }

    public void setProductTypeDescription(String productTypeDescription) {
        this.productTypeDescription = productTypeDescription;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getProductCategoryId() {
        return productCategoryId;
    }

    public void setProductCategoryId(Integer productCategoryId) {
        this.productCategoryId = productCategoryId;
    }

    @Override
    public String toString() {
        return "ProductType{" +
                "productTypeId=" + productTypeId +
                ", productTypeName='" + productTypeName + '\'' +
                ", productTypeDescription='" + productTypeDescription + '\'' +
                ", sortOrder=" + sortOrder +
                ", productCategoryId=" + productCategoryId +
                ", isActive=" + getIsActive() +
                '}';
    }
}
