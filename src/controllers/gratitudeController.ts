import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getGratitudeEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = '30', offset = '0' } = req.query;

    const entries = await prisma.gratitudeEntry.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(entries);
  } catch (error) {
    console.error('Get gratitude entries error:', error);
    res.status(500).json({ error: 'Failed to fetch gratitude entries' });
  }
};

export const createGratitudeEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { content, category } = req.body;

    const entry = await prisma.gratitudeEntry.create({
      data: {
        userId: req.userId as string,
        content,
        category,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create gratitude entry error:', error);
    res.status(500).json({ error: 'Failed to create gratitude entry' });
  }
};

export const deleteGratitudeEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.gratitudeEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!entry) {
      res.status(404).json({ error: 'Gratitude entry not found' });
      return;
    }

    await prisma.gratitudeEntry.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete gratitude entry error:', error);
    res.status(500).json({ error: 'Failed to delete gratitude entry' });
  }
};
