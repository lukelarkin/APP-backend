import { Router } from 'express';
import communityController from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';
import { messageValidation, paginationValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     summary: Send a community message
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageType:
 *                 type: string
 *                 enum: [gratitude, support, ritual]
 *               content:
 *                 type: string
 *               recipientId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/', messageValidation, validate, communityController.createMessage);

/**
 * @swagger
 * /api/v1/messages:
 *   get:
 *     summary: Get community messages
 *     tags: [Community]
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
 *         description: Messages retrieved successfully
 */
router.get('/', paginationValidation, validate, communityController.getMessages);

export default router;
