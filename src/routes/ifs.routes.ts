import { Router } from 'express';
import { createIFSCheckIn, syncIFSCheckIns, getIFSCheckIns } from '../controllers/ifs.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /ifs/checkin
 * Create a single IFS check-in
 */
router.post('/checkin', optionalAuth, createIFSCheckIn);

/**
 * POST /ifs/sync
 * Sync multiple IFS check-ins (batch create)
 */
router.post('/sync', optionalAuth, syncIFSCheckIns);

/**
 * GET /ifs/checkins
 * Get IFS check-ins with pagination
 */
router.get('/checkins', optionalAuth, getIFSCheckIns);

export default router;
