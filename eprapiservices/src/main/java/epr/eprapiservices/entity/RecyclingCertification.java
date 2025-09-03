package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * Entity representing recycling material certifications
 */
@Entity
@Table(name = "recycling_certification")
public class RecyclingCertification extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificationId")
    private Integer certificationId;

    @NotBlank(message = "Certification name is required")
    @Size(max = 100, message = "Certification name must not exceed 100 characters")
    @Column(name = "certificationName", nullable = false, length = 100)
    private String certificationName;

    @NotBlank(message = "Certification number is required")
    @Size(max = 50, message = "Certification number must not exceed 50 characters")
    @Column(name = "certificationNumber", nullable = false, unique = true, length = 50)
    private String certificationNumber;

    @NotNull(message = "Certification type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "certificationType", nullable = false)
    private CertificationType certificationType;

    @NotBlank(message = "Issuing authority is required")
    @Size(max = 100, message = "Issuing authority must not exceed 100 characters")
    @Column(name = "issuingAuthority", nullable = false, length = 100)
    private String issuingAuthority;

    @NotNull(message = "Issue date is required")
    @Column(name = "issueDate", nullable = false)
    private LocalDate issueDate;

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiryDate", nullable = false)
    private LocalDate expiryDate;

    @NotBlank(message = "Material type is required")
    @Size(max = 100, message = "Material type must not exceed 100 characters")
    @Column(name = "materialType", nullable = false, length = 100)
    private String materialType;

    @NotBlank(message = "Recycler name is required")
    @Size(max = 100, message = "Recycler name must not exceed 100 characters")
    @Column(name = "recyclerName", nullable = false, length = 100)
    private String recyclerName;

    @Size(max = 50, message = "Recycler ID must not exceed 50 characters")
    @Column(name = "recyclerId", length = 50)
    private String recyclerId;

    @NotNull(message = "Certification status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "certificationStatus", nullable = false)
    private CertificationStatus certificationStatus;

    @Size(max = 200, message = "File path must not exceed 200 characters")
    @Column(name = "certificationFilePath", length = 200)
    private String certificationFilePath;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "description", length = 500)
    private String description;

    @Size(max = 100, message = "Scope must not exceed 100 characters")
    @Column(name = "scope", length = 100)
    private String scope; // What the certification covers

    @Size(max = 200, message = "Standards must not exceed 200 characters")
    @Column(name = "standards", length = 200)
    private String standards; // Standards/regulations it complies with

    // Enums
    public enum CertificationType {
        ISO_14001, // Environmental Management
        ISO_9001,  // Quality Management
        RECYCLING_FACILITY,
        MATERIAL_RECOVERY,
        WASTE_MANAGEMENT,
        ENVIRONMENTAL_COMPLIANCE,
        QUALITY_ASSURANCE,
        CHAIN_OF_CUSTODY,
        OTHER
    }

    public enum CertificationStatus {
        VALID,
        EXPIRED,
        SUSPENDED,
        REVOKED,
        PENDING_RENEWAL
    }

    // Default constructor
    public RecyclingCertification() {
        this.certificationStatus = CertificationStatus.VALID;
        this.certificationType = CertificationType.RECYCLING_FACILITY;
    }

    // Constructor with required fields
    public RecyclingCertification(String certificationName, String certificationNumber,
                                CertificationType certificationType, String issuingAuthority,
                                LocalDate issueDate, LocalDate expiryDate, String materialType,
                                String recyclerName) {
        this();
        this.certificationName = certificationName;
        this.certificationNumber = certificationNumber;
        this.certificationType = certificationType;
        this.issuingAuthority = issuingAuthority;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.materialType = materialType;
        this.recyclerName = recyclerName;
    }

    // Getters and Setters
    public Integer getCertificationId() {
        return certificationId;
    }

    public void setCertificationId(Integer certificationId) {
        this.certificationId = certificationId;
    }

    public String getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(String certificationName) {
        this.certificationName = certificationName;
    }

    public String getCertificationNumber() {
        return certificationNumber;
    }

    public void setCertificationNumber(String certificationNumber) {
        this.certificationNumber = certificationNumber;
    }

    public CertificationType getCertificationType() {
        return certificationType;
    }

    public void setCertificationType(CertificationType certificationType) {
        this.certificationType = certificationType;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
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

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public String getRecyclerName() {
        return recyclerName;
    }

    public void setRecyclerName(String recyclerName) {
        this.recyclerName = recyclerName;
    }

    public String getRecyclerId() {
        return recyclerId;
    }

    public void setRecyclerId(String recyclerId) {
        this.recyclerId = recyclerId;
    }

    public CertificationStatus getCertificationStatus() {
        return certificationStatus;
    }

    public void setCertificationStatus(CertificationStatus certificationStatus) {
        this.certificationStatus = certificationStatus;
    }

    public String getCertificationFilePath() {
        return certificationFilePath;
    }

    public void setCertificationFilePath(String certificationFilePath) {
        this.certificationFilePath = certificationFilePath;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getStandards() {
        return standards;
    }

    public void setStandards(String standards) {
        this.standards = standards;
    }

    @Override
    public String toString() {
        return "RecyclingCertification{" +
                "certificationId=" + certificationId +
                ", certificationName='" + certificationName + '\'' +
                ", certificationNumber='" + certificationNumber + '\'' +
                ", certificationType=" + certificationType +
                ", issuingAuthority='" + issuingAuthority + '\'' +
                ", materialType='" + materialType + '\'' +
                ", recyclerName='" + recyclerName + '\'' +
                ", certificationStatus=" + certificationStatus +
                '}';
    }
}
