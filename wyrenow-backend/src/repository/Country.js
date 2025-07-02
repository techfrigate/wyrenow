const { pool } = require('../config/database');

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
        conditions.push(`c.status = ?`);
        values.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(c.name LIKE ? OR c.code LIKE ?)`);
        values.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
    
    if (filters.limit) {
        if (filters.offset) {
            query += ` LIMIT ?, ?`;
            values.push(parseInt(filters.offset), parseInt(filters.limit));
        } else {
            query += ` LIMIT ?`;
            values.push(parseInt(filters.limit));
        }
    }
    
    const result = await pool.query(query, values);
    return result[0]; // mysql2 returns [rows, fields]
}

// Find country by ID with regions
async function findCountryById(id) {
    const query = `
        SELECT c.*, 
               CASE 
                   WHEN COUNT(r.id) > 0 THEN 
                       JSON_ARRAYAGG(
                           JSON_OBJECT(
                               'id', r.id,
                               'name', r.name,
                               'code', r.code,
                               'status', r.status,
                               'created_at', r.created_at
                           )
                       )
                   ELSE JSON_ARRAY()
               END as regions
        FROM countries c
        LEFT JOIN regions r ON c.id = r.country_id
        WHERE c.id = ?
        GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    return result[0][0]; // First element of rows array
}

// Find country by code
async function findCountryByCode(code) {
    const query = 'SELECT * FROM countries WHERE code = ?';
    const result = await pool.query(query, [code]);
    return result[0][0];
}

// Create new country
async function createCountry(countryData) {
    const connection = await pool.getConnection();
    try {
        const query = `
            INSERT INTO countries (name, code, currency, currency_symbol, pv_rate, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            countryData.name,
            countryData.code.toUpperCase(),
            countryData.currency,
            countryData.currency_symbol,
            countryData.pv_rate,
            countryData.status || 'active'
        ];
        
        const [result] = await connection.execute(query, values);
        
        // Get the inserted record
        const [rows] = await connection.execute(
            'SELECT * FROM countries WHERE id = ?', 
            [result.insertId]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Update country
async function updateCountry(id, countryData) {
    const connection = await pool.getConnection();
    try {
        const fields = [];
        const values = [];

        Object.keys(countryData).forEach(key => {
            if (countryData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(key === 'code' ? countryData[key].toUpperCase() : countryData[key]);
            }
        });

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE countries 
            SET ${fields.join(', ')}
            WHERE id = ?
        `;

        await connection.execute(query, values);
        
        // Get the updated record
        const [rows] = await connection.execute(
            'SELECT * FROM countries WHERE id = ?', 
            [id]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Delete country
async function deleteCountry(id) {
    const connection = await pool.getConnection();
    try {
        // Get the record before deleting
        const [rows] = await connection.execute(
            'SELECT * FROM countries WHERE id = ?', 
            [id]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        const country = rows[0];
        
        // Delete the record
        await connection.execute('DELETE FROM countries WHERE id = ?', [id]);
        
        return country;
    } finally {
        connection.release();
    }
}

// Get regions for a country
async function getCountryRegions(countryId, filters = {}) {
    let query = 'SELECT * FROM regions WHERE country_id = ?';
    const values = [countryId];
    console.log(values,countryId,"coynt")
    if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
    }
    
    query += ' ORDER BY name ASC';
    
    const result = await pool.query(query, values);
    return result[0];
}

// Add region to country
async function addRegionToCountry(countryId, regionData) {
    const connection = await pool.getConnection();
    try {
        const query = `
            INSERT INTO regions (country_id, name, code, status)
            VALUES (?, ?, ?, ?)
        `;
        
        const values = [
            countryId,
            regionData.name,
            regionData.code || null,
            regionData.status || 'active'
        ];
        
        const [result] = await connection.execute(query, values);
        
        // Get the inserted record
        const [rows] = await connection.execute(
            'SELECT * FROM regions WHERE id = ?', 
            [result.insertId]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Update region
async function updateRegion(regionId, regionData) {
    const connection = await pool.getConnection();
    try {
        const fields = [];
        const values = [];

        Object.keys(regionData).forEach(key => {
            if (regionData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(regionData[key]);
            }
        });

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(regionId);

        const query = `
            UPDATE regions 
            SET ${fields.join(', ')}
            WHERE id = ?
        `;

        await connection.execute(query, values);
        
        // Get the updated record
        const [rows] = await connection.execute(
            'SELECT * FROM regions WHERE id = ?', 
            [regionId]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Delete region
async function deleteRegion(regionId) {
    const connection = await pool.getConnection();
    try {
        // Get the record before deleting
        const [rows] = await connection.execute(
            'SELECT * FROM regions WHERE id = ?', 
            [regionId]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        const region = rows[0];
        
        // Delete the record
        await connection.execute('DELETE FROM regions WHERE id = ?', [regionId]);
        
        return region;
    } finally {
        connection.release();
    }
}

// Count countries with optional filters
async function countCountries(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM countries';
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`status = ?`);
        values.push(filters.status);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await pool.query(query, values);
    return parseInt(result[0][0].count);
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