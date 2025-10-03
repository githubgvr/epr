import csv
import sys
from collections import OrderedDict

def parse_csv_and_generate_sql(csv_file_path):
    """Parse CSV file and generate SQL insert statements for Product Groups, Categories, and Types"""
    
    product_groups = OrderedDict()
    product_categories = OrderedDict()
    product_types = OrderedDict()
    
    # Read CSV file
    with open(csv_file_path, 'r', encoding='utf-8-sig') as file:
        csv_reader = csv.DictReader(file)

        # Debug: Print headers
        print(f"CSV Headers: {csv_reader.fieldnames}")

        for row in csv_reader:
            try:
                product_group = row['ProductGroup'].strip() if row.get('ProductGroup') else ''
                product_category = row['ProductCategory'].strip() if row.get('ProductCategory') else ''
                product_type = row['ProductType'].strip() if row.get('ProductType') else ''
            except KeyError as e:
                print(f"Warning: Missing column {e} in row: {row}")
                continue
            
            # Skip empty rows
            if not product_group:
                continue
            
            # Collect unique product groups
            if product_group and product_group not in product_groups:
                product_groups[product_group] = {
                    'name': product_group,
                    'description': f'{product_group} products and related items'
                }
            
            # Collect unique product categories
            if product_category:
                category_key = f"{product_group}|{product_category}"
                if category_key not in product_categories:
                    product_categories[category_key] = {
                        'name': product_category,
                        'group': product_group,
                        'description': f'{product_category} in {product_group} category'
                    }
            
            # Collect unique product types
            if product_type:
                type_key = f"{product_group}|{product_category}|{product_type}"
                if type_key not in product_types:
                    product_types[type_key] = {
                        'name': product_type,
                        'category': product_category,
                        'group': product_group,
                        'description': f'{product_type} {product_category}'
                    }
    
    # Helper function to escape SQL strings
    def escape_sql(text):
        """Escape single quotes for SQL"""
        return text.replace("'", "''")

    # Generate SQL file
    sql_output = []
    sql_output.append("-- Product Data Import Script")
    sql_output.append("-- Generated from productsdata.csv")
    sql_output.append("-- This script loads Product Groups, Product Categories, and Product Types\n")

    sql_output.append("-- Clean up existing data (optional - comment out if you want to keep existing data)")
    sql_output.append("-- DELETE FROM producttype WHERE is_active = 1;")
    sql_output.append("-- DELETE FROM productcategory WHERE is_active = 1;")
    sql_output.append("-- DELETE FROM productgroup WHERE is_active = 1;")
    sql_output.append("-- GO\n")
    
    # Product Groups
    sql_output.append("-- =====================================================")
    sql_output.append("-- PRODUCT GROUPS")
    sql_output.append("-- =====================================================\n")
    
    for idx, (key, group) in enumerate(product_groups.items(), start=1):
        sql_output.append(f"-- Product Group {idx}: {group['name']}")
        sql_output.append(
            f"IF NOT EXISTS (SELECT 1 FROM productgroup WHERE product_group_name = '{escape_sql(group['name'])}')"
        )
        sql_output.append(
            f"INSERT INTO productgroup (product_group_name, description, sort_order, is_active) "
            f"VALUES ('{escape_sql(group['name'])}', '{escape_sql(group['description'])}', {idx}, 1);\n"
        )
    
    sql_output.append("GO\n")
    
    # Product Categories
    sql_output.append("-- =====================================================")
    sql_output.append("-- PRODUCT CATEGORIES")
    sql_output.append("-- =====================================================\n")
    
    # Group categories by product group for better organization
    categories_by_group = {}
    for key, category in product_categories.items():
        group_name = category['group']
        if group_name not in categories_by_group:
            categories_by_group[group_name] = []
        categories_by_group[group_name].append(category)
    
    category_idx = 1
    for group_name in product_groups.keys():
        if group_name in categories_by_group:
            sql_output.append(f"-- Categories for {group_name}")
            for category in categories_by_group[group_name]:
                sql_output.append(
                    f"IF NOT EXISTS (SELECT 1 FROM productcategory pc "
                    f"JOIN productgroup pg ON pc.product_group_id = pg.product_group_id "
                    f"WHERE pc.product_category_name = '{escape_sql(category['name'])}' "
                    f"AND pg.product_group_name = '{escape_sql(group_name)}')"
                )
                sql_output.append(
                    f"INSERT INTO productcategory (product_category_name, description, sort_order, is_active, product_group_id) "
                    f"VALUES ('{escape_sql(category['name'])}', '{escape_sql(category['description'])}', {category_idx}, 1, "
                    f"(SELECT TOP 1 product_group_id FROM productgroup WHERE product_group_name = '{escape_sql(group_name)}'));\n"
                )
                category_idx += 1
            sql_output.append("")
    
    sql_output.append("GO\n")
    
    # Product Types
    sql_output.append("-- =====================================================")
    sql_output.append("-- PRODUCT TYPES")
    sql_output.append("-- =====================================================\n")
    
    # Group types by category for better organization
    types_by_category = {}
    for key, ptype in product_types.items():
        category_key = f"{ptype['group']}|{ptype['category']}"
        if category_key not in types_by_category:
            types_by_category[category_key] = []
        types_by_category[category_key].append(ptype)
    
    type_idx = 1
    for category_key, category in product_categories.items():
        if category_key in types_by_category:
            sql_output.append(f"-- Types for {category['name']} ({category['group']})")
            for ptype in types_by_category[category_key]:
                sql_output.append(
                    f"IF NOT EXISTS (SELECT 1 FROM producttype pt "
                    f"JOIN productcategory pc ON pt.product_category_id = pc.product_category_id "
                    f"JOIN productgroup pg ON pc.product_group_id = pg.product_group_id "
                    f"WHERE pt.product_type_name = '{escape_sql(ptype['name'])}' "
                    f"AND pc.product_category_name = '{escape_sql(ptype['category'])}' "
                    f"AND pg.product_group_name = '{escape_sql(ptype['group'])}')"
                )
                sql_output.append(
                    f"INSERT INTO producttype (product_type_name, product_type_description, sort_order, is_active, product_category_id) "
                    f"VALUES ('{escape_sql(ptype['name'])}', '{escape_sql(ptype['description'])}', {type_idx}, 1, "
                    f"(SELECT TOP 1 pc.product_category_id FROM productcategory pc "
                    f"JOIN productgroup pg ON pc.product_group_id = pg.product_group_id "
                    f"WHERE pc.product_category_name = '{escape_sql(ptype['category'])}' "
                    f"AND pg.product_group_name = '{escape_sql(ptype['group'])}'));\n"
                )
                type_idx += 1
            sql_output.append("")
    
    sql_output.append("GO\n")
    
    # Summary
    sql_output.append("-- =====================================================")
    sql_output.append("-- SUMMARY")
    sql_output.append("-- =====================================================")
    sql_output.append(f"-- Total Product Groups: {len(product_groups)}")
    sql_output.append(f"-- Total Product Categories: {len(product_categories)}")
    sql_output.append(f"-- Total Product Types: {len(product_types)}")
    sql_output.append("-- =====================================================\n")
    
    sql_output.append("-- Verify the data")
    sql_output.append("SELECT 'Product Groups' AS TableName, COUNT(*) AS RecordCount FROM productgroup WHERE is_active = 1")
    sql_output.append("UNION ALL")
    sql_output.append("SELECT 'Product Categories', COUNT(*) FROM productcategory WHERE is_active = 1")
    sql_output.append("UNION ALL")
    sql_output.append("SELECT 'Product Types', COUNT(*) FROM producttype WHERE is_active = 1;")
    sql_output.append("\nGO")
    
    return '\n'.join(sql_output)

if __name__ == '__main__':
    csv_file = 'productsdata.csv'
    output_file = 'load_product_data.sql'
    
    try:
        print(f"Parsing CSV file: {csv_file}")
        sql_content = parse_csv_and_generate_sql(csv_file)
        
        print(f"Writing SQL to: {output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(sql_content)
        
        print(f"✅ Successfully generated {output_file}")
        print(f"   Run this file using: sqlcmd -S localhost -d epr -i {output_file}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

