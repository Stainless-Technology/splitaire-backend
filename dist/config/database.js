"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_1.default.mongoUri);
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected successfully');
        });
    }
    catch (error) {
        console.error('❌ MongoDB Connection Failed:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map