const {pool:db} = require('../config/database');

const getCompleteTreeData = async (rootUserId) => {
    try {
        // Single optimized recursive CTE query to get ENTIRE tree
        // No level limits - gets all descendants
        const query = `
            WITH RECURSIVE tree_hierarchy AS (
                -- Base case: Start with root user
                SELECT 
                    t.user_id,
                    t.username,
                    t.parent_user_id,
                    t.left_leg_user_id,
                    t.right_leg_user_id,
                    m.first_name,
                    m.last_name,
                    m.sponsor_username,
                    m.email,
                    m.phone,
                    COALESCE(pv.left_leg_pv, 0) as left_leg_pv,
                    COALESCE(pv.right_leg_pv, 0) as right_leg_pv,
                    COALESCE(pv.total_pv, 0) as total_pv,
                    COALESCE(bv.left_leg_bv, 0) as left_leg_bv,
                    COALESCE(bv.right_leg_bv, 0) as right_leg_bv,
                    COALESCE(bv.total_bv, 0) as total_bv,
                    0 as level
                FROM tree t
                JOIN mlm_registrations m ON t.user_id = m.id
                LEFT JOIN user_pv pv ON m.id = pv.user_id
                LEFT JOIN user_bv bv ON m.id = bv.user_id
                WHERE t.user_id = ?
                
                UNION ALL
                
                -- Recursive case: Get ALL children (no level limit)
                SELECT 
                    t.user_id,
                    t.username,
                    t.parent_user_id,
                    t.left_leg_user_id,
                    t.right_leg_user_id,
                    m.first_name,
                    m.last_name,
                    m.sponsor_username,
                    m.email,
                    m.phone,
                    COALESCE(pv.left_leg_pv, 0) as left_leg_pv,
                    COALESCE(pv.right_leg_pv, 0) as right_leg_pv,
                    COALESCE(pv.total_pv, 0) as total_pv,
                    COALESCE(bv.left_leg_bv, 0) as left_leg_bv,
                    COALESCE(bv.right_leg_bv, 0) as right_leg_bv,
                    COALESCE(bv.total_bv, 0) as total_bv,
                    th.level + 1
                FROM tree t
                JOIN mlm_registrations m ON t.user_id = m.id
                LEFT JOIN user_pv pv ON m.id = pv.user_id
                LEFT JOIN user_bv bv ON m.id = bv.user_id
                JOIN tree_hierarchy th ON (
                    t.user_id = th.left_leg_user_id OR 
                    t.user_id = th.right_leg_user_id
                )
                -- No level restriction - gets complete tree
            )
            SELECT * FROM tree_hierarchy
            ORDER BY level, user_id
        `;
        
        const [rows] = await db.execute(query, [rootUserId]);
        return rows;
        
    } catch (error) {
        throw error;
    }
};


const getBinaryTreeStats = async (userId) => {
    try {
        const query = `
            WITH RECURSIVE tree_hierarchy AS (
                SELECT 
                    t.user_id,
                    t.left_leg_user_id,
                    t.right_leg_user_id,
                    m.created_at,
                    0 as level
                FROM tree t
                JOIN mlm_registrations m ON t.user_id = m.id
                WHERE t.user_id = ?
                
                UNION ALL
                
                SELECT 
                    t.user_id,
                    t.left_leg_user_id,
                    t.right_leg_user_id,
                    m.created_at,
                    th.level + 1
                FROM tree t
                JOIN mlm_registrations m ON t.user_id = m.id
                JOIN tree_hierarchy th ON (
                    t.user_id = th.left_leg_user_id OR 
                    t.user_id = th.right_leg_user_id
                )
            ),
            root_data AS (
                SELECT 
                    COALESCE(pv.left_leg_pv, 0) as left_pv,
                    COALESCE(pv.right_leg_pv, 0) as right_pv,
                    COALESCE(bv.left_leg_bv, 0) as left_bv,
                    COALESCE(bv.right_leg_bv, 0) as right_bv
                FROM user_pv pv
                JOIN user_bv bv ON pv.user_id = bv.user_id
                WHERE pv.user_id = ?
            ),
            team_stats AS (
                SELECT 
                    COUNT(*) - 1 as total_team_members,
                    COUNT(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN 1 END) as this_week_members,
                    COUNT(CASE WHEN th.level > 0 THEN 1 END) as total_pairs
                FROM tree_hierarchy th
            ),
            weekly_pairs AS (
                SELECT 
                    COUNT(CASE WHEN th.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) AND th.level > 0 THEN 1 END) as this_week_pairs
                FROM tree_hierarchy th
            )
            SELECT 
                rd.left_pv,
                rd.right_pv,
                rd.left_bv,
                rd.right_bv,
                ts.total_team_members,
                ts.this_week_members,
                ts.total_pairs,
                wp.this_week_pairs
            FROM root_data rd
            CROSS JOIN team_stats ts
            CROSS JOIN weekly_pairs wp
        `;
        
        const [rows] = await db.execute(query, [userId, userId]);
        return rows[0] || null;
        
    } catch (error) {
       
        throw error;
    }
};



module.exports = {
    getCompleteTreeData,
    getBinaryTreeStats
};