import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getPushTokens,
  registerPushToken,
  deactivatePushToken,
  deletePushToken,
} from '../controllers/pushTokenController';

const router = Router();

router.get('/', authenticate, getPushTokens);
router.post(
  '/',
  authenticate,
  [
    body('token').notEmpty().isString(),
    body('platform').isIn(['ios', 'android']),
  ],
  registerPushToken
);
router.patch('/:token/deactivate', authenticate, deactivatePushToken);
router.delete('/:token', authenticate, deletePushToken);

export default router;
