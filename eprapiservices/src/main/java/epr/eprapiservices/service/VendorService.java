package epr.eprapiservices.service;

import epr.eprapiservices.dao.repository.VendorRepository;
import epr.eprapiservices.entity.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Vendor entity operations
 */
@Service
@Transactional
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    /**
     * Get all active vendors
     */
    public List<Vendor> getAllActiveVendors() {
        return vendorRepository.findAllActive();
    }

    /**
     * Get vendor by ID
     */
    public Optional<Vendor> getVendorById(Integer vendorId) {
        return vendorRepository.findById(vendorId);
    }

    /**
     * Get vendor by vendor code
     */
    public Optional<Vendor> getVendorByCode(String vendorCode) {
        return vendorRepository.findByVendorCode(vendorCode);
    }

    /**
     * Search vendors by name
     */
    public List<Vendor> searchVendorsByName(String name) {
        return vendorRepository.findByVendorNameContainingIgnoreCase(name);
    }

    /**
     * Get vendors by certification status
     */
    public List<Vendor> getVendorsByCertificationStatus(Vendor.CertificationStatus status) {
        return vendorRepository.findByVendorCertificationStatus(status);
    }

    /**
     * Create a new vendor
     */
    public Vendor createVendor(Vendor vendor) {
        // Validate vendor code uniqueness
        if (vendorRepository.existsByVendorCodeIgnoreCase(vendor.getVendorCode())) {
            throw new RuntimeException("Vendor code already exists: " + vendor.getVendorCode());
        }

        // Validate vendor name uniqueness
        if (vendorRepository.existsByVendorNameIgnoreCase(vendor.getVendorName())) {
            throw new RuntimeException("Vendor name already exists: " + vendor.getVendorName());
        }

        return vendorRepository.save(vendor);
    }

    /**
     * Update an existing vendor
     */
    public Vendor updateVendor(Integer vendorId, Vendor vendorDetails) {
        Optional<Vendor> existingVendorOpt = vendorRepository.findById(vendorId);
        if (existingVendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found with ID: " + vendorId);
        }

        Vendor existingVendor = existingVendorOpt.get();

        // Validate vendor code uniqueness (excluding current vendor)
        if (vendorRepository.existsByVendorCodeIgnoreCaseAndVendorIdNot(vendorDetails.getVendorCode(), vendorId)) {
            throw new RuntimeException("Vendor code already exists: " + vendorDetails.getVendorCode());
        }

        // Validate vendor name uniqueness (excluding current vendor)
        if (vendorRepository.existsByVendorNameIgnoreCaseAndVendorIdNot(vendorDetails.getVendorName(), vendorId)) {
            throw new RuntimeException("Vendor name already exists: " + vendorDetails.getVendorName());
        }

        // Update fields
        existingVendor.setVendorName(vendorDetails.getVendorName());
        existingVendor.setVendorCode(vendorDetails.getVendorCode());
        existingVendor.setVendorCapacityTonnes(vendorDetails.getVendorCapacityTonnes());
        existingVendor.setAssignedTasks(vendorDetails.getAssignedTasks());
        existingVendor.setVendorPerformanceMetrics(vendorDetails.getVendorPerformanceMetrics());
        existingVendor.setVendorCertificationStatus(vendorDetails.getVendorCertificationStatus());
        existingVendor.setVendorFeedback(vendorDetails.getVendorFeedback());
        existingVendor.setIsActive(vendorDetails.getIsActive());

        return vendorRepository.save(existingVendor);
    }

    /**
     * Delete a vendor (soft delete by setting isActive to false)
     */
    public void deleteVendor(Integer vendorId) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(vendorId);
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found with ID: " + vendorId);
        }

        Vendor vendor = vendorOpt.get();
        vendor.setIsActive(false);
        vendorRepository.save(vendor);
    }

    /**
     * Permanently delete a vendor
     */
    public void permanentlyDeleteVendor(Integer vendorId) {
        if (!vendorRepository.existsById(vendorId)) {
            throw new RuntimeException("Vendor not found with ID: " + vendorId);
        }
        vendorRepository.deleteById(vendorId);
    }

    /**
     * Check if vendor code exists
     */
    public boolean isVendorCodeExists(String vendorCode) {
        return vendorRepository.existsByVendorCodeIgnoreCase(vendorCode);
    }

    /**
     * Check if vendor name exists
     */
    public boolean isVendorNameExists(String vendorName) {
        return vendorRepository.existsByVendorNameIgnoreCase(vendorName);
    }
}
