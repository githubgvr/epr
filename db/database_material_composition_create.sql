-- Database Material Composition Creation Script
-- This script creates the MaterialComposition table and sample data

-- Create MaterialComposition table
CREATE TABLE materialcomposition (
    material_composition_id INT IDENTITY(1,1) PRIMARY KEY,
    composition_name VARCHAR(100) NOT NULL,
    composition_code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(500),
    material_id INT NOT NULL,
    weight_kg DECIMAL(13,3) NOT NULL CHECK (weight_kg > 0),
    min_percentage DECIMAL(5,2) NOT NULL CHECK (min_percentage >= 0 AND min_percentage <= 100),
    max_percentage DECIMAL(5,2) NOT NULL CHECK (max_percentage >= 0 AND max_percentage <= 100),
    sort_order INT DEFAULT 1,
    notes VARCHAR(500),
    is_active BIT DEFAULT 1,
    created_date DATETIME2 DEFAULT GETDATE(),
    updated_date DATETIME2 DEFAULT GETDATE()
);

-- Add check constraint to ensure min_percentage <= max_percentage
ALTER TABLE materialcomposition 
ADD CONSTRAINT CK_MaterialComposition_PercentageRange 
CHECK (min_percentage <= max_percentage);

-- Add unique constraint on composition_code
ALTER TABLE materialcomposition 
ADD CONSTRAINT UK_MaterialComposition_Code UNIQUE (composition_code);

-- Create indexes for better performance
CREATE INDEX IX_MaterialComposition_MaterialId ON materialcomposition (material_id);
CREATE INDEX IX_MaterialComposition_Code ON materialcomposition (composition_code);
CREATE INDEX IX_MaterialComposition_Name ON materialcomposition (composition_name);
CREATE INDEX IX_MaterialComposition_Active ON materialcomposition (is_active);
CREATE INDEX IX_MaterialComposition_SortOrder ON materialcomposition (sort_order);
CREATE INDEX IX_MaterialComposition_Weight ON materialcomposition (weight_kg);
CREATE INDEX IX_MaterialComposition_Percentage ON materialcomposition (min_percentage, max_percentage);

-- Insert sample material composition data
INSERT INTO materialcomposition (composition_name, composition_code, description, material_id, weight_kg, min_percentage, max_percentage, sort_order, notes, is_active) VALUES
('PET Bottle Base', 'COMP001', 'Base composition for PET plastic bottles with standard weight and percentage ranges', 1, 0.500, 85.00, 95.00, 1, 'Standard PET bottle composition for beverage containers', 1),
('HDPE Container Mix', 'COMP002', 'HDPE composition for heavy-duty containers and jugs', 2, 1.200, 80.00, 90.00, 2, 'Suitable for milk jugs and detergent bottles', 1),
('PVC Pipe Blend', 'COMP003', 'PVC composition optimized for pipe manufacturing', 3, 2.500, 75.00, 85.00, 3, 'Industrial grade PVC for plumbing applications', 1),
('LDPE Film Grade', 'COMP004', 'Low-density polyethylene for flexible films and bags', 4, 0.300, 90.00, 98.00, 4, 'Food-grade LDPE for packaging films', 1),
('PP Automotive Parts', 'COMP005', 'Polypropylene blend for automotive components', 5, 1.800, 70.00, 80.00, 5, 'Heat-resistant PP for car interior parts', 1),
('PS Foam Packaging', 'COMP006', 'Polystyrene composition for foam packaging materials', 6, 0.150, 85.00, 95.00, 6, 'Lightweight foam for protective packaging', 1),
('Cardboard Corrugated', 'COMP007', 'Multi-layer cardboard composition for shipping boxes', 7, 0.800, 60.00, 75.00, 7, 'Recycled content cardboard for e-commerce packaging', 1),
('Office Paper Grade', 'COMP008', 'High-quality paper composition for office use', 8, 0.080, 80.00, 90.00, 8, 'Bright white paper for printing and copying', 1),
('Clear Glass Container', 'COMP009', 'Clear glass composition for food and beverage containers', 9, 0.450, 95.00, 99.00, 9, 'Food-safe clear glass for jars and bottles', 1),
('Aluminum Can Alloy', 'COMP010', 'Aluminum alloy composition for beverage cans', 10, 0.015, 92.00, 98.00, 10, 'Lightweight aluminum for carbonated beverage cans', 1),
('PET Recycled Blend', 'COMP011', 'Recycled PET composition with virgin material blend', 1, 0.480, 50.00, 70.00, 11, 'Eco-friendly blend with 30-50% recycled content', 1),
('HDPE Heavy Duty', 'COMP012', 'Heavy-duty HDPE composition for industrial containers', 2, 2.800, 85.00, 95.00, 12, 'Chemical-resistant HDPE for industrial storage', 1),
('Cardboard Lightweight', 'COMP013', 'Lightweight cardboard for small package shipping', 7, 0.400, 70.00, 85.00, 13, 'Cost-effective cardboard for small items', 1),
('Glass Amber Tinted', 'COMP014', 'Amber-tinted glass composition for UV protection', 9, 0.520, 90.00, 95.00, 14, 'UV-protective amber glass for pharmaceuticals', 1),
('Aluminum Foil Grade', 'COMP015', 'Thin aluminum composition for foil applications', 10, 0.008, 98.00, 99.50, 15, 'Ultra-thin aluminum for food packaging foil', 1);

-- Verify the data
SELECT 'MaterialComposition table created successfully' as info;
SELECT 
    material_composition_id, 
    composition_name, 
    composition_code, 
    material_id, 
    weight_kg, 
    min_percentage, 
    max_percentage, 
    sort_order, 
    is_active 
FROM materialcomposition 
ORDER BY sort_order;
