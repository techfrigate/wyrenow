-- ================================================
-- WyreNow MLM Database Schema - MySQL Version
-- ================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wyrenow_db;
USE wyrenow_db;


CREATE TABLE IF NOT EXISTS countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    currency VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    
    -- Multiple PV rates as per PDF requirements
    product_pv_rate DECIMAL(10,2) NOT NULL DEFAULT 1200.00, -- ₦1,200 / GH₵30
    bonus_pv_rate DECIMAL(10,2) NOT NULL DEFAULT 525.00,     -- ₦525 / GH₵12
    platform_margin DECIMAL(10,2) NOT NULL DEFAULT 2000.00, -- ₦2,000 / GH₵20
    
    -- Cross-country cap percentage (configurable)
    cross_country_cap_percentage DECIMAL(5,2) DEFAULT 30.00,
    
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Regions/States table
CREATE TABLE IF NOT EXISTS regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    country_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE KEY unique_country_region (country_id, name)
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    pv INT NOT NULL,
    price_ngn DECIMAL(10,2) NOT NULL,
    price_ghs DECIMAL(10,2) NOT NULL,
    bottles INT NOT NULL DEFAULT 0,
    package_type VARCHAR(50) DEFAULT 'standard',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- MLM registrations table
CREATE TABLE IF NOT EXISTS mlm_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    sponsor_username VARCHAR(50) NOT NULL,
    placement_leg VARCHAR(10) NOT NULL,
    existing_user_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    country_id INT NOT NULL,
    region_id INT NOT NULL,
    package_id VARCHAR(36),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL,
    transaction_pin_hash VARCHAR(255) NOT NULL,
    withdrawal_details JSON,
    registration_status VARCHAR(20) DEFAULT 'completed',
    registered_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- Tree structure - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS tree (
    user_id INT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    parent_user_id INT,
    left_leg_user_id INT,
    right_leg_user_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_user_id) REFERENCES mlm_registrations(id) ON DELETE SET NULL,
    FOREIGN KEY (left_leg_user_id) REFERENCES mlm_registrations(id) ON DELETE SET NULL,
    FOREIGN KEY (right_leg_user_id) REFERENCES mlm_registrations(id) ON DELETE SET NULL
);

-- Generation tree - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS generation_tree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    upline_user INT,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (upline_user) REFERENCES mlm_registrations(id) ON DELETE SET NULL
);

-- User PV - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS user_pv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_pv INT DEFAULT 0,
    right_leg_pv INT DEFAULT 0,
    total_pv INT AS (left_leg_pv + right_leg_pv) STORED,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- User BV - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS user_bv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_bv INT DEFAULT 0,
    right_leg_bv INT DEFAULT 0,
    total_bv INT AS (left_leg_bv + right_leg_bv) STORED,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- PV logs - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS pv_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT NOT NULL,
    updated_for_uid INT NOT NULL,
    message VARCHAR(500),
    added_pv INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_for_uid) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- BV logs - referencing mlm_registrations
CREATE TABLE IF NOT EXISTS bv_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT NOT NULL,
    updated_for_uid INT NOT NULL,
    message VARCHAR(500),
    added_bv INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_for_uid) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_countries_status ON countries(status);
CREATE INDEX idx_countries_code ON countries(code);
CREATE INDEX idx_regions_country_id ON regions(country_id);
CREATE INDEX idx_regions_status ON regions(status);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_pv ON packages(pv);
CREATE INDEX idx_mlm_registrations_username ON mlm_registrations(username);
CREATE INDEX idx_mlm_registrations_sponsor ON mlm_registrations(sponsor_username);
CREATE INDEX idx_tree_parent ON tree(parent_user_id);
CREATE INDEX idx_tree_left ON tree(left_leg_user_id);
CREATE INDEX idx_tree_right ON tree(right_leg_user_id);
CREATE INDEX idx_pv_logs_uid ON pv_logs(uid);
CREATE INDEX idx_pv_logs_updated_for ON pv_logs(updated_for_uid);
CREATE INDEX idx_bv_logs_uid ON bv_logs(uid);
CREATE INDEX idx_bv_logs_updated_for ON bv_logs(updated_for_uid);

-- Insert default countries
-- Insert default countries with updated schema
INSERT IGNORE INTO countries (name, code, currency, currency_symbol, product_pv_rate, bonus_pv_rate, platform_margin, cross_country_cap_percentage) VALUES
('Nigeria', 'NG', 'Nigerian Naira', '₦', 1200.00, 525.00, 2000.00, 30.00),
('Ghana', 'GH', 'Ghanaian Cedi', 'GH₵', 30.00, 12.00, 20.00, 30.00);

-- Insert Nigerian states
INSERT IGNORE INTO regions (country_id, name, code)
SELECT 
    c.id, 
    states.state_name, 
    states.state_code
FROM countries c
CROSS JOIN (
    SELECT 'Abia' as state_name, 'AB' as state_code UNION ALL
    SELECT 'Adamawa', 'AD' UNION ALL
    SELECT 'Akwa Ibom', 'AK' UNION ALL
    SELECT 'Anambra', 'AN' UNION ALL
    SELECT 'Bauchi', 'BA' UNION ALL
    SELECT 'Bayelsa', 'BY' UNION ALL
    SELECT 'Benue', 'BN' UNION ALL
    SELECT 'Borno', 'BO' UNION ALL
    SELECT 'Cross River', 'CR' UNION ALL
    SELECT 'Delta', 'DE' UNION ALL
    SELECT 'Ebonyi', 'EB' UNION ALL
    SELECT 'Edo', 'ED' UNION ALL
    SELECT 'Ekiti', 'EK' UNION ALL
    SELECT 'Enugu', 'EN' UNION ALL
    SELECT 'Federal Capital Territory', 'FC' UNION ALL
    SELECT 'Gombe', 'GO' UNION ALL
    SELECT 'Imo', 'IM' UNION ALL
    SELECT 'Jigawa', 'JI' UNION ALL
    SELECT 'Kaduna', 'KD' UNION ALL
    SELECT 'Kano', 'KN' UNION ALL
    SELECT 'Katsina', 'KT' UNION ALL
    SELECT 'Kebbi', 'KE' UNION ALL
    SELECT 'Kogi', 'KO' UNION ALL
    SELECT 'Kwara', 'KW' UNION ALL
    SELECT 'Lagos', 'LA' UNION ALL
    SELECT 'Nasarawa', 'NA' UNION ALL
    SELECT 'Niger', 'NI' UNION ALL
    SELECT 'Ogun', 'OG' UNION ALL
    SELECT 'Ondo', 'ON' UNION ALL
    SELECT 'Osun', 'OS' UNION ALL
    SELECT 'Oyo', 'OY' UNION ALL
    SELECT 'Plateau', 'PL' UNION ALL
    SELECT 'Rivers', 'RI' UNION ALL
    SELECT 'Sokoto', 'SO' UNION ALL
    SELECT 'Taraba', 'TA' UNION ALL
    SELECT 'Yobe', 'YO' UNION ALL
    SELECT 'Zamfara', 'ZA'
) AS states
WHERE c.code = 'NG';

-- Insert Ghanaian regions
INSERT IGNORE INTO regions (country_id, name, code)
SELECT 
    c.id, 
    regions_data.region_name, 
    regions_data.region_code
FROM countries c
CROSS JOIN (
    SELECT 'Greater Accra' as region_name, 'GA' as region_code UNION ALL
    SELECT 'Ashanti', 'AS' UNION ALL
    SELECT 'Western', 'WP' UNION ALL
    SELECT 'Central', 'CP' UNION ALL
    SELECT 'Eastern', 'EP' UNION ALL
    SELECT 'Volta', 'VR' UNION ALL
    SELECT 'Northern', 'NP' UNION ALL
    SELECT 'Upper East', 'UE' UNION ALL
    SELECT 'Upper West', 'UW' UNION ALL
    SELECT 'Brong Ahafo', 'BA' UNION ALL
    SELECT 'Western North', 'WN' UNION ALL
    SELECT 'Ahafo', 'AF' UNION ALL
    SELECT 'Bono', 'BO' UNION ALL
    SELECT 'Bono East', 'BE' UNION ALL
    SELECT 'Oti', 'OT' UNION ALL
    SELECT 'Savannah', 'SV'
) AS regions_data
WHERE c.code = 'GH';

-- Success message
SELECT 'Database schema created successfully!' AS message;