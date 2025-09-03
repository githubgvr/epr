package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Entity representing vendors for waste collection and recycling
 */
@Entity
@Table(name = "vendor")
public class Vendor extends BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vendorId")
    private Integer vendorId;

    @NotBlank(message = "Vendor name is required")
    @Size(max = 100, message = "Vendor name must not exceed 100 characters")
    @Column(name = "vendorName", nullable = false, length = 100)
    private String vendorName;

    @NotBlank(message = "Vendor ID is required")
    @Size(max = 50, message = "Vendor ID must not exceed 50 characters")
    @Column(name = "vendorCode", nullable = false, unique = true, length = 50)
    private String vendorCode;

    @NotNull(message = "Vendor capacity is required")
    @DecimalMin(value = "1.0", message = "Vendor capacity must be at least 1 tonne")
    @Digits(integer = 10, fraction = 2, message = "Vendor capacity must be a valid decimal")
    @Column(name = "vendorCapacityTonnes", nullable = false, precision = 12, scale = 2)
    private BigDecimal vendorCapacityTonnes;

    @NotBlank(message = "Assigned tasks are required")
    @Size(max = 250, message = "Assigned tasks must not exceed 250 characters")
    @Column(name = "assignedTasks", nullable = false, length = 250)
    private String assignedTasks;

    @Column(name = "vendorPerformanceMetrics", columnDefinition = "TEXT")
    private String vendorPerformanceMetrics; // JSON stored as text

    @NotNull(message = "Vendor certification status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "vendorCertificationStatus", nullable = false)
    private CertificationStatus vendorCertificationStatus;

    @Size(max = 250, message = "Vendor feedback must not exceed 250 characters")
    @Column(name = "vendorFeedback", length = 250)
    private String vendorFeedback;

    // Enum for certification status
    public enum CertificationStatus {
        VALID, EXPIRED
    }

    // Default constructor
    public Vendor() {
        this.vendorCertificationStatus = CertificationStatus.VALID;
    }

    // Constructor with required fields
    public Vendor(String vendorName, String vendorCode, BigDecimal vendorCapacityTonnes, String assignedTasks) {
        this();
        this.vendorName = vendorName;
        this.vendorCode = vendorCode;
        this.vendorCapacityTonnes = vendorCapacityTonnes;
        this.assignedTasks = assignedTasks;
    }

    // Getters and Setters
    public Integer getVendorId() {
        return vendorId;
    }

    public void setVendorId(Integer vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getVendorCode() {
        return vendorCode;
    }

    public void setVendorCode(String vendorCode) {
        this.vendorCode = vendorCode;
    }

    public BigDecimal getVendorCapacityTonnes() {
        return vendorCapacityTonnes;
    }

    public void setVendorCapacityTonnes(BigDecimal vendorCapacityTonnes) {
        this.vendorCapacityTonnes = vendorCapacityTonnes;
    }

    public String getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(String assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public String getVendorPerformanceMetrics() {
        return vendorPerformanceMetrics;
    }

    public void setVendorPerformanceMetrics(String vendorPerformanceMetrics) {
        this.vendorPerformanceMetrics = vendorPerformanceMetrics;
    }

    public CertificationStatus getVendorCertificationStatus() {
        return vendorCertificationStatus;
    }

    public void setVendorCertificationStatus(CertificationStatus vendorCertificationStatus) {
        this.vendorCertificationStatus = vendorCertificationStatus;
    }

    public String getVendorFeedback() {
        return vendorFeedback;
    }

    public void setVendorFeedback(String vendorFeedback) {
        this.vendorFeedback = vendorFeedback;
    }

    @Override
    public String toString() {
        return "Vendor{" +
                "vendorId=" + vendorId +
                ", vendorName='" + vendorName + '\'' +
                ", vendorCode='" + vendorCode + '\'' +
                ", vendorCapacityTonnes=" + vendorCapacityTonnes +
                ", assignedTasks='" + assignedTasks + '\'' +
                ", vendorCertificationStatus=" + vendorCertificationStatus +
                ", isActive=" + getIsActive() +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vendor vendor = (Vendor) o;
        return vendorId != null && vendorId.equals(vendor.vendorId);
    }

    @Override
    public int hashCode() {
        return vendorId != null ? vendorId.hashCode() : 0;
    }
}
