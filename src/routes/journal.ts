import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journalController';

const router = Router();

router.get('/', authenticate, getJournalEntries);
router.post(
  '/',
  authenticate,
  [
    body('title').optional().isString(),
    body('content').notEmpty().isString(),
    body('mood').optional().isString(),
    body('tags').optional().isArray(),
    body('isPrivate').optional().isBoolean(),
  ],
  createJournalEntry
);
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().isString(),
    body('content').optional().isString(),
    body('mood').optional().isString(),
    body('tags').optional().isArray(),
    body('isPrivate').optional().isBoolean(),
  ],
  updateJournalEntry
);
router.delete('/:id', authenticate, deleteJournalEntry);

export default router;
