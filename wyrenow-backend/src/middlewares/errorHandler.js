const config = require('../config/environment');
const { errorResponse } = require('../utils/helpers');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: config.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method
    });

    // Database errors
    if (err.code === '23505') {
        return errorResponse(res, {
            message: 'Duplicate entry found',
            error: 'A record with this information already exists'
        }, 400);
    }

    if (err.code === '23503') {
        return errorResponse(res, {
            message: 'Referenced record not found',
            error: 'Invalid reference to related data'
        }, 400);
    }

    // Network/Connection errors
    if (err.code === 'ECONNREFUSED') {
        return errorResponse(res, {
            message: 'Database connection failed',
            error: 'Service temporarily unavailable'
        }, 503);
    }

    // Validation errors (from Joi or custom validation)
    if (err.name === 'ValidationError') {
        return errorResponse(res, {
            message: 'Validation error',
            error: err.message
        }, 400);
    }

    // JWT/Authentication errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, {
            message: 'Invalid token',
            error: 'Authentication failed'
        }, 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, {
            message: 'Token expired',
            error: 'Please login again'
        }, 401);
    }

    // Custom application errors (with statusCode)
    if (err.statusCode) {
        return errorResponse(res, {
            message: err.message,
            error: err.message
        }, err.statusCode);
    }

    // Default error (500 Internal Server Error)
    return errorResponse(res, {
        message: err.message || 'Internal Server Error',
        error: config.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
    }, 500);
};

module.exports = errorHandler;