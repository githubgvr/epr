package epr.eprapiservices.controller;

import epr.eprapiservices.entity.Vendor;
import epr.eprapiservices.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Vendor management operations
 */
@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(originPatterns = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"}, allowCredentials = "true")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    /**
     * Get all active vendors
     */
    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        try {
            List<Vendor> vendors = vendorService.getAllActiveVendors();
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get vendor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Integer id) {
        try {
            Optional<Vendor> vendor = vendorService.getVendorById(id);
            return vendor.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get vendor by vendor code
     */
    @GetMapping("/code/{vendorCode}")
    public ResponseEntity<Vendor> getVendorByCode(@PathVariable String vendorCode) {
        try {
            Optional<Vendor> vendor = vendorService.getVendorByCode(vendorCode);
            return vendor.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search vendors by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Vendor>> searchVendors(@RequestParam String name) {
        try {
            List<Vendor> vendors = vendorService.searchVendorsByName(name);
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get vendors by certification status
     */
    @GetMapping("/certification/{status}")
    public ResponseEntity<List<Vendor>> getVendorsByCertificationStatus(@PathVariable Vendor.CertificationStatus status) {
        try {
            List<Vendor> vendors = vendorService.getVendorsByCertificationStatus(status);
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new vendor
     */
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@Valid @RequestBody Vendor vendor) {
        try {
            Vendor createdVendor = vendorService.createVendor(vendor);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVendor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update an existing vendor
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Integer id, @Valid @RequestBody Vendor vendorDetails) {
        try {
            Vendor updatedVendor = vendorService.updateVendor(id, vendorDetails);
            return ResponseEntity.ok(updatedVendor);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a vendor (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Integer id) {
        try {
            vendorService.deleteVendor(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if vendor code exists
     */
    @GetMapping("/exists/code/{vendorCode}")
    public ResponseEntity<Boolean> checkVendorCodeExists(@PathVariable String vendorCode) {
        try {
            boolean exists = vendorService.isVendorCodeExists(vendorCode);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if vendor name exists
     */
    @GetMapping("/exists/name/{vendorName}")
    public ResponseEntity<Boolean> checkVendorNameExists(@PathVariable String vendorName) {
        try {
            boolean exists = vendorService.isVendorNameExists(vendorName);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
