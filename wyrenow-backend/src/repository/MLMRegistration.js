const { pool } = require('../config/database');

const create = async (data) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Validate sponsor exists (checking in mlm_registrations table)
        const sponsorQuery = 'SELECT id FROM mlm_registrations WHERE username = ?';
        const [sponsorResult] = await connection.execute(sponsorQuery, [data.sponsor_username]);
        
        if (sponsorResult.length === 0) {
            throw new Error('Sponsor username not found');
        }
        
        // Validate placement user exists  
        const placementQuery = 'SELECT id FROM mlm_registrations WHERE username = ?';
        const [placementResult] = await connection.execute(placementQuery, [data.placement_username]);
        
        if (placementResult.length === 0) {
            throw new Error('Placement username not found');
        }
        
        // Check if user already exists
        const existingUserQuery = 'SELECT id FROM mlm_registrations WHERE username = ?';
        const [existingUserResult] = await connection.execute(existingUserQuery, [data.username]);
        const existingUserId = existingUserResult.length > 0 ? existingUserResult[0].id : null;
        
        // Check for duplicate username
        if (existingUserId) {
            throw new Error('Username already exists');
        }
        
        // Validate country and region
        const locationQuery = `
            SELECT c.name as country_name, r.name as region_name 
            FROM countries c 
            LEFT JOIN regions r ON c.id = r.country_id 
            WHERE c.id = ? AND r.id = ? AND c.status = 'active' AND r.status = 'active'
        `;
        const [locationResult] = await connection.execute(locationQuery, [data.country_id, data.region_id]);
        
        if (locationResult.length === 0) {
            throw new Error('Invalid country or region selected');
        }
        
        // Insert registration
        const insertQuery = `
            INSERT INTO mlm_registrations (
                username, sponsor_username, placement_leg,
                existing_user_id, first_name, last_name, full_name, 
                email, phone, date_of_birth, country_id, region_id, 
                package_id, password_hash, transaction_pin_hash,
                withdrawal_details, registered_by, total_amount
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;
        
        const values = [
            data.username,
            data.sponsor_username,
            data.placement_leg,
            existingUserId,
            data.first_name,
            data.last_name,
            data.full_name,
            data.email,
            data.phone,
            data.date_of_birth,
            data.country_id,
            data.region_id,
            data.package_id || null,
            data.password_hash,
            data.transaction_pin_hash,
            data.withdrawal_details ? JSON.stringify(data.withdrawal_details) : null,
            data.registered_by,
            data.total_amount || 0
        ];
        
        const [insertResult] = await connection.execute(insertQuery, values);
        const registrationId = insertResult.insertId;
        
        // Get the inserted registration details
        const getRegistrationQuery = `
            SELECT 
                mr.*,
                c.name as country_name,
                r.name as region_name
            FROM mlm_registrations mr
            LEFT JOIN countries c ON mr.country_id = c.id
            LEFT JOIN regions r ON mr.region_id = r.id
            WHERE mr.id = ?
        `;
        const [registrationResult] = await connection.execute(getRegistrationQuery, [registrationId]);
        const registration = registrationResult[0];
        
        // Insert into tree structure if placement leg is specified
        if (data.placement_leg && (data.placement_leg === 'left' || data.placement_leg === 'right')) {
            const placementUserId = placementResult[0].id;
            
            // Insert the new user into the tree
            const treeInsertQuery = `
                INSERT INTO tree (user_id, username, parent_user_id)
                VALUES (?, ?, ?)
            `;
            await connection.execute(treeInsertQuery, [
                registrationId,
                data.username,
                placementUserId
            ]);
            
            // Update placement user's leg
            const legField = data.placement_leg === 'left' ? 'left_leg_user_id' : 'right_leg_user_id';
            const updatePlacementQuery = `
                UPDATE tree 
                SET ${legField} = ? 
                WHERE user_id = ?
            `;
            await connection.execute(updatePlacementQuery, [registrationId, placementUserId]);
        }
        
        // Initialize PV and BV for the new user
        const initPvQuery = `
            INSERT INTO user_pv (user_id, left_leg_pv, right_leg_pv)
            VALUES (?, 0, 0)
        `;
        await connection.execute(initPvQuery, [registrationId]);
        
        const initBvQuery = `
            INSERT INTO user_bv (user_id, left_leg_bv, right_leg_bv)
            VALUES (?, 0, 0)
        `;
        await connection.execute(initBvQuery, [registrationId]);
        
        await connection.commit();
        
        return {
            id: registration.id,
            username: registration.username,
            fullName: registration.full_name,
            email: registration.email,
            phone: registration.phone,
            sponsorUsername: registration.sponsor_username,
            placementLeg: registration.placement_leg,
            countryName: registration.country_name,
            regionName: registration.region_name,
            registeredAt: registration.created_at
        };
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Find registration by username
const findByUsername = async (username) => {
    const query = `
        SELECT 
            mr.*,
            c.name as country_name,
            r.name as region_name,
            p.name as package_name,
            p.pv as package_pv
        FROM mlm_registrations mr
        LEFT JOIN countries c ON mr.country_id = c.id
        LEFT JOIN regions r ON mr.region_id = r.id
        LEFT JOIN packages p ON mr.package_id = p.id
        WHERE mr.username = ?
    `;
    
    const [result] = await pool.execute(query, [username]);
    return result[0];
};

// Find registration by ID
const findById = async (id) => {
    const query = `
        SELECT 
            mr.*,
            c.name as country_name,
            r.name as region_name,
            p.name as package_name,
            p.pv as package_pv
        FROM mlm_registrations mr
        LEFT JOIN countries c ON mr.country_id = c.id
        LEFT JOIN regions r ON mr.region_id = r.id
        LEFT JOIN packages p ON mr.package_id = p.id
        WHERE mr.id = ?
    `;
    
    const [result] = await pool.execute(query, [id]);
    return result[0];
};

// Get user's downline (tree structure)
const getUserDownline = async (userId) => {
    const query = `
        SELECT 
            t.*,
            mr.first_name,
            mr.last_name,
            mr.email,
            mr.phone,
            mr.created_at as registration_date
        FROM tree t
        LEFT JOIN mlm_registrations mr ON t.user_id = mr.id
        WHERE t.parent_user_id = ?
        ORDER BY t.registration_date ASC
    `;
    
    const [result] = await pool.execute(query, [userId]);
    return result;
};

// Get user's upline
const getUserUpline = async (userId) => {
    const query = `
        SELECT 
            mr.*,
            c.name as country_name,
            r.name as region_name
        FROM tree t
        JOIN mlm_registrations mr ON t.parent_user_id = mr.id
        LEFT JOIN countries c ON mr.country_id = c.id
        LEFT JOIN regions r ON mr.region_id = r.id
        WHERE t.user_id = ?
    `;
    
    const [result] = await pool.execute(query, [userId]);
    return result[0];
};

// Update registration
const update = async (id, data) => {
    const connection = await pool.getConnection();
    try {
        const fields = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                if (key === 'withdrawal_details' && typeof data[key] === 'object') {
                    values.push(JSON.stringify(data[key]));
                } else {
                    values.push(data[key]);
                }
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE mlm_registrations 
            SET ${fields.join(', ')}
            WHERE id = ?
        `;

        await connection.execute(query, values);
        
        // Return updated record
        return await findById(id);
    } finally {
        connection.release();
    }
};

// Get registration statistics
const getStats = async () => {
    const queries = [
        'SELECT COUNT(*) as total_registrations FROM mlm_registrations',
        'SELECT COUNT(*) as active_registrations FROM mlm_registrations WHERE registration_status = "completed"',
        'SELECT COUNT(*) as pending_registrations FROM mlm_registrations WHERE registration_status = "pending"',
        'SELECT COUNT(DISTINCT country_id) as countries_count FROM mlm_registrations'
    ];
    
    const results = await Promise.all(
        queries.map(query => pool.execute(query))
    );
    
    return {
        totalRegistrations: results[0][0][0].total_registrations,
        activeRegistrations: results[1][0][0].active_registrations,
        pendingRegistrations: results[2][0][0].pending_registrations,
        countriesCount: results[3][0][0].countries_count
    };
};

module.exports = {
    create,
    findByUsername,
    findById,
    getUserDownline,
    getUserUpline,
    update,
    getStats
};