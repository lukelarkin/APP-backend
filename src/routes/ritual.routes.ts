import { Router } from 'express';
import communityController from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';
import { idParamValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/rituals:
 *   get:
 *     summary: Get upcoming rituals
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rituals retrieved successfully
 */
router.get('/', communityController.getRituals);

/**
 * @swagger
 * /api/v1/rituals/{id}/join:
 *   post:
 *     summary: Join a ritual
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully joined ritual
 */
router.post('/:id/join', idParamValidation, validate, communityController.joinRitual);

export default router;
