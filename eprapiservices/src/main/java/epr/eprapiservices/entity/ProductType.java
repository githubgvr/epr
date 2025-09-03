package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "producttype")
public class ProductType extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productTypeId")
    private Integer productTypeId;

    @NotBlank(message = "Product type name is required")
    @Size(max = 100, message = "Product type name cannot exceed 100 characters")
    @Column(name = "productTypeName", nullable = false, length = 100)
    private String productTypeName;

    @Size(max = 500, message = "Product type description cannot exceed 500 characters")
    @Column(name = "productTypeDescription", length = 500)
    private String productTypeDescription;

    // Constructors+
    public ProductType() {}

    public ProductType(String productTypeName, String productTypeDescription) {
        this.productTypeName = productTypeName;
        this.productTypeDescription = productTypeDescription;
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

    @Override
    public String toString() {
        return "ProductType{" +
                "productTypeId=" + productTypeId +
                ", productTypeName='" + productTypeName + '\'' +
                ", productTypeDescription='" + productTypeDescription + '\'' +
                ", isActive=" + getIsActive() +
                '}';
    }
}
