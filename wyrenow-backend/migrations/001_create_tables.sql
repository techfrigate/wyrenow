-- Create database if not exists
CREATE DATABASE IF NOT EXISTS  btmy_store;
USE btmy_store;
 
-- ================================================
-- TABLES CREATION (IF NOT EXISTS)
-- ================================================

-- Countries table
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
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    pv INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
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
    existing_user_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country_id INT NOT NULL,
    region_id INT NOT NULL,
    package_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL,
    transaction_pin_hash VARCHAR(255) NOT NULL,
    withdrawal_details JSON,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    -- registered_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- Ranks table (Promoter → Global Icon)
CREATE TABLE IF NOT EXISTS ranks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    order_position INT NOT NULL UNIQUE,
    pv_requirement INT NOT NULL,
    requirement_type ENUM('both_legs', 'weak_leg') DEFAULT 'both_legs',
    required_package_id INT NOT NULL,
    cash_reward DECIMAL(15,2) DEFAULT 0.00,
    unlock_3rd_leg BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (required_package_id) REFERENCES packages(id)
);


-- Tree structure
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

-- Generation tree
CREATE TABLE IF NOT EXISTS generation_tree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    upline_user INT,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    FOREIGN KEY (upline_user) REFERENCES mlm_registrations(id) ON DELETE SET NULL
);

-- User PV
CREATE TABLE IF NOT EXISTS user_pv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_pv INT DEFAULT 0,
    right_leg_pv INT DEFAULT 0,
    total_pv INT AS (left_leg_pv + right_leg_pv) STORED,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- User BV
CREATE TABLE IF NOT EXISTS user_bv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_bv INT DEFAULT 0,
    right_leg_bv INT DEFAULT 0,
    total_bv INT AS (left_leg_bv + right_leg_bv) STORED,
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE
);

-- PV logs
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

-- BV logs
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

-- USER WALLETS TABLE
CREATE TABLE IF NOT EXISTS user_wallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    
    registration_wallet DECIMAL(15,2) DEFAULT 0.00,
    repurchase_wallet DECIMAL(15,2) DEFAULT 0.00,
    cashout_bonus_account DECIMAL(15,2) DEFAULT 0.00,
    awaiting_wallet DECIMAL(15,2) DEFAULT 0.00,
    service_center_wallet DECIMAL(15,2) DEFAULT 0.00,
    megastore_wallet DECIMAL(15,2) DEFAULT 0.00,
    leadership_pool_wallet DECIMAL(15,2) DEFAULT 0.00,
    award_wallet DECIMAL(15,2) DEFAULT 0.00,
    
    awaiting_wallet_last_release DATE,
    total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    INDEX idx_user_wallets_user_id (user_id)
);

-- BONUS TRANSACTIONS TABLE - Simplified to match your INSERT statement
CREATE TABLE IF NOT EXISTS bonus_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    transaction_type ENUM(
        'DSB', 'ISB', 'ROLLUP', 'PAIRING', 'UNILEVEL', 'RETAIL',
        'AWARD', 'AWARDEE_SPONSOR', 'SERVICE_CENTER', 'MEGASTORE',
        'MEGASTORE_LEADERSHIP', 'LEADERSHIP_POOL', 'EXECUTIVE_BOARD',
        'DEDUCTION', 'WITHDRAWAL', 'TRANSFER', 'REGISTRATION_BONUS'
    ) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    cashout_amount DECIMAL(15,2) DEFAULT 0.00,
    awaiting_amount DECIMAL(15,2) DEFAULT 0.00,
    pv_amount DECIMAL(10,2) DEFAULT 0.00,
    description TEXT NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'reversed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES mlm_registrations(id) ON DELETE CASCADE,
    INDEX idx_bonus_user_id (user_id),
    INDEX idx_bonus_transaction_type (transaction_type),
    INDEX idx_bonus_created_at (created_at)
);

-- ================================================
-- INDEXES FOR PERFORMANCE (IF NOT EXISTS)
-- ================================================

 
 -- Note: MySQL doesn't support IF NOT EXISTS for indexes, so we'll handle duplicates gracefully
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
  

-- Insert Nigerian States
INSERT IGNORE INTO regions (country_id, name, code)
SELECT c.id, states.state_name, states.state_code
FROM countries c
CROSS JOIN (
    SELECT 'Lagos' as state_name, 'LA' as state_code UNION ALL
    SELECT 'Abuja', 'FC' UNION ALL
    SELECT 'Kano', 'KN' UNION ALL
    SELECT 'Rivers', 'RI' UNION ALL
    SELECT 'Oyo', 'OY' UNION ALL
    SELECT 'Kaduna', 'KD' UNION ALL
    SELECT 'Ogun', 'OG' UNION ALL
    SELECT 'Imo', 'IM' UNION ALL
    SELECT 'Enugu', 'EN' UNION ALL
    SELECT 'Delta', 'DE'
) AS states
WHERE c.code = 'NG';

-- Insert Ghanaian Regions
INSERT IGNORE INTO regions (country_id, name, code)
SELECT c.id, regions_data.region_name, regions_data.region_code
FROM countries c
CROSS JOIN (
    SELECT 'Greater Accra' as region_name, 'GA' as region_code UNION ALL
    SELECT 'Ashanti', 'AS' UNION ALL
    SELECT 'Western', 'WP' UNION ALL
    SELECT 'Central', 'CP' UNION ALL
    SELECT 'Eastern', 'EP'
) AS regions_data
WHERE c.code = 'GH';

-- Insert other regions
INSERT IGNORE INTO regions (country_id, name, code)
SELECT c.id, 'Nairobi', 'NB' FROM countries c WHERE c.code = 'KE'
UNION ALL SELECT c.id, 'Mombasa', 'MB' FROM countries c WHERE c.code = 'KE'
UNION ALL SELECT c.id, 'Gauteng', 'GP' FROM countries c WHERE c.code = 'ZA'
UNION ALL SELECT c.id, 'Western Cape', 'WC' FROM countries c WHERE c.code = 'ZA'
UNION ALL SELECT c.id, 'California', 'CA' FROM countries c WHERE c.code = 'US'
UNION ALL SELECT c.id, 'New York', 'NY' FROM countries c WHERE c.code = 'US'
UNION ALL SELECT c.id, 'London', 'LN' FROM countries c WHERE c.code = 'GB'
UNION ALL SELECT c.id, 'Ontario', 'ON' FROM countries c WHERE c.code = 'CA';

-- Insert Packages
INSERT IGNORE INTO packages (name, description, pv, price, bottles, package_type, status) VALUES
('Starter Pack', 'Entry-level package perfect for beginners', 50, 30000.00, 2, 'starter', 'active'),
('Bronze Pack', 'Popular choice with good value proposition', 100, 55000.00, 4, 'bronze', 'active'),
('Silver Pack', 'Enhanced package with premium benefits', 200, 95000.00, 6, 'silver', 'active'),
('Gold Pack', 'Premium package for serious distributors', 300, 140000.00, 10, 'gold', 'active'),
('Platinum Pack', 'Ultimate package with maximum benefits', 500, 220000.00, 15, 'platinum', 'active'),
('Diamond Pack', 'Exclusive package for top performers', 750, 320000.00, 20, 'diamond', 'active');

-- Insert Root Admin User Only
INSERT IGNORE INTO mlm_registrations (username, sponsor_username, first_name, last_name, email, phone, country_id, region_id, package_id, total_amount, password_hash, transaction_pin_hash, withdrawal_details, status) VALUES
('wyrenow_admin', 'wyrenow_admin', 'System', 'Administrator', 'admin@wyrenow.com', '+2348000000000', 
 (SELECT id FROM countries WHERE code = 'NG'), 
 (SELECT id FROM regions WHERE name = 'Lagos' AND country_id = (SELECT id FROM countries WHERE code = 'NG')), 
 (SELECT id FROM packages WHERE name = 'Diamond Pack'), 
 320000.00, 
 '$2a$12$P6orE5Vgc.eyMYVWQ7zZJOtkjfdtmETUDA9OLnHv/1hF.qPNnIc.K', 
 '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '{"bank_name": "First Bank", "account_number": "0000000000", "account_name": "System Administrator"}', 
 'active');

-- Insert Root Admin Tree Structure (Root node only)
INSERT IGNORE INTO tree (user_id, username, parent_user_id, left_leg_user_id, right_leg_user_id, registration_date) VALUES
(1, 'wyrenow_admin', NULL, NULL, NULL, '2024-01-01 10:00:00');

-- Insert Root Admin Generation Tree
INSERT IGNORE INTO generation_tree (user_id, upline_user) VALUES
(1, NULL);

-- Insert Root Admin User PV (Initial values)
INSERT IGNORE INTO user_pv (user_id, left_leg_pv, right_leg_pv) VALUES
(1, 0, 0);

-- Insert Root Admin User BV (Initial values)
INSERT IGNORE INTO user_bv (user_id, left_leg_bv, right_leg_bv) VALUES
(1, 0, 0);

-- Insert Root Admin User Wallet (Initial setup)
INSERT IGNORE INTO user_wallets (user_id, registration_wallet, repurchase_wallet, cashout_bonus_account, awaiting_wallet, service_center_wallet, megastore_wallet, leadership_pool_wallet, award_wallet, awaiting_wallet_last_release, total_withdrawn) VALUES
(1, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 0.00);

-- Insert Root Admin Registration Bonus Transaction
INSERT INTO bonus_transactions (user_id, transaction_type, total_amount, cashout_amount, awaiting_amount, pv_amount, description, status, created_at) VALUES
(1, 'REGISTRATION_BONUS', 15000.00, 9000.00, 6000.00, 750.00, 'Registration bonus for Diamond Pack purchase', 'completed', '2024-01-01 10:30:00');

-- ================================================
-- SUMMARY QUERIES
-- ================================================

SELECT 'Root Admin Database setup completed successfully!' AS message;

SELECT 'DATA SUMMARY:' AS summary;
SELECT 
    (SELECT COUNT(*) FROM countries) AS total_countries,
    (SELECT COUNT(*) FROM regions) AS total_regions,
    (SELECT COUNT(*) FROM packages) AS total_packages,
    (SELECT COUNT(*) FROM mlm_registrations) AS total_users,
    (SELECT COUNT(*) FROM tree) AS total_tree_nodes,
    (SELECT COUNT(*) FROM generation_tree) AS total_generation_nodes,
    (SELECT COUNT(*) FROM user_pv) AS total_pv_records,
    (SELECT COUNT(*) FROM user_bv) AS total_bv_records,
    (SELECT COUNT(*) FROM user_wallets) AS total_wallet_records,
    (SELECT COUNT(*) FROM bonus_transactions) AS total_bonus_transactions;

-- Display Root Admin Details
SELECT 'ROOT ADMIN DETAILS:' AS info;
SELECT 
    mr.username,
    mr.first_name,
    mr.last_name,
    mr.email,
    mr.phone,
    c.name as country,
    r.name as region,
    p.name as package,
    mr.total_amount,
    mr.status,
    mr.created_at
FROM mlm_registrations mr
JOIN countries c ON mr.country_id = c.id
JOIN regions r ON mr.region_id = r.id
JOIN packages p ON mr.package_id = p.id
WHERE mr.username = 'wyrenow_admin';