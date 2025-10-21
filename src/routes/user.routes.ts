import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', userController.getProfile);

/**
 * @swagger
 * /api/v1/users/me:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timezone:
 *                 type: string
 *               bedtime:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/me', userController.updateProfile);

/**
 * @swagger
 * /api/v1/users/archetype:
 *   put:
 *     summary: Update user archetype
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               archetype:
 *                 type: string
 *                 enum: [Warrior, Sage, Lover, Seeker]
 *     responses:
 *       200:
 *         description: Archetype updated successfully
 */
router.put(
  '/archetype',
  [body('archetype').isIn(['Warrior', 'Sage', 'Lover', 'Seeker'])],
  validate,
  userController.updateArchetype
);

/**
 * @swagger
 * /api/v1/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', userController.getStats);

export default router;
