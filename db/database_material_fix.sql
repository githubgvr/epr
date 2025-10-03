-- Update Material table structure and remove MaterialType dependency
-- This script modifies the existing Material table to remove MaterialType dependency and add required fields

-- First, drop the MaterialType table if it exists
IF OBJECT_ID('MaterialType', 'U') IS NOT NULL
BEGIN
    DROP TABLE MaterialType;
    PRINT 'MaterialType table dropped successfully';
END

-- Clear existing data from Material table
DELETE FROM Material;
PRINT 'Existing Material data cleared';

-- Add missing columns to Material table if they don't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'material' AND COLUMN_NAME = 'sort_order')
BEGIN
    ALTER TABLE Material ADD sort_order INT DEFAULT 1;
    PRINT 'Added sort_order column';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'material' AND COLUMN_NAME = 'created_date')
BEGIN
    ALTER TABLE Material ADD created_date DATETIME2 DEFAULT GETDATE();
    PRINT 'Added created_date column';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'material' AND COLUMN_NAME = 'updated_date')
BEGIN
    ALTER TABLE Material ADD updated_date DATETIME2 DEFAULT GETDATE();
    PRINT 'Added updated_date column';
END

-- Drop the material_type_id column if it exists
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'material' AND COLUMN_NAME = 'material_type_id')
BEGIN
    ALTER TABLE Material DROP COLUMN material_type_id;
    PRINT 'Dropped material_type_id column';
END

-- Insert sample data using the existing column names
INSERT INTO Material (material_code, material_name, description, sort_order, is_active, created_date, updated_date) VALUES
('PET001', 'PET Plastic', 'Polyethylene Terephthalate - commonly used for bottles and containers', 1, 1, GETDATE(), GETDATE()),
('HDPE002', 'HDPE Plastic', 'High-Density Polyethylene - used for milk jugs, detergent bottles', 2, 1, GETDATE(), GETDATE()),
('PVC003', 'PVC Plastic', 'Polyvinyl Chloride - used for pipes, packaging, and medical devices', 3, 1, GETDATE(), GETDATE()),
('LDPE004', 'LDPE Plastic', 'Low-Density Polyethylene - used for plastic bags and films', 4, 1, GETDATE(), GETDATE()),
('PP005', 'PP Plastic', 'Polypropylene - used for food containers and automotive parts', 5, 1, GETDATE(), GETDATE()),
('PS006', 'PS Plastic', 'Polystyrene - used for disposable cups and packaging foam', 6, 1, GETDATE(), GETDATE()),
('CARD001', 'Cardboard', 'Corrugated cardboard material for packaging and shipping boxes', 7, 1, GETDATE(), GETDATE()),
('PAPER002', 'Paper', 'Various paper materials including newsprint, office paper, and magazines', 8, 1, GETDATE(), GETDATE()),
('GLASS001', 'Glass', 'Clear and colored glass materials from bottles and containers', 9, 1, GETDATE(), GETDATE()),
('METAL001', 'Aluminum', 'Aluminum cans, foils, and other aluminum-based materials', 10, 1, GETDATE(), GETDATE());

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Material_MaterialCode')
BEGIN
    CREATE INDEX IX_Material_MaterialCode ON Material(material_code);
    PRINT 'Created index on material_code';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Material_IsActive')
BEGIN
    CREATE INDEX IX_Material_IsActive ON Material(is_active);
    PRINT 'Created index on is_active';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Material_SortOrder')
BEGIN
    CREATE INDEX IX_Material_SortOrder ON Material(sort_order);
    PRINT 'Created index on sort_order';
END

PRINT 'Material table updated successfully with sample data';

-- Verify the data
SELECT 'Material table updated successfully' as info;
SELECT material_id, material_code, material_name, description, sort_order, is_active 
FROM Material 
ORDER BY sort_order;
