const { Pool } = require('pg');
const config = require('./environment');

let pool;

const initDatabase = async () => {
    try {
        pool = new Pool(config.DB_CONFIG);
        
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        
        if (config.NODE_ENV === 'development') {
            console.log('Executed query', { text, duration, rows: res.rowCount });
        }
        
        return res;
    } catch (error) {
        console.error('Database query error:', { text, error: error.message });
        throw error;
    }
};

const getClient = async () => {
    return await pool.connect();
};

const close = async () => {
    if (pool) {
        await pool.end();
        console.log('🔌 Database connection closed');
    }
};

// Initialize database connection
initDatabase();

module.exports = {
    query,
    getClient,
    close
};