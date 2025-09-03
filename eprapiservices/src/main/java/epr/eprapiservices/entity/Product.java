package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

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

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    @Column(name = "productName", nullable = false, length = 100)
    private String productName;

    @NotBlank(message = "SKU/Product Code is required")
    @Size(max = 50, message = "SKU/Product Code must not exceed 50 characters")
    @Column(name = "skuProductCode", nullable = false, length = 50, unique = true)
    private String skuProductCode;

    @NotNull(message = "Product group is required")
    @Column(name = "productGroupId", nullable = false)
    private Integer productGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productGroupId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductGroup productGroup;

    @Size(max = 250, message = "Product description must not exceed 250 characters")
    @Column(name = "productDescription", length = 250)
    private String productDescription;

    @NotNull(message = "Product weight is required")
    @DecimalMin(value = "0.01", message = "Product weight must be at least 0.01 kg")
    @Digits(integer = 10, fraction = 3, message = "Product weight must be a valid decimal with up to 3 decimal places")
    @Column(name = "productWeight", nullable = false, precision = 13, scale = 3)
    private BigDecimal productWeight;

    @NotNull(message = "Product lifecycle duration is required")
    @Min(value = 1, message = "Product lifecycle duration must be at least 1 year")
    @Max(value = 50, message = "Product lifecycle duration must not exceed 50 years")
    @Column(name = "productLifecycleDuration", nullable = false)
    private Integer productLifecycleDuration;

    @NotNull(message = "Compliance target is required")
    @DecimalMin(value = "0.0", message = "Compliance target must be at least 0%")
    @DecimalMax(value = "100.0", message = "Compliance target must not exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Compliance target must be a valid percentage")
    @Column(name = "complianceTargetPercentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal complianceTargetPercentage;

    @Size(max = 500, message = "Regulatory certifications path must not exceed 500 characters")
    @Column(name = "regulatoryCertificationsPath", length = 500)
    private String regulatoryCertificationsPath;

    @Column(name = "registrationDate", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "product_manufacturing_date")
    private LocalDate productManufacturingDate;

    @Column(name = "product_expiry_date")
    private LocalDate productExpiryDate;

    // Relationship with ProductCertifications
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductCertification> certifications = new ArrayList<>();

    // Default constructor
    public Product() {
        this.registrationDate = LocalDate.now();
    }

    // Constructor with required fields
    public Product(String productName, String skuProductCode, Integer productGroupId,
                   BigDecimal productWeight, Integer productLifecycleDuration,
                   BigDecimal complianceTargetPercentage) {
        this();
        this.productName = productName;
        this.skuProductCode = skuProductCode;
        this.productGroupId = productGroupId;
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

    public Integer getProductGroupId() {
        return productGroupId;
    }

    public void setProductGroupId(Integer productGroupId) {
        this.productGroupId = productGroupId;
    }

    public ProductGroup getProductGroup() {
        return productGroup;
    }

    public void setProductGroup(ProductGroup productGroup) {
        this.productGroup = productGroup;
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

    public List<ProductCertification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<ProductCertification> certifications) {
        this.certifications = certifications;
    }

    // Helper method to add a certification
    public void addCertification(ProductCertification certification) {
        if (this.certifications == null) {
            this.certifications = new ArrayList<>();
        }
        this.certifications.add(certification);
        certification.setProductId(this.productId);
    }

    // Helper method to remove a certification
    public void removeCertification(ProductCertification certification) {
        if (this.certifications != null) {
            this.certifications.remove(certification);
        }
    }

    @Override
    public String toString() {
        return "Product{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", skuProductCode='" + skuProductCode + '\'' +
                ", productGroupId=" + productGroupId +
                ", productWeight=" + productWeight +
                ", productLifecycleDuration=" + productLifecycleDuration +
                ", complianceTargetPercentage=" + complianceTargetPercentage +
                ", registrationDate=" + registrationDate +
                '}';
    }
}
