import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getGratitudeEntries,
  createGratitudeEntry,
  deleteGratitudeEntry,
} from '../controllers/gratitudeController';

const router = Router();

router.get('/', authenticate, getGratitudeEntries);
router.post(
  '/',
  authenticate,
  [
    body('content').notEmpty().isString(),
    body('category').optional().isString(),
  ],
  createGratitudeEntry
);
router.delete('/:id', authenticate, deleteGratitudeEntry);

export default router;
