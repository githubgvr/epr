package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Entity representing product certifications
 * Stores regulatory certifications, compliance documents, and related information for products
 */
@Entity
@Table(name = "productcertifications")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductCertification extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificationId")
    private Long certificationId;

    @NotNull(message = "Product ID is required")
    @Column(name = "productId", nullable = false)
    private Integer productId;

    @NotBlank(message = "Certification name is required")
    @Size(max = 200, message = "Certification name must not exceed 200 characters")
    @Column(name = "certificationName", nullable = false, length = 200)
    private String certificationName;

    @NotBlank(message = "Certification type is required")
    @Size(max = 100, message = "Certification type must not exceed 100 characters")
    @Column(name = "certificationType", nullable = false, length = 100)
    private String certificationType;

    @Size(max = 100, message = "Issuing authority must not exceed 100 characters")
    @Column(name = "issuingAuthority", length = 100)
    private String issuingAuthority;

    @Size(max = 50, message = "Certificate number must not exceed 50 characters")
    @Column(name = "certificateNumber", length = 50)
    private String certificateNumber;

    @Column(name = "issueDate")
    private LocalDate issueDate;

    @Column(name = "expiryDate")
    private LocalDate expiryDate;

    @Size(max = 20, message = "Status must not exceed 20 characters")
    @Column(name = "status", length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, REVOKED, PENDING

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Size(max = 255, message = "File path must not exceed 255 characters")
    @Column(name = "filePath", length = 255)
    private String filePath;

    @Size(max = 100, message = "File name must not exceed 100 characters")
    @Column(name = "fileName", length = 100)
    private String fileName;

    @Size(max = 20, message = "File type must not exceed 20 characters")
    @Column(name = "fileType", length = 20)
    private String fileType;

    @Column(name = "fileSize")
    private Long fileSize;

    @Column(name = "compliancePercentage")
    private Double compliancePercentage;

    @Size(max = 100, message = "Verification status must not exceed 100 characters")
    @Column(name = "verificationStatus", length = 100)
    private String verificationStatus; // VERIFIED, PENDING, REJECTED, NOT_VERIFIED

    @Column(name = "verificationDate")
    private LocalDate verificationDate;

    @Size(max = 100, message = "Verified by must not exceed 100 characters")
    @Column(name = "verifiedBy", length = 100)
    private String verifiedBy;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    @Column(name = "notes", length = 500)
    private String notes;

    // Relationship with Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"certifications", "hibernateLazyInitializer", "handler"})
    @JsonIgnore
    private Product product;

    // Default constructor
    public ProductCertification() {
        super();
        this.status = "ACTIVE";
        this.verificationStatus = "NOT_VERIFIED";
    }

    // Constructor with required fields
    public ProductCertification(Integer productId, String certificationName, String certificationType) {
        this();
        this.productId = productId;
        this.certificationName = certificationName;
        this.certificationType = certificationType;
    }

    // Getters and Setters
    public Long getCertificationId() {
        return certificationId;
    }

    public void setCertificationId(Long certificationId) {
        this.certificationId = certificationId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(String certificationName) {
        this.certificationName = certificationName;
    }

    public String getCertificationType() {
        return certificationType;
    }

    public void setCertificationType(String certificationType) {
        this.certificationType = certificationType;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Double getCompliancePercentage() {
        return compliancePercentage;
    }

    public void setCompliancePercentage(Double compliancePercentage) {
        this.compliancePercentage = compliancePercentage;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDate getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDate verificationDate) {
        this.verificationDate = verificationDate;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // Helper methods
    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public boolean isExpiringSoon(int daysThreshold) {
        return expiryDate != null && 
               expiryDate.isAfter(LocalDate.now()) && 
               expiryDate.isBefore(LocalDate.now().plusDays(daysThreshold));
    }

    public boolean hasFile() {
        return filePath != null && !filePath.trim().isEmpty();
    }

    public boolean isVerified() {
        return "VERIFIED".equalsIgnoreCase(verificationStatus);
    }

    @Override
    public String toString() {
        return "ProductCertification{" +
                "certificationId=" + certificationId +
                ", productId=" + productId +
                ", certificationName='" + certificationName + '\'' +
                ", certificationType='" + certificationType + '\'' +
                ", status='" + status + '\'' +
                ", verificationStatus='" + verificationStatus + '\'' +
                '}';
    }
}
