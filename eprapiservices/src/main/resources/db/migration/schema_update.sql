-- Schema update script to remove audit columns and fix column naming
-- This script should be run manually or through a migration tool

-- Drop audit columns from all tables
ALTER TABLE material DROP COLUMN IF EXISTS Created_By;
ALTER TABLE material DROP COLUMN IF EXISTS Created_Date;
ALTER TABLE material DROP COLUMN IF EXISTS Updated_By;
ALTER TABLE material DROP COLUMN IF EXISTS Updated_Date;

ALTER TABLE ProductCategory DROP COLUMN IF EXISTS Created_By;
ALTER TABLE ProductCategory DROP COLUMN IF EXISTS Created_Date;
ALTER TABLE ProductCategory DROP COLUMN IF EXISTS Updated_By;
ALTER TABLE ProductCategory DROP COLUMN IF EXISTS Updated_Date;

ALTER TABLE product_composition DROP COLUMN IF EXISTS Created_By;
ALTER TABLE product_composition DROP COLUMN IF EXISTS Created_Date;
ALTER TABLE product_composition DROP COLUMN IF EXISTS Updated_By;
ALTER TABLE product_composition DROP COLUMN IF EXISTS Updated_Date;

ALTER TABLE product_certifications DROP COLUMN IF EXISTS Created_By;
ALTER TABLE product_certifications DROP COLUMN IF EXISTS Created_Date;
ALTER TABLE product_certifications DROP COLUMN IF EXISTS Updated_By;
ALTER TABLE product_certifications DROP COLUMN IF EXISTS Updated_Date;

ALTER TABLE products DROP COLUMN IF EXISTS Created_By;
ALTER TABLE products DROP COLUMN IF EXISTS Created_Date;
ALTER TABLE products DROP COLUMN IF EXISTS Updated_By;
ALTER TABLE products DROP COLUMN IF EXISTS Updated_Date;

-- Rename ProductCategory table to productgroup
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ProductCategory]') AND type in (N'U'))
BEGIN
    EXEC sp_rename 'ProductCategory', 'productgroup';
END

-- Rename product_composition table to productcomposition
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[product_composition]') AND type in (N'U'))
BEGIN
    EXEC sp_rename 'product_composition', 'productcomposition';
END

-- Rename product_certifications table to productcertifications
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[product_certifications]') AND type in (N'U'))
BEGIN
    EXEC sp_rename 'product_certifications', 'productcertifications';
END

-- Rename columns in productgroup table (formerly ProductCategory)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productgroup]') AND name = 'ProductCategoryId')
BEGIN
    EXEC sp_rename 'productgroup.ProductCategoryId', 'productGroupId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productgroup]') AND name = 'ProductCategoryName')
BEGIN
    EXEC sp_rename 'productgroup.ProductCategoryName', 'productGroupName', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productgroup]') AND name = 'Description')
BEGIN
    EXEC sp_rename 'productgroup.Description', 'description', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productgroup]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'productgroup.Is_Active', 'isActive', 'COLUMN';
END

-- Rename columns in material table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[material]') AND name = 'material_id')
BEGIN
    EXEC sp_rename 'material.material_id', 'materialId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[material]') AND name = 'material_name')
BEGIN
    EXEC sp_rename 'material.material_name', 'materialName', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[material]') AND name = 'material_code')
BEGIN
    EXEC sp_rename 'material.material_code', 'materialCode', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[material]') AND name = 'material_type_id')
BEGIN
    EXEC sp_rename 'material.material_type_id', 'materialTypeId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[material]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'material.Is_Active', 'isActive', 'COLUMN';
END

-- Rename columns in products table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_id')
BEGIN
    EXEC sp_rename 'products.product_id', 'productId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_name')
BEGIN
    EXEC sp_rename 'products.product_name', 'productName', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'sku_product_code')
BEGIN
    EXEC sp_rename 'products.sku_product_code', 'skuProductCode', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_category_id')
BEGIN
    EXEC sp_rename 'products.product_category_id', 'productGroupId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_description')
BEGIN
    EXEC sp_rename 'products.product_description', 'productDescription', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_weight')
BEGIN
    EXEC sp_rename 'products.product_weight', 'productWeight', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'product_lifecycle_duration')
BEGIN
    EXEC sp_rename 'products.product_lifecycle_duration', 'productLifecycleDuration', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'compliance_target_percentage')
BEGIN
    EXEC sp_rename 'products.compliance_target_percentage', 'complianceTargetPercentage', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'regulatory_certifications_path')
BEGIN
    EXEC sp_rename 'products.regulatory_certifications_path', 'regulatoryCertificationsPath', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'registration_date')
BEGIN
    EXEC sp_rename 'products.registration_date', 'registrationDate', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[products]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'products.Is_Active', 'isActive', 'COLUMN';
END

-- Create vendor table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[vendor]') AND type in (N'U'))
BEGIN
    CREATE TABLE vendor (
        vendorId INT IDENTITY(1,1) PRIMARY KEY,
        vendorName NVARCHAR(100) NOT NULL,
        vendorCode NVARCHAR(50) NOT NULL UNIQUE,
        vendorCapacityTonnes DECIMAL(12,2) NOT NULL,
        assignedTasks NVARCHAR(250) NOT NULL,
        vendorPerformanceMetrics NTEXT,
        vendorCertificationStatus NVARCHAR(20) NOT NULL DEFAULT 'VALID',
        vendorFeedback NVARCHAR(250),
        isActive BIT DEFAULT 1
    );
END

-- Rename columns in productcomposition table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_composition_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_composition_id', 'productCompositionId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_id', 'productId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'material_id')
BEGIN
    EXEC sp_rename 'productcomposition.material_id', 'materialId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_category_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_category_id', 'productGroupId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'composition_percentage')
BEGIN
    EXEC sp_rename 'productcomposition.composition_percentage', 'compositionPercentage', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'productcomposition.Is_Active', 'isActive', 'COLUMN';
END

-- Rename columns in productcertifications table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'certification_id')
BEGIN
    EXEC sp_rename 'productcertifications.certification_id', 'certificationId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'product_id')
BEGIN
    EXEC sp_rename 'productcertifications.product_id', 'productId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'certification_name')
BEGIN
    EXEC sp_rename 'productcertifications.certification_name', 'certificationName', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'certification_type')
BEGIN
    EXEC sp_rename 'productcertifications.certification_type', 'certificationType', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'issuing_authority')
BEGIN
    EXEC sp_rename 'productcertifications.issuing_authority', 'issuingAuthority', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'certificate_number')
BEGIN
    EXEC sp_rename 'productcertifications.certificate_number', 'certificateNumber', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'issue_date')
BEGIN
    EXEC sp_rename 'productcertifications.issue_date', 'issueDate', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'expiry_date')
BEGIN
    EXEC sp_rename 'productcertifications.expiry_date', 'expiryDate', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'file_path')
BEGIN
    EXEC sp_rename 'productcertifications.file_path', 'filePath', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'file_name')
BEGIN
    EXEC sp_rename 'productcertifications.file_name', 'fileName', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'file_type')
BEGIN
    EXEC sp_rename 'productcertifications.file_type', 'fileType', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'file_size')
BEGIN
    EXEC sp_rename 'productcertifications.file_size', 'fileSize', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'compliance_percentage')
BEGIN
    EXEC sp_rename 'productcertifications.compliance_percentage', 'compliancePercentage', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'verification_status')
BEGIN
    EXEC sp_rename 'productcertifications.verification_status', 'verificationStatus', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'verification_date')
BEGIN
    EXEC sp_rename 'productcertifications.verification_date', 'verificationDate', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'verified_by')
BEGIN
    EXEC sp_rename 'productcertifications.verified_by', 'verifiedBy', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcertifications]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'productcertifications.Is_Active', 'isActive', 'COLUMN';
END

-- Rename columns in productcomposition table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_composition_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_composition_id', 'productCompositionId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_id', 'productId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'material_id')
BEGIN
    EXEC sp_rename 'productcomposition.material_id', 'materialId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'product_category_id')
BEGIN
    EXEC sp_rename 'productcomposition.product_category_id', 'productGroupId', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'composition_percentage')
BEGIN
    EXEC sp_rename 'productcomposition.composition_percentage', 'compositionPercentage', 'COLUMN';
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[productcomposition]') AND name = 'Is_Active')
BEGIN
    EXEC sp_rename 'productcomposition.Is_Active', 'isActive', 'COLUMN';
END

-- Update foreign key constraints to reference new table and column names
-- Drop existing foreign key constraints
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_products_productcategory')
BEGIN
    ALTER TABLE products DROP CONSTRAINT FK_products_productcategory;
END

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_productcomposition_productcategory')
BEGIN
    ALTER TABLE productcomposition DROP CONSTRAINT FK_productcomposition_productcategory;
END

-- Add new foreign key constraints
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_products_productgroup')
BEGIN
    ALTER TABLE products ADD CONSTRAINT FK_products_productgroup
    FOREIGN KEY (productGroupId) REFERENCES productgroup(productGroupId);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_productcomposition_productgroup')
BEGIN
    ALTER TABLE productcomposition ADD CONSTRAINT FK_productcomposition_productgroup
    FOREIGN KEY (productGroupId) REFERENCES productgroup(productGroupId);
END

-- Update any existing data references (if needed)
PRINT 'Schema migration completed successfully';
