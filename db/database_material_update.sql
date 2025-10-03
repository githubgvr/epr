-- Database Material Update Script
-- This script removes MaterialType table and creates new Material table

-- Drop MaterialType table and related constraints
DROP TABLE IF EXISTS MaterialType;

-- Create Material table with the requested fields
CREATE TABLE Material (
    materialId INT IDENTITY(1,1) PRIMARY KEY,
    materialCode VARCHAR(50) NOT NULL UNIQUE,
    materialName VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    sortOrder INT DEFAULT 1,
    isActive BIT DEFAULT 1,
    createdDate DATETIME2 DEFAULT GETDATE(),
    updatedDate DATETIME2 DEFAULT GETDATE()
);

-- Add unique constraint on materialCode to prevent duplicates
ALTER TABLE Material 
ADD CONSTRAINT UK_Material_Code UNIQUE (materialCode);

-- Insert sample material data
INSERT INTO Material (materialCode, materialName, description, sortOrder, isActive) VALUES
('PET001', 'PET Plastic', 'Polyethylene Terephthalate plastic material', 1, 1),
('HDPE002', 'HDPE Plastic', 'High-Density Polyethylene plastic material', 2, 1),
('CARD001', 'Cardboard', 'Corrugated cardboard packaging material', 3, 1),
('GLASS001', 'Clear Glass', 'Clear glass container material', 4, 1),
('ALU001', 'Aluminum', 'Aluminum metal material', 5, 1),
('STEEL001', 'Steel', 'Steel metal material', 6, 1),
('WOOD001', 'Pine Wood', 'Pine wood material', 7, 1),
('COTTON001', 'Cotton Fabric', 'Cotton textile material', 8, 1),
('PAPER001', 'Recycled Paper', 'Recycled paper material', 9, 1),
('COMP001', 'Composite Material', 'Multi-layer composite material', 10, 1);

-- Create indexes for better performance
CREATE INDEX IX_Material_Code ON Material (materialCode);
CREATE INDEX IX_Material_Name ON Material (materialName);
CREATE INDEX IX_Material_Active ON Material (isActive);
CREATE INDEX IX_Material_SortOrder ON Material (sortOrder);

-- Verify the data
SELECT 'Material table created successfully' as info;
SELECT materialId, materialCode, materialName, description, sortOrder, isActive 
FROM Material 
ORDER BY sortOrder;
