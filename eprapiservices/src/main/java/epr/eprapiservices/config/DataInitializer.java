package epr.eprapiservices.config;

import epr.eprapiservices.Models.User;
import epr.eprapiservices.dao.repository.UserRepository;
import epr.eprapiservices.dao.repository.ProductGroupRepository;
import epr.eprapiservices.dao.repository.ProductCategoryRepository;
import epr.eprapiservices.dao.repository.ProductRepository;
import epr.eprapiservices.dao.repository.ProductTypeRepository;
import epr.eprapiservices.dao.repository.MaterialTypeRepository;
import epr.eprapiservices.dao.repository.MaterialRepository;
import epr.eprapiservices.dao.repository.VendorRepository;
import epr.eprapiservices.dao.repository.RecycleLogRepository;
import epr.eprapiservices.dao.repository.RecyclingCertificationRepository;
import epr.eprapiservices.dao.repository.TracingTargetRepository;
import epr.eprapiservices.entity.ProductGroup;
import epr.eprapiservices.entity.ProductCategory;
import epr.eprapiservices.entity.Product;
import epr.eprapiservices.entity.ProductType;
import epr.eprapiservices.entity.MaterialType;
import epr.eprapiservices.entity.Material;
import epr.eprapiservices.entity.Vendor;
import epr.eprapiservices.entity.RecycleLog;
import epr.eprapiservices.entity.RecyclingCertification;
import epr.eprapiservices.entity.TracingTarget;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data initializer to create default data for development.
 * This will create default admin user and sample data if they don't exist in the database.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductGroupRepository productGroupRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;
    private final ProductTypeRepository productTypeRepository;
    private final MaterialTypeRepository materialTypeRepository;
    private final MaterialRepository materialRepository;
    private final VendorRepository vendorRepository;
    private final RecycleLogRepository recycleLogRepository;
    private final RecyclingCertificationRepository recyclingCertificationRepository;
    private final TracingTargetRepository tracingTargetRepository;

    public DataInitializer(UserRepository userRepository,
                          ProductGroupRepository productGroupRepository,
                          ProductCategoryRepository productCategoryRepository,
                          ProductRepository productRepository,
                          ProductTypeRepository productTypeRepository,
                          MaterialTypeRepository materialTypeRepository,
                          MaterialRepository materialRepository,
                          VendorRepository vendorRepository,
                          RecycleLogRepository recycleLogRepository,
                          RecyclingCertificationRepository recyclingCertificationRepository,
                          TracingTargetRepository tracingTargetRepository) {
        this.userRepository = userRepository;
        this.productGroupRepository = productGroupRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.productRepository = productRepository;
        this.productTypeRepository = productTypeRepository;
        this.materialTypeRepository = materialTypeRepository;
        this.materialRepository = materialRepository;
        this.vendorRepository = vendorRepository;
        this.recycleLogRepository = recycleLogRepository;
        this.recyclingCertificationRepository = recyclingCertificationRepository;
        this.tracingTargetRepository = tracingTargetRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Always create admin user for testing if it doesn't exist
        if (!userRepository.existsByUserName("admin")) {
            createAdminUser();
        }

        // Initialize default data
        initializeDefaultData();
        initializeProductCategories();
        initializeProductTypes();
        initializeProducts();
        initializeEnhancedVendors();
        initializeRecycleLogs();
        initializeRecyclingCertifications();
        initializeTracingTargets();
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

    private void initializeProductCategories() {
        if (productCategoryRepository.count() == 0) {
            ProductCategory[] categories = {
                new ProductCategory("Mobile Phones", "Smartphones and mobile devices", "MOB"),
                new ProductCategory("Computers", "Desktop and laptop computers", "COMP"),
                new ProductCategory("Plastic Packaging", "Plastic containers and wrapping", "PLAST"),
                new ProductCategory("Paper Packaging", "Cardboard and paper packaging", "PAPER"),
                new ProductCategory("Clothing", "Garments and apparel", "CLOTH"),
                new ProductCategory("Footwear", "Shoes and sandals", "FOOT"),
                new ProductCategory("Car Parts", "Automotive components", "CPART"),
                new ProductCategory("Batteries", "All types of batteries", "BATT")
            };

            for (int i = 0; i < categories.length; i++) {
                ProductCategory category = categories[i];
                category.setSortOrder(i + 1);
                category.setIsActive(true);
                productCategoryRepository.save(category);
            }

            System.out.println("Initialized " + categories.length + " product categories");
        }
    }

    private void initializeEnhancedVendors() {
        // Update existing vendors with enhanced fields
        vendorRepository.findAll().forEach(vendor -> {
            if (vendor.getContactPerson() == null) {
                vendor.setContactPerson("Contact Person " + vendor.getVendorId());
                vendor.setContactEmail("contact" + vendor.getVendorId() + "@" + vendor.getVendorName().toLowerCase().replace(" ", "") + ".com");
                vendor.setContactPhone("+91-98765432" + String.format("%02d", vendor.getVendorId() % 100));
                vendor.setAddress("Address " + vendor.getVendorId());
                vendor.setCity("City " + vendor.getVendorId());
                vendor.setState("State " + vendor.getVendorId());
                vendor.setZipCode("40000" + vendor.getVendorId());
                vendor.setCountry("India");
                if (vendor.getVendorType() == null) {
                    vendor.setVendorType(Vendor.VendorType.RECYCLING);
                }
                vendorRepository.save(vendor);
            }
        });
    }

    private void initializeRecycleLogs() {
        if (recycleLogRepository.count() == 0) {
            RecycleLog[] logs = {
                createRecycleLog("Plastic Bottles", new BigDecimal("150.50"), "kg", "EcoRecycle Solutions", "VEN-001",
                    "Mumbai Facility", RecycleLog.ProcessingMethod.MECHANICAL_RECYCLING, RecycleLog.QualityGrade.GRADE_A,
                    "BATCH001", new BigDecimal("85.5"), "High quality PET bottles processed successfully"),

                createRecycleLog("Electronic Components", new BigDecimal("75.25"), "kg", "Industrial Waste Management", "VEN-005",
                    "Delhi Processing Unit", RecycleLog.ProcessingMethod.MECHANICAL_RECYCLING, RecycleLog.QualityGrade.GRADE_B,
                    "BATCH002", new BigDecimal("78.2"), "Mixed electronic components with good recovery rate"),

                createRecycleLog("Aluminum Cans", new BigDecimal("200.00"), "kg", "MetalWorks Recycling", "VEN-003",
                    "Chennai Collection Center", RecycleLog.ProcessingMethod.MECHANICAL_RECYCLING, RecycleLog.QualityGrade.GRADE_A,
                    "BATCH003", new BigDecimal("92.3"), "Excellent quality aluminum with high purity")
            };

            for (RecycleLog log : logs) {
                log.setIsActive(true);
                recycleLogRepository.save(log);
            }

            System.out.println("Initialized " + logs.length + " recycle logs");
        }
    }

    private RecycleLog createRecycleLog(String materialType, BigDecimal quantity, String unit,
                                       String recyclerName, String recyclerId, String location,
                                       RecycleLog.ProcessingMethod method, RecycleLog.QualityGrade grade,
                                       String batchNumber, BigDecimal recoveryRate, String notes) {
        RecycleLog log = new RecycleLog();
        log.setMaterialType(materialType);
        log.setQuantityRecycled(quantity);
        log.setUnit(unit);
        log.setRecycleDate(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
        log.setRecyclerName(recyclerName);
        log.setRecyclerId(recyclerId);
        log.setLocation(location);
        log.setProcessingMethod(method);
        log.setQualityGrade(grade);
        log.setBatchNumber(batchNumber);
        log.setRecoveryRate(recoveryRate);
        log.setNotes(notes);
        return log;
    }

    private void initializeRecyclingCertifications() {
        if (recyclingCertificationRepository.count() == 0) {
            RecyclingCertification[] certifications = {
                createCertification("ISO 14001:2015", "ISO14001-001", RecyclingCertification.CertificationType.ISO_14001,
                    "Bureau Veritas India", LocalDate.now().minusMonths(6), LocalDate.now().plusMonths(18),
                    "Electronic Waste", "EcoRecycle Solutions", "VEN-001", "Environmental Management System certification"),

                createCertification("Plastic Recycling License", "PRL-002", RecyclingCertification.CertificationType.RECYCLING_FACILITY,
                    "State Pollution Control Board", LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(21),
                    "Plastic Materials", "GreenTech Processors", "VEN-002", "Licensed facility for plastic waste processing"),

                createCertification("Metal Recovery Certification", "MRC-003", RecyclingCertification.CertificationType.MATERIAL_RECOVERY,
                    "Central Pollution Control Board", LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(20),
                    "Metal Components", "MetalWorks Recycling", "VEN-003", "Certified for metal recovery operations")
            };

            for (RecyclingCertification cert : certifications) {
                cert.setIsActive(true);
                recyclingCertificationRepository.save(cert);
            }

            System.out.println("Initialized " + certifications.length + " recycling certifications");
        }
    }

    private RecyclingCertification createCertification(String name, String number, RecyclingCertification.CertificationType type,
                                                      String authority, LocalDate issueDate, LocalDate expiryDate,
                                                      String materialType, String recyclerName, String recyclerId, String description) {
        RecyclingCertification cert = new RecyclingCertification();
        cert.setCertificationName(name);
        cert.setCertificationNumber(number);
        cert.setCertificationType(type);
        cert.setIssuingAuthority(authority);
        cert.setIssueDate(issueDate);
        cert.setExpiryDate(expiryDate);
        cert.setMaterialType(materialType);
        cert.setRecyclerName(recyclerName);
        cert.setRecyclerId(recyclerId);
        cert.setCertificationStatus(RecyclingCertification.CertificationStatus.VALID);
        cert.setDescription(description);
        return cert;
    }

    private void initializeTracingTargets() {
        if (tracingTargetRepository.count() == 0) {
            TracingTarget[] targets = {
                createTarget("Plastic Recycling Q1", "Plastic Bottles", new BigDecimal("1000"), new BigDecimal("650"),
                    "kg", LocalDate.now().plusMonths(1), TracingTarget.TargetType.RECYCLING_TARGET, TracingTarget.PriorityLevel.HIGH,
                    "EcoRecycle Solutions", "Mumbai", "Achieve 1000kg plastic recycling by Q1 end"),

                createTarget("E-Waste Collection", "Electronic Components", new BigDecimal("500"), new BigDecimal("320"),
                    "kg", LocalDate.now().plusWeeks(3), TracingTarget.TargetType.COLLECTION_TARGET, TracingTarget.PriorityLevel.CRITICAL,
                    "Industrial Waste Management", "Delhi", "Collect 500kg of electronic waste"),

                createTarget("Metal Recovery", "Aluminum Cans", new BigDecimal("800"), new BigDecimal("720"),
                    "kg", LocalDate.now().plusMonths(2), TracingTarget.TargetType.RECOVERY_TARGET, TracingTarget.PriorityLevel.MEDIUM,
                    "MetalWorks Recycling", "Chennai", "Recover aluminum from mixed waste")
            };

            for (TracingTarget target : targets) {
                target.setIsActive(true);
                target.updateProgress();
                tracingTargetRepository.save(target);
            }

            System.out.println("Initialized " + targets.length + " tracing targets");
        }
    }

    private TracingTarget createTarget(String name, String materialType, BigDecimal targetQty, BigDecimal achievedQty,
                                      String unit, LocalDate targetDate, TracingTarget.TargetType type,
                                      TracingTarget.PriorityLevel priority, String responsibleParty, String location, String description) {
        TracingTarget target = new TracingTarget();
        target.setTargetName(name);
        target.setMaterialType(materialType);
        target.setTargetQuantity(targetQty);
        target.setAchievedQuantity(achievedQty);
        target.setUnit(unit);
        target.setTargetDate(targetDate);
        target.setStartDate(LocalDate.now().minusWeeks(2));
        target.setTargetType(type);
        target.setPriorityLevel(priority);
        target.setResponsibleParty(responsibleParty);
        target.setLocation(location);
        target.setDescription(description);
        return target;
    }

    private void initializeProducts() {
        if (productRepository.count() > 0) {
            return; // Products already exist
        }

        // Get product groups and categories
        ProductGroup electronics = productGroupRepository.findByProductGroupName("Electronics").orElse(null);
        ProductGroup packaging = productGroupRepository.findByProductGroupName("Packaging").orElse(null);
        ProductGroup automotive = productGroupRepository.findByProductGroupName("Automotive").orElse(null);
        ProductGroup textiles = productGroupRepository.findByProductGroupName("Textiles").orElse(null);
        ProductGroup batteries = productGroupRepository.findByProductGroupName("Batteries").orElse(null);

        ProductCategory mobilePhones = productCategoryRepository.findByProductCategoryName("Mobile Phones").orElse(null);
        ProductCategory computers = productCategoryRepository.findByProductCategoryName("Computers").orElse(null);
        ProductCategory plasticPackaging = productCategoryRepository.findByProductCategoryName("Plastic Packaging").orElse(null);
        ProductCategory paperPackaging = productCategoryRepository.findByProductCategoryName("Paper Packaging").orElse(null);
        ProductCategory clothing = productCategoryRepository.findByProductCategoryName("Clothing").orElse(null);
        ProductCategory carParts = productCategoryRepository.findByProductCategoryName("Car Parts").orElse(null);
        ProductCategory batteriesCategory = productCategoryRepository.findByProductCategoryName("Batteries").orElse(null);

        // Create sample products
        createProduct("iPhone 15 Pro", "IPHONE15PRO", electronics, mobilePhones,
                     "Latest iPhone model with titanium design", 0.187, 3, 85.0,
                     "2024-09-01", "2027-09-01");

        createProduct("Samsung Galaxy S24", "GALAXY-S24", electronics, mobilePhones,
                     "Premium Android smartphone with AI features", 0.196, 3, 82.0,
                     "2024-01-15", "2027-01-15");

        createProduct("MacBook Pro 16\"", "MBP16-2024", electronics, computers,
                     "Professional laptop with M3 Pro chip", 2.14, 5, 90.0,
                     "2024-03-01", "2029-03-01");

        createProduct("Dell XPS 13", "XPS13-2024", electronics, computers,
                     "Ultrabook with Intel Core i7 processor", 1.19, 4, 88.0,
                     "2024-02-01", "2028-02-01");

        createProduct("Plastic Water Bottle", "PWB-500ML", packaging, plasticPackaging,
                     "500ml recyclable plastic water bottle", 0.025, 1, 75.0,
                     "2024-01-01", "2025-01-01");

        createProduct("Cardboard Box Medium", "CBM-001", packaging, paperPackaging,
                     "Medium-sized cardboard shipping box", 0.15, 1, 95.0,
                     "2024-01-01", "2025-01-01");

        createProduct("Cotton T-Shirt", "COTTON-TEE-M", textiles, clothing,
                     "100% organic cotton t-shirt, medium size", 0.18, 2, 70.0,
                     "2024-01-01", "2026-01-01");

        createProduct("Car Brake Pads", "BRAKE-PAD-001", automotive, carParts,
                     "High-performance ceramic brake pads", 2.5, 3, 80.0,
                     "2024-01-01", "2027-01-01");

        createProduct("Lithium-Ion Battery", "LIION-18650", batteries, batteriesCategory,
                     "Rechargeable lithium-ion battery 18650 format", 0.045, 5, 85.0,
                     "2024-01-01", "2029-01-01");

        createProduct("LED Light Bulb", "LED-A60-9W", electronics, computers,
                     "Energy-efficient LED bulb, 9W, warm white", 0.08, 10, 92.0,
                     "2024-01-01", "2034-01-01");
    }

    private void createProduct(String name, String skuCode, ProductGroup productGroup,
                              ProductCategory productCategory, String description,
                              double weight, int lifecycleDuration, double complianceTarget,
                              String manufacturingDate, String expiryDate) {
        if (productGroup == null) {
            System.err.println("Warning: ProductGroup is null for product: " + name);
            return; // Skip creating product if productGroup is null
        }

        Product product = new Product();
        product.setProductName(name);
        product.setSkuProductCode(skuCode);
        product.setProductGroup(productGroup);
        product.setProductGroupId(productGroup.getProductGroupId()); // Explicitly set the ID
        product.setProductCategory(productCategory);
        if (productCategory != null) {
            product.setProductCategoryId(productCategory.getProductCategoryId());
        }
        product.setProductDescription(description);
        product.setProductWeight(BigDecimal.valueOf(weight));
        product.setProductLifecycleDuration(lifecycleDuration);
        product.setComplianceTargetPercentage(BigDecimal.valueOf(complianceTarget));
        product.setProductManufacturingDate(LocalDate.parse(manufacturingDate));
        product.setProductExpiryDate(LocalDate.parse(expiryDate));
        product.setRegistrationDate(LocalDate.now());
        product.setIsActive(true);

        productRepository.save(product);
    }

    private void initializeProductTypes() {
        if (productTypeRepository.count() > 0) {
            return; // Product types already exist
        }

        // Create sample product types
        createProductType("Consumer Electronics", "Electronic devices for personal use including smartphones, laptops, tablets");
        createProductType("Home Appliances", "Household appliances like refrigerators, washing machines, microwaves");
        createProductType("Packaging Materials", "Various packaging materials including plastic, paper, cardboard containers");
        createProductType("Automotive Components", "Car parts and automotive accessories");
        createProductType("Textiles & Clothing", "Clothing items, fabrics, and textile products");
        createProductType("Furniture & Fixtures", "Home and office furniture, fixtures, and fittings");
        createProductType("Batteries & Power", "All types of batteries and power storage devices");
        createProductType("Medical Devices", "Healthcare and medical equipment and devices");
        createProductType("Industrial Equipment", "Industrial machinery and equipment");
        createProductType("Toys & Games", "Children's toys, games, and recreational products");
    }

    private void createProductType(String name, String description) {
        ProductType productType = new ProductType();
        productType.setProductTypeName(name);
        productType.setProductTypeDescription(description);
        productType.setIsActive(true);

        productTypeRepository.save(productType);
    }
}
