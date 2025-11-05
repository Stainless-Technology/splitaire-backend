"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const billRoutes_1 = __importDefault(require("./billRoutes"));
const router = (0, express_1.Router)();
// Health check endpoint
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Bill Splitter API is running successfully!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// API Routes
router.use('/auth', authRoutes_1.default);
router.use('/bills', billRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map