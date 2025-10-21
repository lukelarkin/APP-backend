import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getMoodCheckIns,
  createMoodCheckIn,
  getMoodStats,
} from '../controllers/moodController';

const router = Router();

router.get('/', authenticate, getMoodCheckIns);
router.get('/stats', authenticate, getMoodStats);
router.post(
  '/',
  authenticate,
  [
    body('mood').notEmpty().isString(),
    body('intensity').isInt({ min: 1, max: 10 }),
    body('notes').optional().isString(),
    body('tags').optional().isArray(),
  ],
  createMoodCheckIn
);

export default router;
