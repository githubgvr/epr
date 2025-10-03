package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing products for EPR compliance tracking
 */
@Entity
@Table(name = "product")
public class Product extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productId")
    private Integer productId;

    @Column(name = "productName")
    private String productName;

    @Column(name = "skuProductCode")
    private String skuProductCode;

    @Column(name = "productDescription")
    private String productDescription;

    @Column(name = "productWeight")
    private BigDecimal productWeight;

    @Column(name = "productLifecycleDuration")
    private Integer productLifecycleDuration;

    @Column(name = "complianceTargetPercentage")
    private BigDecimal complianceTargetPercentage;

    @Column(name = "regulatoryCertificationsPath")
    private String regulatoryCertificationsPath;

    @Column(name = "registrationDate")
    private LocalDate registrationDate;

    @Column(name = "product_manufacturing_date")
    private LocalDate productManufacturingDate;

    @Column(name = "product_expiry_date")
    private LocalDate productExpiryDate;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProductComponentComposition> componentCompositions = new ArrayList<>();

    // Default constructor
    public Product() {
        this.registrationDate = LocalDate.now();
    }

    // Constructor with required fields
    public Product(String productName, String skuProductCode,
                   BigDecimal productWeight, Integer productLifecycleDuration,
                   BigDecimal complianceTargetPercentage) {
        this();
        this.productName = productName;
        this.skuProductCode = skuProductCode;
        this.productWeight = productWeight;
        this.productLifecycleDuration = productLifecycleDuration;
        this.complianceTargetPercentage = complianceTargetPercentage;
    }

    // Getters and Setters
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSkuProductCode() {
        return skuProductCode;
    }

    public void setSkuProductCode(String skuProductCode) {
        this.skuProductCode = skuProductCode;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public BigDecimal getProductWeight() {
        return productWeight;
    }

    public void setProductWeight(BigDecimal productWeight) {
        this.productWeight = productWeight;
    }

    public Integer getProductLifecycleDuration() {
        return productLifecycleDuration;
    }

    public void setProductLifecycleDuration(Integer productLifecycleDuration) {
        this.productLifecycleDuration = productLifecycleDuration;
    }

    public BigDecimal getComplianceTargetPercentage() {
        return complianceTargetPercentage;
    }

    public void setComplianceTargetPercentage(BigDecimal complianceTargetPercentage) {
        this.complianceTargetPercentage = complianceTargetPercentage;
    }

    public String getRegulatoryCertificationsPath() {
        return regulatoryCertificationsPath;
    }

    public void setRegulatoryCertificationsPath(String regulatoryCertificationsPath) {
        this.regulatoryCertificationsPath = regulatoryCertificationsPath;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public LocalDate getProductManufacturingDate() {
        return productManufacturingDate;
    }

    public void setProductManufacturingDate(LocalDate productManufacturingDate) {
        this.productManufacturingDate = productManufacturingDate;
    }

    public LocalDate getProductExpiryDate() {
        return productExpiryDate;
    }

    public void setProductExpiryDate(LocalDate productExpiryDate) {
        this.productExpiryDate = productExpiryDate;
    }

    public List<ProductComponentComposition> getComponentCompositions() {
        return componentCompositions;
    }

    public void setComponentCompositions(List<ProductComponentComposition> componentCompositions) {
        this.componentCompositions = componentCompositions;
    }

    // Helper methods
    public void addComponentComposition(ProductComponentComposition composition) {
        componentCompositions.add(composition);
        composition.setProduct(this);
    }

    public void removeComponentComposition(ProductComponentComposition composition) {
        componentCompositions.remove(composition);
        composition.setProduct(null);
    }

    @Override
    public String toString() {
        return "Product{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", skuProductCode='" + skuProductCode + '\'' +
                ", productWeight=" + productWeight +
                ", productLifecycleDuration=" + productLifecycleDuration +
                ", complianceTargetPercentage=" + complianceTargetPercentage +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
