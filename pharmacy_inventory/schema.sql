-- Database schema for pharmacy inventory management system (SQLite version)

-- Users table for login
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL,
    supplier TEXT,
    expiry_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users only if the table is empty
INSERT INTO users (username, password) 
SELECT 'admin', 'admin123' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password) 
SELECT 'pharmacist', 'pharma123' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'pharmacist');

-- Insert sample inventory items only if the table is empty
INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) 
SELECT 'Paracetamol 500mg', 'Pain reliever and fever reducer', 'Pain Management', 1000, 0.25, 'MediCorp', '2025-12-31'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Paracetamol 500mg');

INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) 
SELECT 'Amoxicillin 250mg', 'Antibiotic for bacterial infections', 'Antibiotics', 500, 0.75, 'PharmaPlus', '2025-11-30'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Amoxicillin 250mg');

INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) 
SELECT 'Loratadine 10mg', 'Antihistamine for allergies', 'Allergy', 750, 0.50, 'AllergyMed', '2026-01-31'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Loratadine 10mg');

INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) 
SELECT 'Omeprazole 20mg', 'Proton pump inhibitor for acid reflux', 'Digestive Health', 600, 0.80, 'StomachCare', '2025-10-31'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Omeprazole 20mg');

INSERT INTO inventory (name, description, category, quantity, unit_price, supplier, expiry_date) 
SELECT 'Aspirin 81mg', 'Blood thinner and pain reliever', 'Cardiovascular', 1200, 0.30, 'HeartHealth', '2026-02-28'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE name = 'Aspirin 81mg');