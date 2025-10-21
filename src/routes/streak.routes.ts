import { Router } from 'express';
import checkInController from '../controllers/checkin.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/streaks:
 *   get:
 *     summary: Get user streaks
 *     tags: [Streaks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streaks retrieved successfully
 */
router.get('/', checkInController.getStreaks);

export default router;
