package epr.eprapiservices.entity;

import epr.eprapiservices.Models.BaseModel;
import jakarta.persistence.*;
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

    @Column(name = "vendorName")
    private String vendorName;

    @Column(name = "vendorCode")
    private String vendorCode;

    @Column(name = "vendorCapacityTonnes")
    private BigDecimal vendorCapacityTonnes;

    @Column(name = "assignedTasks")
    private String assignedTasks;

    @Column(name = "vendorPerformanceMetrics")
    private String vendorPerformanceMetrics;

    @Column(name = "vendorCertificationStatus")
    private String vendorCertificationStatus;

    @Column(name = "vendorFeedback")
    private String vendorFeedback;

    @Column(name = "contactPerson")
    private String contactPerson;

    @Column(name = "contactEmail")
    private String contactEmail;

    @Column(name = "contactPhone")
    private String contactPhone;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zipCode")
    private String zipCode;

    @Column(name = "country")
    private String country;

    @Column(name = "vendorType")
    private String vendorType;

    // Enums
    public enum CertificationStatus {
        VALID, EXPIRED
    }

    public enum VendorType {
        RECYCLING, COLLECTION, PROCESSING, TRANSPORTATION, DISPOSAL, CONSULTING, OTHER
    }

    // Default constructor
    public Vendor() {
        this.vendorCertificationStatus = "VALID";
        this.vendorType = "RECYCLING";
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

    public String getVendorCertificationStatus() {
        return vendorCertificationStatus;
    }

    public void setVendorCertificationStatus(String vendorCertificationStatus) {
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

    public String getVendorType() {
        return vendorType;
    }

    public void setVendorType(String vendorType) {
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
