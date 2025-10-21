import { Router } from 'express';
import triggerController from '../controllers/trigger.controller';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { triggerLimiter } from '../middleware/rateLimit.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/webhooks/trigger:
 *   post:
 *     summary: Process trigger event
 *     tags: [Triggers]
 *     security:
 *       - webhookAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               eventType:
 *                 type: string
 *               payload:
 *                 type: object
 *     responses:
 *       202:
 *         description: Trigger accepted for processing
 */
router.post(
  '/trigger',
  triggerLimiter,
  [body('userId').notEmpty(), body('eventType').notEmpty()],
  validate,
  triggerController.processTrigger
);

/**
 * @swagger
 * /api/v1/push/register:
 *   post:
 *     summary: Register push notification token
 *     tags: [Push]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pushToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push token registered successfully
 */
router.post(
  '/register',
  authenticate,
  [body('pushToken').notEmpty()],
  validate,
  userController.registerPushToken
);

export { router as webhookRoutes, router as pushRoutes };
