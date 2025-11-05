import { Router } from 'express';
import authRoutes from './authRoutes';
import billRoutes from './billRoutes';

const router = Router();

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
router.use('/auth', authRoutes);
router.use('/bills', billRoutes);

export default router;
