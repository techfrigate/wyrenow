const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config/environment');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
 

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit(config.RATE_LIMIT);
app.use(limiter);

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Compression
app.use(compression());
// runSqlFile('./migrations/001_create_tables.sql');
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV 
    });
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;