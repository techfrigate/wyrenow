require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    WYRENOW_URL : process.env.WYRENOW_URL || 'http://wyrenow.com/wyrenow/API/W_validation.php',
    
    // Database
    DB_CONFIG: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'wyrenow',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        max: process.env.DB_MAX_CONNECTIONS || 20,
        idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
        connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
    },
    
    // Security
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    
    // Rate Limiting
    RATE_LIMIT: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
        max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
    }
};
