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
 * /api/v1/letters:
 *   post:
 *     summary: Create a loved one letter
 *     tags: [Letters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *               author:
 *                 type: string
 *               audioUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Letter created successfully
 */
router.post('/', letterValidation, validate, interventionController.createLetter);

/**
 * @swagger
 * /api/v1/letters:
 *   get:
 *     summary: Get user's letters
 *     tags: [Letters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Letters retrieved successfully
 */
router.get('/', interventionController.getLetters);

/**
 * @swagger
 * /api/v1/letters/{id}:
 *   put:
 *     summary: Update a letter
 *     tags: [Letters]
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
 *         description: Letter updated successfully
 */
router.put('/:id', idParamValidation, validate, interventionController.updateLetter);

/**
 * @swagger
 * /api/v1/letters/{id}:
 *   delete:
 *     summary: Delete a letter
 *     tags: [Letters]
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
 *         description: Letter deleted successfully
 */
router.delete('/:id', idParamValidation, validate, interventionController.deleteLetter);

export default router;
