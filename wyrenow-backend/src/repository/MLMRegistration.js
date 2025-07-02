const { pool } = require('../config/database');
const { HttpError } = require('../utils/helpers');

const create = async (data) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // ===== STEP 1: VALIDATION =====
        
        // Check if username already exists
        const existingUserQuery = 'SELECT id FROM mlm_registrations WHERE username = ?';
        const [existingUserResult] = await connection.execute(existingUserQuery, [data.username]);
        if (existingUserResult.length > 0) {
            throw HttpError('Username already exists', 400);
        }

        // Validate sponsor/placement user (they are the same person)
        const sponsorQuery = 'SELECT id, username FROM mlm_registrations WHERE username = ?';
        const [sponsorResult] = await connection.execute(sponsorQuery, [data.sponsor_username]);
        if (sponsorResult.length === 0) {
            throw HttpError('Sponsor user not found', 404);
        }
        const legField = data.placement_leg === 'left' ? 'left_leg_user_id' : 'right_leg_user_id';
        const parentTreeQuery  = `SELECT *  FROM tree WHERE user_id = ? `;
        const [parentTreeResult] = await connection.execute(parentTreeQuery, [data.placement_user_id]);
        if (parentTreeResult[0][legField] !== null) {
           throw HttpError('Placement position is already taken', 400);
        }

        const sponsorData = sponsorResult[0];
        const sponsorId = sponsorData.id; // Same as placement_user_id

        // Validate country and region
        const locationQuery = `
            SELECT c.name as country_name, r.name as region_name, c.pv_rate
            FROM countries c 
            LEFT JOIN regions r ON c.id = r.country_id 
            WHERE c.id = ? AND r.id = ? AND c.status = 'active' AND r.status = 'active'
        `;
        const [locationResult] = await connection.execute(locationQuery, [data.country_id, data.region_id]);
        if (locationResult.length === 0) {
            throw HttpError('Invalid location selected', 400);
        }
        const countryData = locationResult[0];

        // Get package details
        const packageQuery = 'SELECT * FROM packages WHERE id = ? AND status = "active"';
        const [packageResult] = await connection.execute(packageQuery, [data.package_id]);
        if (packageResult.length === 0) {
             throw HttpError('Invalid package selected', 400);
        }
        const packageData = packageResult[0];

        // ===== STEP 2: SETUP PLACEMENT (SPONSOR = PLACEMENT PARENT) =====
        
        const placement = {
            parentId: data.placement_user_id, // Same as sponsor ID
            leg: data.placement_leg // 'left' or 'right' - chosen by user
        };
        
        // ===== STEP 3: CREATE USER REGISTRATION =====
        
        const insertQuery = `
            INSERT INTO mlm_registrations (
                username, sponsor_username, existing_user_id, 
                first_name, last_name, email, phone, country_id, region_id, package_id, total_amount,
                password_hash, transaction_pin_hash,
                withdrawal_details
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            data.username,
            data.sponsor_username,
            data.existing_user_id || null,
            data.first_name,
            data.last_name,
            data.email,
            data.phone,
            data.country_id,
            data.region_id,
            data.package_id,
            data.total_amount || packageData.price,
            data.password_hash,
            data.transaction_pin_hash,
            data.withdrawal_details ? JSON.stringify(data.withdrawal_details) : null,
        ];
        
        const [insertResult] = await connection.execute(insertQuery, values);
        const registrationId = insertResult.insertId;
        console.log('✅ Created user registration with ID:', registrationId);

        // ===== STEP 4: INSERT INTO BINARY TREE =====
        
        await insertIntoBinaryTree(connection, registrationId, data.username, placement);
        console.log('✅ Inserted into binary tree structure');

        // ===== STEP 5: INSERT INTO GENERATION TREE =====
        
        await insertIntoGenerationTree(connection, registrationId, data.placement_user_id);
        console.log('✅ Inserted into generation tree');

        // ===== STEP 6: INITIALIZE USER PV/BV =====
        
        await initializeUserMetrics(connection, registrationId);
        console.log('✅ Initialized user PV/BV metrics');

        // Initialize user wallet with registration bonus
        await initializeUserWallet(connection, registrationId);
        console.log('✅ Initialized user wallet');

        // ===== STEP 7: DISTRIBUTE PACKAGE PV/BV =====
        
        const packagePV = packageData.pv;
       const packageBV = packagePV; 

        await distributePVUpTree(connection, registrationId, packagePV, placement.parentId, placement.leg);
        await distributeBVUpTree(connection, registrationId, packageBV, placement.parentId, placement.leg);
        console.log('✅ Distributed PV/BV up the binary tree');

        // ===== STEP 8: CALCULATE AND DISTRIBUTE COMMISSIONS =====
        
        await calculateBinaryCommissions(connection, placement.parentId);
        await calculateGenerationBonuses(connection, sponsorId, packagePV, data.country_id);
        console.log('✅ Calculated and distributed commissions');

        // ===== STEP 9: GET FINAL REGISTRATION DATA =====
        
        const getRegistrationQuery = `
            SELECT 
                mr.*,
                c.name as country_name,
                r.name as region_name,
                p.name as package_name
            FROM mlm_registrations mr
            LEFT JOIN countries c ON mr.country_id = c.id
            LEFT JOIN regions r ON mr.region_id = r.id
            LEFT JOIN packages p ON mr.package_id = p.id
            WHERE mr.id = ?
        `;
        const [registrationResult] = await connection.execute(getRegistrationQuery, [registrationId]);
        const registration = registrationResult[0];

        await connection.commit();
        console.log('🎉 MLM registration completed successfully!');
        
        return {
            id: registration.id,
            username: registration.username,
            email: registration.email,
            phone: registration.phone,
            status: registration.status,
            sponsorUsername: registration.sponsor_username,
            placementLeg: placement.leg,
            placementParent: parentTreeResult[0].username,
            countryName: registration.country_name,
            regionName: registration.region_name,
            packageName: registration.package_name,
            packagePV: packagePV,
            packageBV: packageBV,
            registeredAt: registration.created_at
        };
        
    } catch (error) {
        await connection.rollback();
        console.error('❌ MLM registration failed:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}; 

// ===== HELPER FUNCTIONS =====

/**
 * Insert user into binary tree structure
 */
async function insertIntoBinaryTree(connection, userId, username, placement) {
    // Insert new node
    const treeInsertQuery = `
        INSERT INTO tree (user_id, username, parent_user_id, registration_date)
        VALUES (?, ?, ?, NOW())
    `;
    await connection.execute(treeInsertQuery, [userId, username, placement.parentId]);
    
    // Update parent's leg
    const legField = placement.leg === 'left' ? 'left_leg_user_id' : 'right_leg_user_id';
    const updateParentQuery = `UPDATE tree SET ${legField} = ? WHERE user_id = ?`;
    await connection.execute(updateParentQuery, [userId, placement.parentId]);
} 

/**
 * Insert user into generation tree
 */
async function insertIntoGenerationTree(connection, userId, uplineUserId) {
    const genTreeQuery = `
        INSERT INTO generation_tree (user_id, upline_user)
        VALUES (?, ?)
    `;
    await connection.execute(genTreeQuery, [userId, uplineUserId]);
} 

/**
 * Initialize user PV and BV metrics
 */
async function initializeUserMetrics(connection, userId) {
    const initPvQuery = `
        INSERT INTO user_pv (user_id, left_leg_pv, right_leg_pv)
        VALUES (?, 0, 0)
    `;
    await connection.execute(initPvQuery, [userId]);
    
    const initBvQuery = `
        INSERT INTO user_bv (user_id, left_leg_bv, right_leg_bv)
        VALUES (?, 0, 0)
    `;
    await connection.execute(initBvQuery, [userId]);
} 


async function initializeUserWallet(connection, userId) {

    const initWalletQuery = `
        INSERT INTO user_wallets (
            user_id, 
            registration_wallet, 
            repurchase_wallet, 
            cashout_bonus_account, 
            awaiting_wallet, 
            service_center_wallet, 
            megastore_wallet, 
            leadership_pool_wallet, 
            award_wallet,
            awaiting_wallet_last_release,
            total_withdrawn
        ) VALUES (?, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, NULL, 0.00)
    `;
    await connection.execute(initWalletQuery, [
        userId,    
    ]);
    
   
  
  } 

/**
 * Distribute PV up the binary tree
 */
async function distributePVUpTree(connection, newUserId, pv, parentId, leg) {
    let currentParentId = parentId;
    
    while (currentParentId) {
        // Update parent's leg PV
        const legField = leg === 'left' ? 'left_leg_pv' : 'right_leg_pv';
        const updatePvQuery = `
            UPDATE user_pv 
            SET ${legField} = ${legField} + ? 
            WHERE user_id = ?
        `;
        await connection.execute(updatePvQuery, [pv, currentParentId]);
        
        // Log PV transaction
        const logPvQuery = `
            INSERT INTO pv_logs (uid, updated_for_uid, message, added_pv, timestamp)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const message = `PV added from new registration: ${newUserId}`;
        await connection.execute(logPvQuery, [newUserId, currentParentId, message, pv]);
        
        // Get parent's parent for next iteration
        const parentQuery = 'SELECT parent_user_id, username FROM tree WHERE user_id = ?';
        const [parentResult] = await connection.execute(parentQuery, [currentParentId]);
        
        if (parentResult.length > 0 && parentResult[0].parent_user_id) {
            // Determine which leg this parent is on relative to grandparent
            const grandParentId = parentResult[0].parent_user_id;
            const legQuery = `
                SELECT 
                    CASE 
                        WHEN left_leg_user_id = ? THEN 'left'
                        WHEN right_leg_user_id = ? THEN 'right'
                        ELSE NULL
                    END as parent_leg
                FROM tree WHERE user_id = ?
            `;
            const [legResult] = await connection.execute(legQuery, [currentParentId, currentParentId, grandParentId]);
            
            if (legResult.length > 0 && legResult[0].parent_leg) {
                currentParentId = grandParentId;
                leg = legResult[0].parent_leg;
            } else {
                break;
            }
        } else {
            break;
        }
    }
} 

/**
 * Distribute BV up the binary tree
 */
async function distributeBVUpTree(connection, newUserId, bv, parentId, leg) {
    let currentParentId = parentId;
    
    while (currentParentId) {
        // Update parent's leg BV
        const legField = leg === 'left' ? 'left_leg_bv' : 'right_leg_bv';
        const updateBvQuery = `
            UPDATE user_bv 
            SET ${legField} = ${legField} + ? 
            WHERE user_id = ?
        `;
        await connection.execute(updateBvQuery, [bv, currentParentId]);
        
        // Log BV transaction
        const logBvQuery = `
            INSERT INTO bv_logs (uid, updated_for_uid, message, added_bv, timestamp)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const message = `BV added from new registration: ${newUserId}`;
        await connection.execute(logBvQuery, [newUserId, currentParentId, message, bv]);
        
        // Get parent's parent for next iteration
        const parentQuery = 'SELECT parent_user_id FROM tree WHERE user_id = ?';
        const [parentResult] = await connection.execute(parentQuery, [currentParentId]);
        
        if (parentResult.length > 0 && parentResult[0].parent_user_id) {
            // Determine which leg this parent is on
            const grandParentId = parentResult[0].parent_user_id;
            const legQuery = `
                SELECT 
                    CASE 
                        WHEN left_leg_user_id = ? THEN 'left'
                        WHEN right_leg_user_id = ? THEN 'right'
                        ELSE NULL
                    END as parent_leg
                FROM tree WHERE user_id = ?
            `;
            const [legResult] = await connection.execute(legQuery, [currentParentId, currentParentId, grandParentId]);
            
            if (legResult.length > 0 && legResult[0].parent_leg) {
                currentParentId = grandParentId;
                leg = legResult[0].parent_leg;
            } else {
                break;
            }
        } else {
            break;
        }
    }
} 

/**
 * Calculate binary commissions (simplified version)
 */
async function calculateBinaryCommissions(connection, userId) {
    // Get user's BV totals
    const bvQuery = 'SELECT left_leg_bv, right_leg_bv, total_bv FROM user_bv WHERE user_id = ?';
    const [bvResult] = await connection.execute(bvQuery, [userId]);
    
    if (bvResult.length > 0) {
        const { left_leg_bv, right_leg_bv } = bvResult[0];
        
        // Binary commission is typically based on weaker leg
        const weakerLeg = Math.min(left_leg_bv, right_leg_bv);
        const binaryCommission = weakerLeg * 0.1; // 10% of weaker leg
        
        if (binaryCommission > 0) {
            // Here you would typically:
            // 1. Check if user qualifies for binary bonus
            // 2. Add commission to user's wallet/earnings
            // 3. Log the commission transaction
            
            console.log(`Binary commission calculated for user ${userId}: ${binaryCommission}`);
        }
    }
} 

/**
 * Calculate generation bonuses (simplified version)
 */

async function calculateGenerationBonuses(connection, sponsorId, newUserPV, newUserCountryId) {
    try {
        // ===== STEP 1: GET SPONSOR DETAILS =====
        const sponsorQuery = `
            SELECT mr.id, mr.username, mr.country_id, c.name as country_name
            FROM mlm_registrations mr
            JOIN countries c ON mr.country_id = c.id
            WHERE mr.id = ?
        `;
        const [sponsorResult] = await connection.execute(sponsorQuery, [sponsorId]);
        
        if (sponsorResult.length === 0) {
            console.log('❌ Sponsor not found');
            return;
        }
        
        const sponsor = sponsorResult[0];
        
        // ===== STEP 2: APPLY CROSS-COUNTRY CAP IF NEEDED =====
        
        let effectivePV = newUserPV;
        /* -------------------------------------------- i will comment it letter  -----------------------------------------------------*/
        
        const isCrossCountry = sponsor.country_id !== newUserCountryId;
        
        if (isCrossCountry) {
            effectivePV = newUserPV * 0.30;  
            console.log(`🌍 Cross-country detected: ${newUserPV} PV → ${effectivePV} PV (30% cap applied)`);
        }
        
        // ===== STEP 3: DIRECT SPONSOR BONUS (DSB) - 30% =====
        const dsbRate = 0.30;
        const dsbBonus = effectivePV * dsbRate;
        
        if (dsbBonus > 0) {
            await distributeBonusToWallets(
                connection,
                sponsorId,
                dsbBonus,
                'DSB',
                `Direct Sponsor Bonus for new registration (${isCrossCountry ? 'Cross-country' : 'Same country'})`,
                newUserPV, // Original PV for logging
                effectivePV, // Effective PV after cap
                isCrossCountry
            );
            console.log(`✅ DSB for sponsor ${sponsorId}: ${dsbBonus} PV`);
        }
        
        // ===== STEP 4: INDIRECT SPONSOR BONUS (ISB) - Generations 2-6 =====
        const isbRates = {
            2: 0.05, // 2nd Gen: 5%
            3: 0.04, // 3rd Gen: 4%
            4: 0.02, // 4th Gen: 2%
            5: 0.02, // 5th Gen: 2%
            6: 0.02  // 6th Gen: 2%
        };
        
        let currentUplineId = sponsorId;
        let generation = 1;
        
        // Traverse up the generation tree for ISB
        while (currentUplineId && generation < 6) {
            // Get next upline
            const uplineQuery = 'SELECT upline_user FROM generation_tree WHERE user_id = ?';
            const [uplineResult] = await connection.execute(uplineQuery, [currentUplineId]);
            
            if (uplineResult.length > 0 && uplineResult[0].upline_user) {
                currentUplineId = uplineResult[0].upline_user;
                generation++;
                
                // Calculate ISB for this generation
                if (isbRates[generation]) {
                    // Get upline country for cross-country check
                    const uplineCountryQuery = 'SELECT country_id FROM mlm_registrations WHERE id = ?';
                    const [uplineCountryResult] = await connection.execute(uplineCountryQuery, [currentUplineId]);
                    
                    if (uplineCountryResult.length > 0) {
                        const uplineCountryId = uplineCountryResult[0].country_id;
                        const isUplineCrossCountry = uplineCountryId !== newUserCountryId;
                        
                        // Apply cross-country cap for upline if needed
                        let uplineEffectivePV = newUserPV;

/* -------------------------------------------- i will comment it letter it must to do -----------------------------------------------------*/

                        if (isUplineCrossCountry) {
                            uplineEffectivePV = newUserPV * 0.30;
                        }
                        
                        const isbBonus = uplineEffectivePV * isbRates[generation];
                        
                        if (isbBonus > 0) {
                            await distributeBonusToWallets(
                                connection,
                                currentUplineId,
                                isbBonus,
                                'ISB',
                                `Generation ${generation} Indirect Sponsor Bonus (${isUplineCrossCountry ? 'Cross-country' : 'Same country'})`,
                                newUserPV,
                                uplineEffectivePV,
                                isUplineCrossCountry
                            );
                            console.log(`✅ ISB Gen ${generation} for user ${currentUplineId}: ${isbBonus} PV`);
                        }
                    }
                }
            } else {
                break; // No more uplines
            }
        }
        
    } catch (error) {
        console.error('❌ Error calculating generation bonuses:', error);
        throw error;
    }
} 

/**
 * Distribute bonus to user's wallets with proper 80/20 split and logging
 */
async function distributeBonusToWallets(connection, userId, bonusAmount, bonusType, description, originalPV, effectivePV, isCrossCountry) {
 
    try {
        const cashoutAmount = bonusAmount * 0.80; // 80% to cashout
        const awaitingAmount = bonusAmount * 0.20; // 20% to awaiting
        
        // Update Cashout Bonus Account
        const updateCashoutQuery = `
            UPDATE user_wallets 
            SET cashout_bonus_account = cashout_bonus_account + ?
            WHERE user_id = ?
        `;
        await connection.execute(updateCashoutQuery, [cashoutAmount, userId]);
        
        // Update Awaiting Wallet
        const updateAwaitingQuery = `
            UPDATE user_wallets 
            SET awaiting_wallet = awaiting_wallet + ?
            WHERE user_id = ?
        `;
        await connection.execute(updateAwaitingQuery, [awaitingAmount, userId]);
        
        // Log the bonus transaction
        const logTransactionQuery = `
            INSERT INTO bonus_transactions (
                user_id, transaction_type, total_amount, cashout_amount, 
                awaiting_amount, pv_amount, description, 
                status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', NOW())
        `;
        await connection.execute(logTransactionQuery, [
            userId, bonusType, bonusAmount, cashoutAmount, awaitingAmount, originalPV, description
        ]);
        
        // Additional detailed log for cross-country tracking
        if (isCrossCountry) {
            const crossCountryLogQuery = `
                INSERT INTO bonus_transactions (
                    user_id, transaction_type, total_amount, cashout_amount,
                    awaiting_amount, pv_amount, description,
                    status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', NOW())
            `;
            const crossCountryDescription = `${description} | Original PV: ${originalPV}, Effective PV: ${effectivePV} (30% cap applied)`;
            await connection.execute(crossCountryLogQuery, [
                userId, bonusType, bonusAmount, cashoutAmount, 
                awaitingAmount, effectivePV, crossCountryDescription
            ]);
        }
        
        console.log(`💰 ${bonusType} distributed to user ${userId}: ${cashoutAmount} cashout + ${awaitingAmount} awaiting`);
        
    } catch (error) {
        console.error('❌ Error distributing bonus to wallets:', error);
        throw error;
    }
}
 
/**
 * Check if user qualifies for Indirect Sponsor Bonus
 * Basic qualification: user must exist and be active
 * You can add more complex qualification rules here
 */
// async function checkISBQualification(connection, userId, generation) {
//     try {
//         // Basic check: user exists and is active
//         const userQuery = `
//             SELECT id, package_id 
//             FROM mlm_registrations 
//             WHERE id = ? AND status = 'active'
//         `;
//         const [userResult] = await connection.execute(userQuery, [userId]);
        
//         if (userResult.length === 0) {
//             return false; // User doesn't exist or inactive
//         }
        
//         // Additional qualification rules can be added here:
//         // - Minimum package requirements for higher generations
//         // - Personal volume requirements
//         // - Team volume requirements
//         // - etc.
        
//         return true; // Qualified for now
        
//     } catch (error) {
//         console.error('❌ Error checking ISB qualification:', error);
//         return false;
//     }
// }


const findMLMUserByEmail = async (email) => {
  console.log('🔎 Finding MLM user by email:', email);
  const query =  `SELECT * FROM mlm_registrations WHERE email =?`;
  const [result] = await pool.execute(query, [email]);
  return result[0];
} 

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

 
const checkSponsorPositions = async (sponsorId) => {
  try {
    const query = `
      SELECT 
        t.user_id,
        m.username,
        CASE WHEN t.left_leg_user_id IS NULL THEN 'available' ELSE 'filled' END AS left_leg_status,
        CASE WHEN t.right_leg_user_id IS NULL THEN 'available' ELSE 'filled' END AS right_leg_status
      FROM 
        tree t
      JOIN 
        mlm_registrations m ON t.user_id = m.id
      WHERE 
        t.user_id = ?
    `;
    
    const [results] = await pool.query(query, [sponsorId]);
    
    if (results.length === 0) {
      return null;
    }
    
    return results[0];
  } catch (error) {
    throw error
  }
}; 

 
const getUserbyusernameEmailPhone= async (username, email, phone) => {
  const query = `SELECT * FROM mlm_registrations WHERE username = ? OR email = ? OR phone = ? `; 
  const result = await  pool.query(query, [username, email, phone]);
  return result[0];
} 

module.exports = {
    create,
    findByUsername,
    checkSponsorPositions,
  findMLMUserByEmail,
  getUserbyusernameEmailPhone
};

 

 