import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { getProfile, createOrUpdateProfile, getUser } from '../controllers/userController';

const router = Router();

router.get('/me', authenticate, getUser);
router.get('/profile', authenticate, getProfile);
router.put(
  '/profile',
  authenticate,
  [
    body('bio').optional().isString(),
    body('avatarUrl').optional().isURL(),
    body('timezone').optional().isString(),
    body('traumaBackground').optional().isString(),
    body('preferredArchetype').optional().isString(),
  ],
  createOrUpdateProfile
);

export default router;
