const MLMRegistration = require('../repository/MLMRegistration');
const { hashPassword, HttpError } = require('../utils/helpers');
const { pool } = require('../config/database');
const createMLMRegistration = async (data) => {
    const {
        username,
        sponsor_username,
        first_name,
        last_name,
        email,
        phone,
        package_id,
        country_id,
        region_id,
        password,
        transaction_pin,
        withdrawalDetails,
        placement_user_id,
        registeredBy,
        placementLeg
    } = data;

    // Hash passwords
    const hashedPassword = await hashPassword(password);
    const hashedTransactionPin = await hashPassword(transaction_pin);
    
    // Prepare registration data
    const registrationData = {
        username,
        sponsor_username: sponsor_username,
        first_name,
        last_name,
        full_name:`${first_name} ${last_name}`,
        email,
        phone,
        date_of_birth: "1985-01-15",
        country_id ,
        package_id,
        region_id ,
        password_hash: hashedPassword,
        transaction_pin_hash: hashedTransactionPin,
        withdrawal_details: withdrawalDetails,
        registered_by: 1,
        placement_user_id,
        placement_leg:placementLeg
      };    
     
    return await MLMRegistration.create(registrationData);
} 

const checkUsernameExists = async (username) => {
    return await MLMRegistration.findByUsername(username);
}; 

const checkSponsorPositions = async (sponsorId) => {
    return await MLMRegistration.checkSponsorPositions(sponsorId);
} 
 
async function findEmptySpaces(userId, leg) {
    try {
          
        if (leg !== 'left' && leg !== 'right') {
            throw new Error('Leg must be either "left" or "right"');
        }
 
        const availableCondition = leg === 'left' ? 'dl.left_leg_user_id IS NULL' : 'dl.right_leg_user_id IS NULL';
        const legColumn = leg === 'left' ? 'left_leg_user_id' : 'right_leg_user_id';
        
        const query = `
            WITH RECURSIVE downline_leg AS (
                -- Start with the root user
                SELECT 
                    user_id, username, left_leg_user_id, right_leg_user_id, 0 as depth
                FROM tree 
                WHERE user_id = ?
                
                UNION ALL
                
                -- Only follow the specified leg path
                SELECT 
                    t.user_id, t.username, t.left_leg_user_id, t.right_leg_user_id, d.depth + 1
                FROM tree t
                INNER JOIN downline_leg d ON t.user_id = d.${legColumn}
                WHERE d.depth < 15  -- Limit depth for performance
            )
            SELECT 
                dl.user_id,
                dl.username,
                mr.first_name,
                mr.last_name,
                mr.email,
                dl.depth as level
            FROM downline_leg dl
            JOIN mlm_registrations mr ON dl.user_id = mr.id
            WHERE ${availableCondition}
            ORDER BY dl.depth ASC
            LIMIT 1
        `;

        const [result] = await pool.execute(query, [userId]);
        
        if (result.length === 0) {
            return null;
        }

        const user = result[0];
        return {
            user_id: user.user_id,
            username: user.username,
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            available_position: leg,
            level: user.level
        };

    } catch (error) {
        throw error;
    }
} 

async function getUserbyusernameEmailPhone(username, email, phone) {
  return await MLMRegistration.getUserbyusernameEmailPhone(username, email, phone);
} 

module.exports = {
  createMLMRegistration,
  checkUsernameExists,
  checkSponsorPositions,
  findEmptySpaces,
  getUserbyusernameEmailPhone
};