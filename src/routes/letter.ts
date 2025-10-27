import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getLetters,
  createLetter,
  updateLetter,
  deleteLetter,
} from '../controllers/letterController';

const router = Router();

router.get('/', authenticate, getLetters);
router.post(
  '/',
  authenticate,
  [
    body('recipient').notEmpty().isString(),
    body('content').notEmpty().isString(),
  ],
  createLetter
);
router.put(
  '/:id',
  authenticate,
  [
    body('content').optional().isString(),
    body('isDelivered').optional().isBoolean(),
  ],
  updateLetter
);
router.delete('/:id', authenticate, deleteLetter);

export default router;
