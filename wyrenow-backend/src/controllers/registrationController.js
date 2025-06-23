const registrationService = require('../services/registrationService');
const { successResponse } = require('../utils/helpers');

const registerUser = async (req, res, next) => {
    try {
        const registrationData = req.body;
        const result = await registrationService.createMLMRegistration(registrationData);
        
        successResponse(res, {
            message: 'User registered successfully in MLM system',
            data: result
        }, 201);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser
};
