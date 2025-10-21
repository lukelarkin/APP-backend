import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getArchetypes,
  createArchetype,
  updateArchetype,
  deleteArchetype,
} from '../controllers/archetypeController';

const router = Router();

router.get('/', authenticate, getArchetypes);
router.post(
  '/',
  authenticate,
  [
    body('archetype').notEmpty().isString(),
    body('strength').optional().isInt({ min: 0, max: 100 }),
    body('description').optional().isString(),
  ],
  createArchetype
);
router.put(
  '/:id',
  authenticate,
  [
    body('strength').optional().isInt({ min: 0, max: 100 }),
    body('isActive').optional().isBoolean(),
    body('description').optional().isString(),
  ],
  updateArchetype
);
router.delete('/:id', authenticate, deleteArchetype);

export default router;
