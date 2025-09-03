-- Create ProductType table
CREATE TABLE ProductType (
    ProductType_Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductType_Name NVARCHAR(100) NOT NULL,
    ProductType_Description NVARCHAR(500),
    Created_By INT DEFAULT 0,
    Updated_By INT DEFAULT 0,
    Created_Date DATETIME2 DEFAULT GETDATE(),
    Updated_Date DATETIME2 DEFAULT GETDATE(),
    Is_Active BIT DEFAULT 1
);

-- Insert sample data
INSERT INTO ProductType (ProductType_Name, ProductType_Description) VALUES
('Electronics', 'Electronic products and devices'),
('Packaging', 'Packaging materials and containers'),
('Batteries', 'Battery products and components'),
('Textiles', 'Textile and clothing products'),
('Furniture', 'Furniture and home furnishing products'),
('Automotive', 'Automotive parts and components'),
('Pharmaceuticals', 'Pharmaceutical and medical products'),
('Food & Beverages', 'Food and beverage products'),
('Cosmetics', 'Cosmetic and personal care products'),
('Chemicals', 'Chemical products and materials');

-- Create index for better performance
CREATE INDEX IX_ProductType_Name ON ProductType(ProductType_Name);
CREATE INDEX IX_ProductType_Active ON ProductType(Is_Active);
