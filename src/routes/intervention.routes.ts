import { Router } from 'express';
import interventionController from '../controllers/intervention.controller';
import { authenticate } from '../middleware/auth.middleware';
import { letterValidation, idParamValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/v1/interventions/{archetype}:
 *   get:
 *     summary: Get interventions for archetype
 *     tags: [Interventions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: archetype
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Warrior, Sage, Lover, Seeker]
 *     responses:
 *       200:
 *         description: Interventions retrieved successfully
 */
router.get('/:archetype', interventionController.getInterventions);

export default router;
