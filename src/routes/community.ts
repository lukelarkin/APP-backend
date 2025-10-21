import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getCommunityMessages,
  createCommunityMessage,
  likeCommunityMessage,
  flagCommunityMessage,
  deleteCommunityMessage,
} from '../controllers/communityController';

const router = Router();

router.get('/', authenticate, getCommunityMessages);
router.post(
  '/',
  authenticate,
  [
    body('content').notEmpty().isString(),
    body('isAnonymous').optional().isBoolean(),
  ],
  createCommunityMessage
);
router.post('/:id/like', authenticate, likeCommunityMessage);
router.post('/:id/flag', authenticate, flagCommunityMessage);
router.delete('/:id', authenticate, deleteCommunityMessage);

export default router;
