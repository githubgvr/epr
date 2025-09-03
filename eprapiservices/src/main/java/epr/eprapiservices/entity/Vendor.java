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

    @Size(max = 100, message = "Contact person name must not exceed 100 characters")
    @Column(name = "contactPerson", length = 100)
    private String contactPerson;

    @Email(message = "Contact email must be valid")
    @Size(max = 100, message = "Contact email must not exceed 100 characters")
    @Column(name = "contactEmail", length = 100)
    private String contactEmail;

    @Size(max = 20, message = "Contact phone must not exceed 20 characters")
    @Column(name = "contactPhone", length = 20)
    private String contactPhone;

    @Size(max = 200, message = "Address must not exceed 200 characters")
    @Column(name = "address", length = 200)
    private String address;

    @Size(max = 50, message = "City must not exceed 50 characters")
    @Column(name = "city", length = 50)
    private String city;

    @Size(max = 50, message = "State must not exceed 50 characters")
    @Column(name = "state", length = 50)
    private String state;

    @Size(max = 10, message = "Zip code must not exceed 10 characters")
    @Column(name = "zipCode", length = 10)
    private String zipCode;

    @Size(max = 50, message = "Country must not exceed 50 characters")
    @Column(name = "country", length = 50)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "vendorType")
    private VendorType vendorType;

    // Enums
    public enum CertificationStatus {
        VALID, EXPIRED
    }

    public enum VendorType {
        RECYCLING, COLLECTION, PROCESSING, TRANSPORTATION, DISPOSAL, CONSULTING, OTHER
    }

    // Default constructor
    public Vendor() {
        this.vendorCertificationStatus = CertificationStatus.VALID;
        this.vendorType = VendorType.RECYCLING;
        this.country = "India";
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

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public VendorType getVendorType() {
        return vendorType;
    }

    public void setVendorType(VendorType vendorType) {
        this.vendorType = vendorType;
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
