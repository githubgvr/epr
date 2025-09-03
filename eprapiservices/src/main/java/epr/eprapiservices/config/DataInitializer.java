package epr.eprapiservices.config;

import epr.eprapiservices.Models.User;
import epr.eprapiservices.dao.repository.UserRepository;
import epr.eprapiservices.dao.repository.ProductGroupRepository;
import epr.eprapiservices.dao.repository.MaterialTypeRepository;
import epr.eprapiservices.dao.repository.MaterialRepository;
import epr.eprapiservices.dao.repository.VendorRepository;
import epr.eprapiservices.entity.ProductGroup;
import epr.eprapiservices.entity.MaterialType;
import epr.eprapiservices.entity.Material;
import epr.eprapiservices.entity.Vendor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

/**
 * Data initializer to create default data for development.
 * This will create default admin user and sample data if they don't exist in the database.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductGroupRepository productGroupRepository;
    private final MaterialTypeRepository materialTypeRepository;
    private final MaterialRepository materialRepository;
    private final VendorRepository vendorRepository;

    public DataInitializer(UserRepository userRepository,
                          ProductGroupRepository productGroupRepository,
                          MaterialTypeRepository materialTypeRepository,
                          MaterialRepository materialRepository,
                          VendorRepository vendorRepository) {
        this.userRepository = userRepository;
        this.productGroupRepository = productGroupRepository;
        this.materialTypeRepository = materialTypeRepository;
        this.materialRepository = materialRepository;
        this.vendorRepository = vendorRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Always create admin user for testing if it doesn't exist
        if (!userRepository.existsByUserName("admin")) {
            createAdminUser();
        }

        // Initialize default data
        initializeDefaultData();
    }

    private void initializeDefaultData() {
        createDefaultProductGroups();
        createDefaultMaterialTypes();
        createDefaultMaterials();
        createDefaultVendors();
    }

    private void createAdminUser() {
        // Find the next available user ID
        Integer nextUserId = userRepository.findAll().stream()
            .mapToInt(User::getUserId)
            .max()
            .orElse(0) + 1;

        // Create admin user for testing
        User adminUser = new User();
        adminUser.setUserId(nextUserId);
        adminUser.setUserName("admin");
        adminUser.setPasswordHash("password"); // In production, this should be hashed
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setEmail("admin@eprvault.com");
        adminUser.setMobile("1234567890");
        adminUser.setNationality(1);
        adminUser.setIsActive(true);

        userRepository.save(adminUser);
        System.out.println("Created admin user: admin/password");
    }

    private void createDefaultProductGroups() {
        if (productGroupRepository.count() == 0) {
            String[][] productGroups = {
                {"Electronics", "Electronic devices and components including computers, phones, and accessories"},
                {"Packaging", "All types of packaging materials including boxes, containers, and wrapping materials"},
                {"Automotive", "Automotive parts, components, and accessories for vehicles"},
                {"Textiles", "Clothing, fabrics, and textile-based products"},
                {"Furniture", "Furniture and home furnishing products"},
                {"Batteries", "Battery products and energy storage devices"},
                {"Pharmaceuticals", "Pharmaceutical and medical products"},
                {"Food & Beverages", "Food and beverage packaging and containers"},
                {"Cosmetics", "Cosmetic and personal care product packaging"},
                {"Chemicals", "Chemical products and industrial materials"}
            };

            for (String[] pgData : productGroups) {
                ProductGroup pg = new ProductGroup();
                pg.setProductGroupName(pgData[0]);
                pg.setDescription(pgData[1]);
                pg.setIsActive(true);
                productGroupRepository.save(pg);
            }
            System.out.println("Created " + productGroups.length + " default product groups");
        }
    }

    private void createDefaultMaterialTypes() {
        if (materialTypeRepository.count() == 0) {
            String[][] materialTypes = {
                {"Plastic", "All types of plastic materials including PET, HDPE, PVC, etc."},
                {"Paper", "Paper and cardboard materials"},
                {"Glass", "Glass containers and materials"},
                {"Metal", "Aluminum, steel, and other metal materials"},
                {"Wood", "Wooden materials and products"},
                {"Textile", "Fabric and textile materials"},
                {"Electronics", "Electronic waste and components"},
                {"Batteries", "All types of batteries"},
                {"Organic", "Biodegradable organic materials"},
                {"Composite", "Multi-material composite products"}
            };

            for (String[] mtData : materialTypes) {
                MaterialType mt = new MaterialType();
                mt.setMaterialTypeName(mtData[0]);
                mt.setDescription(mtData[1]);
                mt.setIsActive(true);
                materialTypeRepository.save(mt);
            }
            System.out.println("Created " + materialTypes.length + " default material types");
        }
    }

    private void createDefaultMaterials() {
        if (materialRepository.count() == 0) {
            // First get some material types to reference
            MaterialType plasticType = materialTypeRepository.findByMaterialTypeNameIgnoreCase("Plastic").orElse(null);
            MaterialType paperType = materialTypeRepository.findByMaterialTypeNameIgnoreCase("Paper").orElse(null);
            MaterialType glassType = materialTypeRepository.findByMaterialTypeNameIgnoreCase("Glass").orElse(null);
            MaterialType metalType = materialTypeRepository.findByMaterialTypeNameIgnoreCase("Metal").orElse(null);

            if (plasticType != null && paperType != null && glassType != null && metalType != null) {
                Object[][] materials = {
                    {"PET-001", "PET Plastic", "Polyethylene Terephthalate plastic for bottles", plasticType.getMaterialTypeId()},
                    {"HDPE-001", "HDPE Plastic", "High-Density Polyethylene for containers", plasticType.getMaterialTypeId()},
                    {"CARD-001", "Cardboard", "Corrugated cardboard for packaging", paperType.getMaterialTypeId()},
                    {"PAPER-001", "Office Paper", "Standard office printing paper", paperType.getMaterialTypeId()},
                    {"GLASS-001", "Clear Glass", "Clear glass for bottles and containers", glassType.getMaterialTypeId()},
                    {"ALU-001", "Aluminum", "Aluminum for cans and packaging", metalType.getMaterialTypeId()},
                    {"STEEL-001", "Steel", "Steel for containers and structural components", metalType.getMaterialTypeId()}
                };

                for (Object[] matData : materials) {
                    Material material = new Material();
                    material.setMaterialCode((String) matData[0]);
                    material.setMaterialName((String) matData[1]);
                    material.setDescription((String) matData[2]);
                    material.setMaterialTypeId((Integer) matData[3]);
                    material.setIsActive(true);
                    materialRepository.save(material);
                }
                System.out.println("Created " + materials.length + " default materials");
            }
        }
    }

    private void createDefaultVendors() {
        if (vendorRepository.count() == 0) {
            Object[][] vendors = {
                {"VEN-001", "EcoRecycle Solutions", new BigDecimal("1500.00"), "Plastic recycling, Glass processing", "VALID", "Excellent performance in Q4 2024", "High efficiency in plastic waste processing. Meets all compliance standards."},
                {"VEN-002", "GreenTech Processors", new BigDecimal("2000.00"), "Paper recycling, Cardboard processing", "VALID", "Good performance with minor delays", "Reliable paper processing facility with good turnaround times."},
                {"VEN-003", "MetalWorks Recycling", new BigDecimal("1200.00"), "Metal recycling, Aluminum processing", "VALID", "Outstanding performance", "Specialized in metal recovery with advanced sorting technology."},
                {"VEN-004", "Sustainable Materials Co", new BigDecimal("800.00"), "Composite materials, Organic waste", "EXPIRED", "Certification renewal pending", "Small-scale processor focusing on sustainable materials."},
                {"VEN-005", "Industrial Waste Management", new BigDecimal("3000.00"), "Electronics recycling, Battery processing", "VALID", "Excellent safety record", "Large-scale facility with specialized equipment for hazardous materials."}
            };

            for (Object[] vendorData : vendors) {
                Vendor vendor = new Vendor();
                vendor.setVendorCode((String) vendorData[0]);
                vendor.setVendorName((String) vendorData[1]);
                vendor.setVendorCapacityTonnes((BigDecimal) vendorData[2]);
                vendor.setAssignedTasks((String) vendorData[3]);
                vendor.setVendorCertificationStatus(Vendor.CertificationStatus.valueOf((String) vendorData[4]));
                vendor.setVendorFeedback((String) vendorData[5]);
                vendor.setVendorPerformanceMetrics((String) vendorData[6]);
                vendor.setIsActive(true);
                vendorRepository.save(vendor);
            }
            System.out.println("Created " + vendors.length + " default vendors");
        }
    }
}
