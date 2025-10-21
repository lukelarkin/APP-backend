import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getTriggers,
  createTrigger,
  updateTrigger,
  deleteTrigger,
  activateTrigger,
} from '../controllers/triggerController';

const router = Router();

router.get('/', authenticate, getTriggers);
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().isString(),
    body('description').optional().isString(),
    body('severity').isInt({ min: 1, max: 10 }),
    body('coping').optional().isString(),
    body('webhookUrl').optional().isURL(),
  ],
  createTrigger
);
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().isString(),
    body('description').optional().isString(),
    body('severity').optional().isInt({ min: 1, max: 10 }),
    body('coping').optional().isString(),
    body('webhookUrl').optional().isURL(),
    body('isActive').optional().isBoolean(),
  ],
  updateTrigger
);
router.post('/:id/activate', authenticate, activateTrigger);
router.delete('/:id', authenticate, deleteTrigger);

export default router;
