import { Router } from 'express';
import { createIFSCheckIn, syncIFSCheckIns, getIFSCheckIns } from '../controllers/ifs.controller.memory';
import { optionalAuth } from '../middleware/auth.middleware';
import { ifsRateLimiter, syncRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * POST /ifs/checkin
 * Create a single IFS check-in
 */
router.post('/checkin', ifsRateLimiter, optionalAuth, createIFSCheckIn);

/**
 * POST /ifs/sync
 * Sync multiple IFS check-ins (batch create)
 */
router.post('/sync', syncRateLimiter, optionalAuth, syncIFSCheckIns);

/**
 * GET /ifs/checkins
 * Get IFS check-ins with pagination
 */
router.get('/checkins', ifsRateLimiter, optionalAuth, getIFSCheckIns);

export default router;
