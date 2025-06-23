const mysql = require('mysql2/promise');
const config = require('./environment');

let pool;

const initDatabase = async () => {
    try {
        pool = mysql.createPool({
            host: config.DB_CONFIG.host,
            port: config.DB_CONFIG.port,
            user: config.DB_CONFIG.user,
            password: config.DB_CONFIG.password,
            database: config.DB_CONFIG.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            multipleStatements: true,
            dateStrings: true
        });
        
        // Test connection
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

const query = async (text, params = []) => {
    const start = Date.now();
    try {
        // Convert PostgreSQL $1, $2 syntax to MySQL ? syntax if needed
        const mysqlQuery = text.replace(/\$(\d+)/g, '?');
        
        const [rows, fields] = await pool.execute(mysqlQuery, params);
        const duration = Date.now() - start;
        
        if (config.NODE_ENV === 'development') {
            console.log('Executed query', { 
                text: mysqlQuery, 
                duration, 
                rows: Array.isArray(rows) ? rows.length : 0 
            });
        }
        
        // Return in PostgreSQL-like format for compatibility
        return {
            rows: rows,
            rowCount: Array.isArray(rows) ? rows.length : 0,
            fields: fields
        };
    } catch (error) {
        console.error('Database query error:', { text, error: error.message });
        throw error;
    }
};

const getClient = async () => {
    const connection = await pool.getConnection();
    
    // Return PostgreSQL-like interface
    return {
        query: async (text, params = []) => {
            const mysqlQuery = text.replace(/\$(\d+)/g, '?');
            const [rows, fields] = await connection.execute(mysqlQuery, params);
            return {
                rows: rows,
                rowCount: Array.isArray(rows) ? rows.length : 0,
                fields: fields
            };
        },
        release: () => {
            connection.release();
        }
    };
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
    close,
    pool // Export pool for direct access if needed
};