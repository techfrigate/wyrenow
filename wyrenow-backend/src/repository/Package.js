const pool = require('../config/database');

// Find all packages with optional filters
async function findAllPackages(filters = {}) {
    let query = 'SELECT * FROM packages';
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`status = $${values.length + 1}`);
        values.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(name ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
        values.push(`%${filters.search}%`);
    }
    
    if (filters.minPv) {
        conditions.push(`pv >= $${values.length + 1}`);
        values.push(filters.minPv);
    }
    
    if (filters.maxPv) {
        conditions.push(`pv <= $${values.length + 1}`);
        values.push(filters.maxPv);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Pagination
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

// Find package by ID
async function findPackageById(id) {
    const query = 'SELECT * FROM packages WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// Find package by name
async function findPackageByName(name) {
    const query = 'SELECT * FROM packages WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
}

// Create new package
async function createPackage(packageData) {
    const query = `
        INSERT INTO packages (name, description, pv, price_ngn, price_ghs, bottles, package_type, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    
    const values = [
        packageData.name,
        packageData.description || null,
        packageData.pv,
        packageData.price_ngn,
        packageData.price_ghs,
        packageData.bottles || 0,
        packageData.package_type || 'standard',
        packageData.status || 'active'
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Update package
async function updatePackage(id, packageData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(packageData).forEach(key => {
        if (packageData[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(packageData[key]);
            paramCount++;
        }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
        UPDATE packages 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
}

// Delete package
async function deletePackage(id) {
    const query = 'DELETE FROM packages WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

// Update package status
async function updatePackageStatus(id, status) {
    const query = `
        UPDATE packages 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
}

// Count packages with optional filters
async function countPackages(filters = {}) {
    let query = 'SELECT COUNT(*) FROM packages';
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

// Get active packages only
async function getActivePackages() {
    const query = 'SELECT * FROM packages WHERE status = $1 ORDER BY pv ASC';
    const result = await pool.query(query, ['active']);
    return result.rows;
}

// Bulk update status for multiple packages
async function bulkUpdatePackageStatus(ids, status) {
    const query = `
        UPDATE packages 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ANY($2)
        RETURNING *
    `;
    
    const result = await pool.query(query, [status, ids]);
    return result.rows;
}

// Export all functions
module.exports = {
    findAllPackages,
    findPackageById,
    findPackageByName,
    createPackage,
    updatePackage,
    deletePackage,
    updatePackageStatus,
    countPackages,
    getActivePackages,
    bulkUpdatePackageStatus
};