require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    WYRENOW_URL : process.env.WYRENOW_URL || 'http://wyrenow.com/wyrenow/API/W_validation.php',
    
    // Database (MySQL Configuration)
    DB_CONFIG: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'wyrenow_db',
        // MySQL specific connection options
        connectionLimit: process.env.DB_MAX_CONNECTIONS || 20,
        acquireTimeout: process.env.DB_CONNECTION_TIMEOUT || 60000,
        timeout: process.env.DB_IDLE_TIMEOUT || 60000,
        reconnect: true,
        charset: 'utf8mb4'
    },
    
    // Security
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    
    // Rate Limiting
    RATE_LIMIT: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
        max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
    },
    
    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};