"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = __importDefault(require("./config/database"));
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, database_1.default)();
        // Start Express server
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════');
            console.log('🚀 Bill Splitter API Server Started Successfully!');
            console.log('═══════════════════════════════════════════════════════');
            console.log(`📡 Server running on: http://localhost:${config_1.default.port}`);
            console.log(`🌍 Environment: ${config_1.default.nodeEnv}`);
            console.log(`📊 API Health Check: http://localhost:${config_1.default.port}/api/health`);
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
        });
        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);
            server.close(() => {
                console.log('✅ HTTP server closed.');
                process.exit(0);
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('❌ Forcing shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
// Start the server
startServer();
//# sourceMappingURL=server.js.map