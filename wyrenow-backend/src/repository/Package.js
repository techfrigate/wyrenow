const { pool } = require('../config/database');

// Find all packages with optional filters
async function findAllPackages(filters = {}) {
    let query = 'SELECT * FROM packages';
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`status = ?`);
        values.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(name LIKE ? OR description LIKE ?)`);
        values.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    if (filters.minPv) {
        conditions.push(`pv >= ?`);
        values.push(filters.minPv);
    }
    
    if (filters.maxPv) {
        conditions.push(`pv <= ?`);
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
    const limit = parseInt(filters.limit);
    if (filters.offset !== undefined) {
        const offset = parseInt(filters.offset);
        query += ` LIMIT ?, ?`;
        values.push(String(offset), String(limit));
    } else {
        query += ` LIMIT ?`;
        values.push(String(limit));
    }
}

    
    const [result] = await pool.execute(query, values);
    return result;
}

// Find package by ID
async function findPackageById(id) {
    const query = 'SELECT * FROM packages WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result[0];
}

// Find package by name
async function findPackageByName(name) {
    const query = 'SELECT * FROM packages WHERE name = ?';
    const [result] = await pool.execute(query, [name]);
    return result[0];
}

// Create new package
async function createPackage(packageData) {
    const connection = await pool.getConnection();
    try {
        const query = `
            INSERT INTO packages (name, description, pv, price_ngn, price_ghs, bottles, package_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
        
        const [result] = await connection.execute(query, values);
        
        // Get the inserted record
        const [rows] = await connection.execute(
            'SELECT * FROM packages WHERE id = ?', 
            [result.insertId]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Update package
async function updatePackage(id, packageData) {
    const connection = await pool.getConnection();
    try {
        const fields = [];
        const values = [];

        Object.keys(packageData).forEach(key => {
            if (packageData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(packageData[key]);
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE packages 
            SET ${fields.join(', ')}
            WHERE id = ?
        `;

        await connection.execute(query, values);
        
        // Get the updated record
        const [rows] = await connection.execute(
            'SELECT * FROM packages WHERE id = ?', 
            [id]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Delete package
async function deletePackage(id) {
    const connection = await pool.getConnection();
    try {
        // Get the record before deleting
        const [rows] = await connection.execute(
            'SELECT * FROM packages WHERE id = ?', 
            [id]
        );
        
        if (rows.length === 0) {
            return null;
        }
        
        const package = rows[0];
        
        // Delete the record
        await connection.execute('DELETE FROM packages WHERE id = ?', [id]);
        
        return package;
    } finally {
        connection.release();
    }
}

// Update package status
async function updatePackageStatus(id, status) {
    const connection = await pool.getConnection();
    try {
        const query = `
            UPDATE packages 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        await connection.execute(query, [status, id]);
        
        // Get the updated record
        const [rows] = await connection.execute(
            'SELECT * FROM packages WHERE id = ?', 
            [id]
        );
        
        return rows[0];
    } finally {
        connection.release();
    }
}

// Count packages with optional filters
async function countPackages(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM packages';
    const conditions = [];
    const values = [];
    
    if (filters.status) {
        conditions.push(`status = ?`);
        values.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(name LIKE ? OR description LIKE ?)`);
        values.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const [result] = await pool.execute(query, values);
    return parseInt(result[0].count);
}

// Get active packages only
async function getActivePackages() {
    const query = 'SELECT * FROM packages WHERE status = ? ORDER BY pv ASC';
    const [result] = await pool.execute(query, ['active']);
    return result;
}

// Get packages with usage statistics
async function getPackagesWithStats() {
    const query = `
        SELECT 
            p.*,
            COUNT(mr.id) as usage_count,
            SUM(mr.total_amount) as total_revenue
        FROM packages p
        LEFT JOIN mlm_registrations mr ON p.id = mr.package_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `;
    
    const [result] = await pool.execute(query);
    return result;
}

// Bulk update status for multiple packages
async function bulkUpdatePackageStatus(ids, status) {
    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }
    
    const connection = await pool.getConnection();
    try {
        // Create placeholders for IN clause
        const placeholders = ids.map(() => '?').join(',');
        
        const query = `
            UPDATE packages 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id IN (${placeholders})
        `;
        
        await connection.execute(query, [status, ...ids]);
        
        // Get the updated records
        const selectQuery = `
            SELECT * FROM packages 
            WHERE id IN (${placeholders})
        `;
        
        const [rows] = await connection.execute(selectQuery, ids);
        return rows;
    } finally {
        connection.release();
    }
}

// Get packages by price range
async function getPackagesByPriceRange(minPrice, maxPrice, currency = 'NGN') {
    const priceField = currency === 'GHS' ? 'price_ghs' : 'price_ngn';
    
    const query = `
        SELECT * FROM packages 
        WHERE ${priceField} BETWEEN ? AND ? 
        AND status = 'active'
        ORDER BY ${priceField} ASC
    `;
    
    const [result] = await pool.execute(query, [minPrice, maxPrice]);
    return result;
}

// Get packages by PV range
async function getPackagesByPvRange(minPv, maxPv) {
    const query = `
        SELECT * FROM packages 
        WHERE pv BETWEEN ? AND ? 
        AND status = 'active'
        ORDER BY pv ASC
    `;
    
    const [result] = await pool.execute(query, [minPv, maxPv]);
    return result;
}

// Get package statistics
async function getPackageStatistics() {
    const queries = [
        'SELECT COUNT(*) as total_packages FROM packages',
        'SELECT COUNT(*) as active_packages FROM packages WHERE status = "active"',
        'SELECT COUNT(*) as inactive_packages FROM packages WHERE status = "inactive"',
        'SELECT AVG(pv) as avg_pv FROM packages WHERE status = "active"',
        'SELECT SUM(pv) as total_pv FROM packages WHERE status = "active"',
        'SELECT MIN(price_ngn) as min_price_ngn, MAX(price_ngn) as max_price_ngn FROM packages WHERE status = "active"'
    ];
    
    const results = await Promise.all(
        queries.map(query => pool.execute(query))
    );
    
    return {
        totalPackages: results[0][0][0].total_packages,
        activePackages: results[1][0][0].active_packages,
        inactivePackages: results[2][0][0].inactive_packages,
        averagePv: parseFloat(results[3][0][0].avg_pv || 0),
        totalPv: results[4][0][0].total_pv || 0,
        priceRange: {
            min: results[5][0][0].min_price_ngn || 0,
            max: results[5][0][0].max_price_ngn || 0
        }
    };
}

module.exports = {
    findAll: findAllPackages,
    findById: findPackageById,
    findByName: findPackageByName,
    create: createPackage,
    update: updatePackage,
    delete: deletePackage,
    updateStatus: updatePackageStatus,
    count: countPackages,
    getActivePackages,
    getWithStats: getPackagesWithStats,
    bulkUpdateStatus: bulkUpdatePackageStatus,
    getByPriceRange: getPackagesByPriceRange,
    getByPvRange: getPackagesByPvRange,
    getStatistics: getPackageStatistics,
    
    // Keep original names for backward compatibility:
    findAllPackages,
    findPackageById,
    findPackageByName,
    createPackage,
    updatePackage,
    deletePackage,
    updatePackageStatus,
    countPackages,
    getPackagesWithStats,
    bulkUpdatePackageStatus,
    getPackagesByPriceRange,
    getPackagesByPvRange,
    getPackageStatistics
};