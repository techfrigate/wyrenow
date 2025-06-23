const db = require('../config/database');

const create = async (data) => {
    const client = await db.getClient();
    
    try {
        await client.query('BEGIN');
        
        // Validate sponsor exists
        const sponsorQuery = 'SELECT id FROM users WHERE username = $1';
        const sponsorResult = await client.query(sponsorQuery, [data.sponsor_username]);
        
        if (sponsorResult.rows.length === 0) {
            throw new Error('Sponsor username not found');
        }
        
        // Validate placement user exists  
        const placementQuery = 'SELECT id FROM users WHERE username = $1';
        const placementResult = await client.query(placementQuery, [data.placement_username]);
        
        if (placementResult.rows.length === 0) {
            throw new Error('Placement username not found');
        }
        
        // Check if user exists in ecom
        const existingUserQuery = 'SELECT id FROM users WHERE username = $1';
        const existingUserResult = await client.query(existingUserQuery, [data.username]);
        const existingUserId = existingUserResult.rows.length > 0 ? existingUserResult.rows[0].id : null;
        
        // Validate country and region
        const locationQuery = `
            SELECT c.name as country_name, r.name as region_name 
            FROM countries c 
            LEFT JOIN regions r ON c.id = r.country_id 
            WHERE c.id = $1 AND r.id = $2 AND c.is_active = true AND r.is_active = true
        `;
        const locationResult = await client.query(locationQuery, [data.country_id, data.region_id]);
        
        if (locationResult.rows.length === 0) {
            throw new Error('Invalid country or region selected');
        }
        
        // Insert registration
        const insertQuery = `
            INSERT INTO mlm_registrations (
                username, sponsor_username, placement_username, placement_leg,
                sponsor_user_id, placement_user_id, existing_user_id,
                first_name, last_name, full_name, email, phone, date_of_birth,
                country_id, region_id, password_hash, transaction_pin_hash,
                withdrawal_details, registered_by, total_amount
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) RETURNING id, username, created_at
        `;
        
        const values = [
            data.username,
            data.sponsor_username,
            data.placement_username,
            data.placement_leg,
            sponsorResult.rows[0].id,
            placementResult.rows[0].id,
            existingUserId,
            data.first_name,
            data.last_name,
            data.full_name,
            data.email,
            data.phone,
            data.date_of_birth,
            data.country_id,
            data.region_id,
            data.password_hash,
            data.transaction_pin_hash,
            data.withdrawal_details ? JSON.stringify(data.withdrawal_details) : null,
            data.registered_by,
            0
        ];
        
        const result = await client.query(insertQuery, values);
        const registration = result.rows[0];
        
        await client.query('COMMIT');
        
        return {
            id: registration.id,
            username: registration.username,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone,
            sponsorUsername: data.sponsor_username,
            placementUsername: data.placement_username,
            placementLeg: data.placement_leg,
            countryName: locationResult.rows[0].country_name,
            regionName: locationResult.rows[0].region_name,
            registeredAt: registration.created_at
        };
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    create
};