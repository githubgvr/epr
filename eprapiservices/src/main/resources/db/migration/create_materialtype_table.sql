-- Create MaterialType table for EPR database
-- This table stores different types of materials for EPR compliance tracking

CREATE TABLE MaterialType (
    MaterialTypeId INT IDENTITY(1,1) PRIMARY KEY,
    MaterialTypeName VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1
);

-- Add unique constraint on MaterialTypeName to prevent duplicates
ALTER TABLE MaterialType 
ADD CONSTRAINT UK_MaterialType_Name UNIQUE (MaterialTypeName);

-- Insert some common material types for EPR compliance
INSERT INTO MaterialType (MaterialTypeName, Description) VALUES
('Plastic', 'All types of plastic materials including PET, HDPE, PVC, etc.'),
('Paper', 'Paper and cardboard materials'),
('Glass', 'Glass containers and materials'),
('Metal', 'Aluminum, steel, and other metal materials'),
('Wood', 'Wooden materials and products'),
('Textile', 'Fabric and textile materials'),
('Electronics', 'Electronic waste and components'),
('Batteries', 'All types of batteries'),
('Organic', 'Biodegradable organic materials'),
('Composite', 'Multi-material composite products');

-- Create index for better performance on name searches
CREATE INDEX IX_MaterialType_Name ON MaterialType (MaterialTypeName);
CREATE INDEX IX_MaterialType_Active ON MaterialType (IsActive);
