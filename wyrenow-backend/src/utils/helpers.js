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

class HttpError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const generateHash = async () => {
    const password = 'WyrenowMLM@Password';
    const saltRounds = 12;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password:', password);
        console.log('Generated Hash:', hash);
        
        // Verify the hash works
        const isValid = await bcrypt.compare(password, hash);
        console.log('Hash verification:', isValid);
        
        return hash;
    } catch (error) {
        console.error('Error generating hash:', error);
    }
};
// generateHash();

module.exports = {
    hashPassword,
    successResponse,
    errorResponse,
    HttpError
};