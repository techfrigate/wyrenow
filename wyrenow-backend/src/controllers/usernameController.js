const { errorResponse, successResponse } = require('../utils/helpers');
const usernameService = require('../services/usernameService');
/**
 * Validates a user by username through the wyrenow API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUserDetails = async (req, res, next) => {
  const { username } = req.body;
   console.log("username",username)
  try {
  
    if (!username) {
       return errorResponse(res, {
            message: 'Username is required',
            success: false, 
        }, 400);
    }
    const userData = await usernameService.getUserDetails(username);
     successResponse(res, {
            message: 'User fetched successfully',
            data: userData
        });
  } catch (error) {
    console.log(error)
      next(error);
  }
};

module.exports = {
  getUserDetails
};