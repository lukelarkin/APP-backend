import { Router } from 'express';
import checkInController from '../controllers/checkin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkInValidation, paginationValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/checkins:
 *   post:
 *     summary: Create a new check-in
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part:
 *                 type: string
 *               emotion:
 *                 type: string
 *               quadrant:
 *                 type: string
 *               intensity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Check-in created successfully
 */
router.post('/', checkInValidation, validate, checkInController.createCheckIn);

/**
 * @swagger
 * /api/v1/checkins:
 *   get:
 *     summary: Get user check-ins
 *     tags: [CheckIns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Check-ins retrieved successfully
 */
router.get('/', paginationValidation, validate, checkInController.getCheckIns);

export default router;
