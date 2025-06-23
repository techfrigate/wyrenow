 const pool = require('../config/database');

// Find all countries with optional filters
async function findAllCountries(filters = {}) {
    let query = `
        SELECT c.*, 
               COUNT(r.id) as regions_count
        FROM countries c
        LEFT JOIN regions r ON c.id = r.country_id
    `;
    
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`c.status = $${values.length + 1}`);
        values.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(c.name ILIKE $${values.length + 1} OR c.code ILIKE $${values.length + 1})`);
        values.push(`%${filters.search}%`);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
    
    if (filters.limit) {
        query += ` LIMIT $${values.length + 1}`;
        values.push(filters.limit);
        
        if (filters.offset) {
            query += ` OFFSET $${values.length + 1}`;
            values.push(filters.offset);
        }
    }
    
    const result = await pool.query(query, values);
    return result.rows;
}

// Find country by ID with regions
async function findCountryById(id) {
    const query = `
        SELECT c.*, 
               COALESCE(
                   json_agg(
                       json_build_object(
                           'id', r.id,
                           'name', r.name,
                           'code', r.code,
                           'status', r.status,
                           'created_at', r.created_at
                       ) ORDER BY r.name
                   ) FILTER (WHERE r.id IS NOT NULL), 
                   '[]'
               ) as regions
        FROM countries c
        LEFT JOIN regions r ON c.id = r.country_id
        WHERE c.id = $1
        GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// Find country by code
async function findCountryByCode(code) {
    const query = 'SELECT * FROM countries WHERE code = $1';
    const result = await pool.query(query, [code]);
    return result.rows[0];
}

// Create new country
async function createCountry(countryData) {
    const query = `
        INSERT INTO countries (name, code, currency, currency_symbol, pv_rate, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    
    const values = [
        countryData.name,
        countryData.code.toUpperCase(),
        countryData.currency,
        countryData.currency_symbol,
        countryData.pv_rate,
        countryData.status || 'active'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Update country
async function updateCountry(id, countryData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(countryData).forEach(key => {
        if (countryData[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(key === 'code' ? countryData[key].toUpperCase() : countryData[key]);
            paramCount++;
        }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
        UPDATE countries 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Delete country
async function deleteCountry(id) {
    const query = 'DELETE FROM countries WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// Get regions for a country
async function getCountryRegions(countryId, filters = {}) {
    let query = 'SELECT * FROM regions WHERE country_id = $1';
    const values = [countryId];
    
    if (filters.status) {
        query += ` AND status = $${values.length + 1}`;
        values.push(filters.status);
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await pool.query(query, values);
    return result.rows;
}

// Add region to country
async function addRegionToCountry(countryId, regionData) {
    const query = `
        INSERT INTO regions (country_id, name, code, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    
    const values = [
        countryId,
        regionData.name,
        regionData.code || null,
        regionData.status || 'active'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Update region
async function updateRegion(regionId, regionData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(regionData).forEach(key => {
        if (regionData[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(regionData[key]);
            paramCount++;
        }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(regionId);

    const query = `
        UPDATE regions 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Delete region
async function deleteRegion(regionId) {
    const query = 'DELETE FROM regions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [regionId]);
    return result.rows[0];
}

// Count countries with optional filters
async function countCountries(filters = {}) {
    let query = 'SELECT COUNT(*) FROM countries';
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`status = $${values.length + 1}`);
        values.push(filters.status);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
}

// Export all functions
module.exports = {
    findAllCountries,
    findCountryById,
    findCountryByCode,
    createCountry,
    updateCountry,
    deleteCountry,
    getCountryRegions,
    addRegionToCountry,
    updateRegion,
    deleteRegion,
    countCountries
};