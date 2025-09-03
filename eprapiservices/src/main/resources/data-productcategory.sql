-- Insert sample product categories for EPR compliance tracking
-- This script will be executed automatically by Spring Boot if spring.jpa.defer-datasource-initialization=true

INSERT INTO ProductCategory (ProductCategoryName, Description, Created_By, Updated_By, Created_Date, Updated_Date, Is_Active) VALUES
('Electronics', 'Electronic devices and components including computers, phones, and accessories', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Packaging', 'All types of packaging materials including boxes, containers, and wrapping materials', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Automotive', 'Automotive parts, components, and accessories for vehicles', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Textiles', 'Clothing, fabrics, and textile-based products', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Furniture', 'Home and office furniture including chairs, tables, and storage solutions', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Appliances', 'Home and commercial appliances including refrigerators, washing machines, and kitchen equipment', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Toys & Games', 'Children toys, games, and recreational products', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Sports Equipment', 'Sports and fitness equipment, gear, and accessories', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Medical Devices', 'Medical equipment, devices, and healthcare-related products', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Construction Materials', 'Building and construction materials including tools and hardware', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Food & Beverage', 'Food products, beverages, and related packaging', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Personal Care', 'Personal hygiene and care products including cosmetics and toiletries', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Office Supplies', 'Office equipment, stationery, and business supplies', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Industrial Equipment', 'Industrial machinery, tools, and manufacturing equipment', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true),
('Batteries', 'All types of batteries including rechargeable and disposable batteries', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true);
