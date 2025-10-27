import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getPartsCheckIns,
  createPartsCheckIn,
  getPartsByName,
} from '../controllers/partsController';

const router = Router();

router.get('/', authenticate, getPartsCheckIns);
router.get('/:partName', authenticate, getPartsByName);
router.post(
  '/',
  authenticate,
  [
    body('partName').notEmpty().isString(),
    body('emotion').notEmpty().isString(),
    body('message').optional().isString(),
    body('burden').optional().isString(),
    body('needs').optional().isString(),
  ],
  createPartsCheckIn
);

export default router;
