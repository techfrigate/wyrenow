CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
 
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    currency VARCHAR(50) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    pv_rate DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regions/States table
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_id, name)
);


-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    pv INTEGER NOT NULL,
    price_ngn DECIMAL(10,2) NOT NULL,
    price_ghs DECIMAL(10,2) NOT NULL,
    bottles INTEGER NOT NULL DEFAULT 0,
    package_type VARCHAR(50) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- MLM registrations table
CREATE TABLE mlm_registrations (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    sponsor_username VARCHAR(50) NOT NULL,
    -- placement_username VARCHAR(50) NOT NULL,
    placement_leg VARCHAR(10) NOT NULL,
    -- sponsor_user_id INTEGER,
    -- placement_user_id INTEGER,
    existing_user_id INTEGER,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    country_id INTEGER REFERENCES countries(id) NOT NULL,
    region_id INTEGER REFERENCES regions(id) NOT NULL,
    package_id INTEGER,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    password_hash VARCHAR(255) NOT NULL,
    transaction_pin_hash VARCHAR(255) NOT NULL,
    withdrawal_details JSONB,
    registration_status VARCHAR(20) DEFAULT 'completed',
    registered_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tree (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    parent_user_id INT,
    left_leg_user_id INT,
    right_leg_user_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_user_id) REFERENCES tree(user_id) ON DELETE SET NULL,
    FOREIGN KEY (left_leg_user_id) REFERENCES tree(user_id) ON DELETE SET NULL,
    FOREIGN KEY (right_leg_user_id) REFERENCES tree(user_id) ON DELETE SET NULL
);

CREATE TABLE generation_tree (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    upline_user INT,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (upline_user) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE user_pv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_pv INT DEFAULT 0,
    right_leg_pv INT DEFAULT 0,
    total_pv INT GENERATED ALWAYS AS (left_leg_pv + right_leg_pv) STORED,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE user_bv (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    left_leg_bv INT DEFAULT 0,
    right_leg_bv INT DEFAULT 0,
    total_bv INT GENERATED ALWAYS AS (left_leg_bv + right_leg_bv) STORED,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE pv_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT NOT NULL,
    updated_for_uid INT NOT NULL,
    message VARCHAR(500),
    added_pv INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uid) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_for_uid) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE bv_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uid INT NOT NULL,
    updated_for_uid INT NOT NULL,
    message VARCHAR(500),
    added_bv INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uid) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_for_uid) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_countries_active ON countries(is_active);
CREATE INDEX idx_regions_country ON regions(country_id);
CREATE INDEX idx_regions_active ON regions(is_active);
CREATE INDEX idx_mlm_registrations_sponsor ON mlm_registrations(sponsor_username);
CREATE INDEX idx_mlm_registrations_placement ON mlm_registrations(placement_username);
CREATE INDEX idx_mlm_registrations_country ON mlm_registrations(country_id);
CREATE INDEX idx_mlm_registrations_region ON mlm_registrations(region_id);
CREATE INDEX idx_tree_parent ON tree(parent_user_id);
CREATE INDEX idx_tree_left ON tree(left_leg_user_id);
CREATE INDEX idx_tree_right ON tree(right_leg_user_id);
CREATE INDEX idx_pv_logs_uid ON pv_logs(uid);
CREATE INDEX idx_pv_logs_updated_for ON pv_logs(updated_for_uid);
CREATE INDEX idx_bv_logs_uid ON bv_logs(uid);
CREATE INDEX idx_bv_logs_updated_for ON bv_logs(updated_for_uid);
CREATE INDEX IF NOT EXISTS idx_countries_status ON countries(status);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_regions_country_id ON regions(country_id);
CREATE INDEX IF NOT EXISTS idx_regions_status ON regions(status);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_pv ON packages(pv);


-- Insert default countries
INSERT INTO countries (name, code, currency, currency_symbol, pv_rate) VALUES
('Nigeria', 'NG', 'Nigerian Naira', '₦', 525.00),
('Ghana', 'GH', 'Ghanaian Cedi', 'GH₵', 12.00)
ON CONFLICT (code) DO NOTHING;

-- Insert Nigerian states
INSERT INTO regions (country_id, name, code) 
SELECT c.id, state_name, state_code 
FROM countries c, (VALUES
    ('Abia', 'AB'), ('Adamawa', 'AD'), ('Akwa Ibom', 'AK'), ('Anambra', 'AN'),
    ('Bauchi', 'BA'), ('Bayelsa', 'BY'), ('Benue', 'BN'), ('Borno', 'BO'),
    ('Cross River', 'CR'), ('Delta', 'DE'), ('Ebonyi', 'EB'), ('Edo', 'ED'),
    ('Ekiti', 'EK'), ('Enugu', 'EN'), ('Federal Capital Territory', 'FC'),
    ('Gombe', 'GO'), ('Imo', 'IM'), ('Jigawa', 'JI'), ('Kaduna', 'KD'),
    ('Kano', 'KN'), ('Katsina', 'KT'), ('Kebbi', 'KE'), ('Kogi', 'KO'),
    ('Kwara', 'KW'), ('Lagos', 'LA'), ('Nasarawa', 'NA'), ('Niger', 'NI'),
    ('Ogun', 'OG'), ('Ondo', 'ON'), ('Osun', 'OS'), ('Oyo', 'OY'),
    ('Plateau', 'PL'), ('Rivers', 'RI'), ('Sokoto', 'SO'), ('Taraba', 'TA'),
    ('Yobe', 'YO'), ('Zamfara', 'ZA')
) AS states(state_name, state_code)
WHERE c.code = 'NG'
ON CONFLICT (country_id, name) DO NOTHING;

-- Insert Ghanaian regions
INSERT INTO regions (country_id, name, code)
SELECT c.id, region_name, region_code
FROM countries c, (VALUES
    ('Greater Accra', 'GA'), ('Ashanti', 'AS'), ('Western', 'WP'),
    ('Central', 'CP'), ('Eastern', 'EP'), ('Volta', 'VR'),
    ('Northern', 'NP'), ('Upper East', 'UE'), ('Upper West', 'UW'),
    ('Brong Ahafo', 'BA'), ('Western North', 'WN'), ('Ahafo', 'AF'),
    ('Bono', 'BO'), ('Bono East', 'BE'), ('Oti', 'OT'), ('Savannah', 'SV')
) AS regions_data(region_name, region_code)
WHERE c.code = 'GH'
ON CONFLICT (country_id, name) DO NOTHING;