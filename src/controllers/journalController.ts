import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getJournalEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = '30', offset = '0' } = req.query;

    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(entries);
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

export const createJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { title, content, mood, tags, isPrivate } = req.body;

    const entry = await prisma.journalEntry.create({
      data: {
        userId: req.userId as string,
        title,
        content,
        mood,
        tags: tags || [],
        isPrivate: isPrivate !== undefined ? isPrivate : true,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
};

export const updateJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags, isPrivate } = req.body;

    const entry = await prisma.journalEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!entry) {
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        title,
        content,
        mood,
        tags,
        isPrivate,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
};

export const deleteJournalEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.journalEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!entry) {
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    await prisma.journalEntry.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};
