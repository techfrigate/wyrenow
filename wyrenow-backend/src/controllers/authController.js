const { successResponse, errorResponse } = require("../utils/helpers");
const authService = require("../services/authService");
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);

    return successResponse(res, {
      message: 'Logged in successfully',
      ...data
    });
  } catch (error) {
     next(error);
  }
};

module.exports = {
    login
};