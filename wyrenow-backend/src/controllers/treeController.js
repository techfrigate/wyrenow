const { getBinaryTreeWithStats } = require('../services/treeService');
const { HttpError, successResponse } = require('../utils/helpers');

 
const getBinaryTreeController = async (req, res,next) => {
    try {
        const { userId } = req.params;

        if (!userId || isNaN(userId)) {
            throw new HttpError('Invalid user ID', 400);
        }

        const result = await getBinaryTreeWithStats(parseInt(userId));

        if (!result) {
            throw new HttpError('User not found or has no binary tree structure', 404);
        }

        successResponse(res,{
            data: result.tree,
            stats: result.stats
        });

    } catch (error) {
        next(error)
    }
};

module.exports = {
    getBinaryTreeController,
};