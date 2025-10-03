-- Database Schema Update Script
-- This script updates the product hierarchy structure and clears existing data

-- First, clear all data from related tables (in correct order due to foreign keys)
DELETE FROM producttype;
DELETE FROM productcategory;
DELETE FROM productgroup;

-- Update ProductGroup table structure
-- Add sortOrder column if it doesn't exist
ALTER TABLE productgroup ADD COLUMN IF NOT EXISTS sortOrder INT;

-- Remove groupCode column if it exists (for ProductCategory)
ALTER TABLE productcategory DROP COLUMN IF EXISTS categoryCode;

-- Add sortOrder column to ProductCategory if it doesn't exist
ALTER TABLE productcategory ADD COLUMN IF NOT EXISTS sortOrder INT;

-- Add productGroupId foreign key to ProductCategory if it doesn't exist
ALTER TABLE productcategory ADD COLUMN IF NOT EXISTS productGroupId INT;
ALTER TABLE productcategory ADD CONSTRAINT IF NOT EXISTS fk_productcategory_productgroup 
    FOREIGN KEY (productGroupId) REFERENCES productgroup(productGroupId);

-- Add sortOrder column to ProductType if it doesn't exist
ALTER TABLE producttype ADD COLUMN IF NOT EXISTS sortOrder INT;

-- Add productCategoryId foreign key to ProductType if it doesn't exist
ALTER TABLE producttype ADD COLUMN IF NOT EXISTS productCategoryId INT;
ALTER TABLE producttype ADD CONSTRAINT IF NOT EXISTS fk_producttype_productcategory 
    FOREIGN KEY (productCategoryId) REFERENCES productcategory(productCategoryId);

-- Verify the structure
SELECT 'ProductGroup columns:' as info;
DESCRIBE productgroup;

SELECT 'ProductCategory columns:' as info;
DESCRIBE productcategory;

SELECT 'ProductType columns:' as info;
DESCRIBE producttype;

-- Insert comprehensive test data based on productdata.xlsx structure

-- Product Groups (Top Level)
INSERT INTO productgroup (productGroupName, description, sortOrder, isActive) VALUES
('Electronics', 'Electronic devices and components including computers, phones, and accessories', 1, 1),
('Packaging', 'All types of packaging materials including boxes, containers, and wrapping materials', 2, 1);


-- Product Categories (Second Level - under Product Groups)
INSERT INTO productcategory (productCategoryName, description, sortOrder, productGroupId, isActive) VALUES
-- Electronics Categories
('Refrigirator', 'Smartphones, tablets, and mobile accessories', 1, 1, 1),
('TV', 'Televisions and related devices', 2, 1, 1),
('TV Packaging', 'Telecvision packaging materials', 3, 2, 1),
('Washing Machine', 'Washing machines and related devices', 4, 1, 1);


-- Product Types (Third Level - under Product Categories)
INSERT INTO producttype (productTypeName, productTypeDescription, sortOrder, productCategoryId, isActive) VALUES
-- Refrigirator Devices Types (Category ID: 1)
('Single Door', 'Refrigirator and related devices', 1, 1, 1),
--  tv Devices Types (Category ID: 2)
('32" TV', 'Televisions and related devices', 1, 2, 1),
--tv packaging Devices Types (Category ID: 3)
('32" TV', 'Telecvision packaging materials', 1, 3, 1),
--washing machine Devices Types (Category ID: 4)
('5-7kg Front Load', 'Washing machines and related devices', 1, 4, 1);


-- Verify the data
SELECT 'Sample data verification:' as info;
SELECT pg.productGroupName, pc.productCategoryName, pt.productTypeName
FROM productgroup pg
LEFT JOIN productcategory pc ON pg.productGroupId = pc.productGroupId
LEFT JOIN producttype pt ON pc.productCategoryId = pt.productCategoryId
ORDER BY pg.sortOrder, pc.sortOrder, pt.sortOrder;
