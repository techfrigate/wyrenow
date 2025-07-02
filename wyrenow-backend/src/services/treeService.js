const { 
    getCompleteTreeData,
    getBinaryTreeStats
} = require('../repository/Tree');
 
const buildTreeFromFlatData = (flatData, rootUserId) => {
    // Create lookup maps for O(1) access
    const userMap = new Map();
    const parentChildMap = new Map();

    // First pass: Create user objects and parent-child relationships
    flatData.forEach(row => {
        const userNode = {
            id: row.user_id,
            username: row.username,
            firstName: row.first_name,
            lastName: row.last_name,
            sponsorUsername: row.sponsor_username,
            email: row.email,
            phone: row.phone,
            level: row.level,
            pvData: {
                leftPV: row.left_leg_pv || 0,
                rightPV: row.right_leg_pv || 0,
                totalPV: row.total_pv || 0
            },
            bvData: {
                leftBV: row.left_leg_bv || 0,
                rightBV: row.right_leg_bv || 0,
                totalBV: row.total_bv || 0
            },
            children: {
                left: null,
                right: null
            }
        };

        userMap.set(row.user_id, userNode);

        // Store parent-child relationships
        if (row.left_leg_user_id) {
            if (!parentChildMap.has(row.user_id)) {
                parentChildMap.set(row.user_id, {});
            }
            parentChildMap.get(row.user_id).left = row.left_leg_user_id;
        }

        if (row.right_leg_user_id) {
            if (!parentChildMap.has(row.user_id)) {
                parentChildMap.set(row.user_id, {});
            }
            parentChildMap.get(row.user_id).right = row.right_leg_user_id;
        }
    });

    // Second pass: Build tree relationships
    parentChildMap.forEach((children, parentId) => {
        const parentNode = userMap.get(parentId);
        if (parentNode) {
            if (children.left && userMap.has(children.left)) {
                parentNode.children.left = userMap.get(children.left);
            }
            if (children.right && userMap.has(children.right)) {
                parentNode.children.right = userMap.get(children.right);
            }
        }
    });

    return userMap.get(rootUserId) || null;
};


const getBinaryTreeWithStats = async (userId) => {
    try {
        // Get tree data and stats in parallel
        const [treeData, statsData] = await Promise.all([
            getCompleteTreeData(userId),
            getBinaryTreeStats(userId)
        ]);
        
        if (!treeData || treeData.length === 0) {
            return null;
        }

        // Build tree structure
        const treeStructure = buildTreeFromFlatData(treeData, userId);

        // Format stats data
        const dashboardStats = {
            leftLeg: {
                pv: statsData?.left_pv || 0,
                bv: statsData?.left_bv || 0
            },
            rightLeg: {
                pv: statsData?.right_pv || 0,
                bv: statsData?.right_bv || 0
            },
            totalPairs: {
                count: statsData?.total_pairs || 0,
                thisWeek: statsData?.this_week_pairs || 0
            },
            teamMembers: {
                count: statsData?.total_team_members || 0,
                thisWeek: statsData?.this_week_members || 0
            }
        };

        return {
            tree: treeStructure,
            stats: dashboardStats
        };

    } catch (error) {
        throw error;
    }
};


module.exports = {
    getBinaryTreeWithStats
};