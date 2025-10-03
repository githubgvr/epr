-- Product Data Import Script
-- Generated from productsdata.csv
-- This script loads Product Groups, Product Categories, and Product Types

-- Clean up existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM producttype WHERE is_active = 1;
-- DELETE FROM productcategory WHERE is_active = 1;
-- DELETE FROM productgroup WHERE is_active = 1;
-- GO

-- =====================================================
-- PRODUCT GROUPS
-- =====================================================

-- Product Group 1: Electronics
IF NOT EXISTS (SELECT 1 FROM productgroup WHERE product_group_name = 'Electronics')
INSERT INTO productgroup (product_group_name, description, sort_order, is_active) VALUES ('Electronics', 'Electronics products and related items', 1, 1);

-- Product Group 2: Packaging
IF NOT EXISTS (SELECT 1 FROM productgroup WHERE product_group_name = 'Packaging')
INSERT INTO productgroup (product_group_name, description, sort_order, is_active) VALUES ('Packaging', 'Packaging products and related items', 2, 1);

GO

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================

-- Categories for Electronics
IF NOT EXISTS (SELECT 1 FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO productcategory (product_category_name, description, sort_order, is_active, product_group_id) VALUES ('TV', 'TV in Electronics category', 1, 1, (SELECT TOP 1 product_group_id FROM productgroup WHERE product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics')
INSERT INTO productcategory (product_category_name, description, sort_order, is_active, product_group_id) VALUES ('Washing Machine', 'Washing Machine in Electronics category', 2, 1, (SELECT TOP 1 product_group_id FROM productgroup WHERE product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics')
INSERT INTO productcategory (product_category_name, description, sort_order, is_active, product_group_id) VALUES ('Refrigirator', 'Refrigirator in Electronics category', 3, 1, (SELECT TOP 1 product_group_id FROM productgroup WHERE product_group_name = 'Electronics'));


-- Categories for Packaging
IF NOT EXISTS (SELECT 1 FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO productcategory (product_category_name, description, sort_order, is_active, product_group_id) VALUES ('TV Packaging', 'TV Packaging in Packaging category', 4, 1, (SELECT TOP 1 product_group_id FROM productgroup WHERE product_group_name = 'Packaging'));


GO

-- =====================================================
-- PRODUCT TYPES
-- =====================================================

-- Types for TV (Electronics)
IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '32''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('32''', '32'' TV', 1, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '43''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('43''', '43'' TV', 2, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '50''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('50''', '50'' TV', 3, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '55''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('55''', '55'' TV', 4, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '65''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('65''', '65'' TV', 5, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '75''' AND pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('75''', '75'' TV', 6, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV' AND pg.product_group_name = 'Electronics'));


-- Types for TV Packaging (Packaging)
IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '32''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('32''', '32'' TV Packaging', 7, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '43''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('43''', '43'' TV Packaging', 8, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '50''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('50''', '50'' TV Packaging', 9, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '55''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('55''', '55'' TV Packaging', 10, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '65''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('65''', '65'' TV Packaging', 11, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '75''' AND pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('75''', '75'' TV Packaging', 12, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'TV Packaging' AND pg.product_group_name = 'Packaging'));


-- Types for Washing Machine (Electronics)
IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '5-7kg Front Load' AND pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('5-7kg Front Load', '5-7kg Front Load Washing Machine', 13, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '8-10kg Front Load' AND pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('8-10kg Front Load', '8-10kg Front Load Washing Machine', 14, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '5-7kg Top Load' AND pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('5-7kg Top Load', '5-7kg Top Load Washing Machine', 15, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = '8-10kg Top Load' AND pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('8-10kg Top Load', '8-10kg Top Load Washing Machine', 16, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Washing Machine' AND pg.product_group_name = 'Electronics'));


-- Types for Refrigirator (Electronics)
IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = 'Single Door' AND pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('Single Door', 'Single Door Refrigirator', 17, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = 'Double Door' AND pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('Double Door', 'Double Door Refrigirator', 18, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = 'Side-by-Side' AND pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('Side-by-Side', 'Side-by-Side Refrigirator', 19, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics'));

IF NOT EXISTS (SELECT 1 FROM producttype pt JOIN productcategory pc ON pt.product_category_id = pc.product_category_id JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pt.product_type_name = 'French Door' AND pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics')
INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) VALUES ('French Door', 'French Door Refrigirator', 20, 1, (SELECT TOP 1 pc.product_category_id FROM productcategory pc JOIN productgroup pg ON pc.product_group_id = pg.product_group_id WHERE pc.product_category_name = 'Refrigirator' AND pg.product_group_name = 'Electronics'));


GO

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total Product Groups: 2
-- Total Product Categories: 4
-- Total Product Types: 20
-- =====================================================

-- Verify the data
SELECT 'Product Groups' AS TableName, COUNT(*) AS RecordCount FROM productgroup WHERE is_active = 1
UNION ALL
SELECT 'Product Categories', COUNT(*) FROM productcategory WHERE is_active = 1
UNION ALL
SELECT 'Product Types', COUNT(*) FROM producttype WHERE is_active = 1;

GO