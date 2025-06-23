const bcrypt = require('bcryptjs');
const config = require('../config/environment');

const hashPassword = async (password) => {
    return await bcrypt.hash(password, config.BCRYPT_ROUNDS);
};

const successResponse = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        ...data
    });
};

const errorResponse = (res, data, statusCode = 400) => {
    res.status(statusCode).json({
        success: false,
        ...data
    });
};

module.exports = {
    hashPassword,
    successResponse,
    errorResponse
};