const app = require('./src/app');
const config = require('./src/config/environment');

const server = app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});