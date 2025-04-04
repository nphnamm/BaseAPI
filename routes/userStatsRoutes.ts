import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import {
  getUserStats,
  addXP,
  updateStreak,
  addCoins,
  addBadge,
  removeBadge,
  spendCoins
} from '../controllers/userStats.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get user stats
router.get('/', getUserStats);

// Add XP
router.post('/xp', addXP);

// Update streak
router.post('/streak', updateStreak);

// Add coins
router.post('/coins', addCoins);

// Spend coins
router.post('/spend-coins', spendCoins);

// Add badge
router.post('/badges', addBadge);

// Remove badge
router.delete('/badges', removeBadge);

export default router; 