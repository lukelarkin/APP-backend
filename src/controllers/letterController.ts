import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getLetters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const letters = await prisma.lovedOneLetter.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(letters);
  } catch (error) {
    console.error('Get letters error:', error);
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
};

export const createLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { recipient, content } = req.body;

    const letter = await prisma.lovedOneLetter.create({
      data: {
        userId: req.userId as string,
        recipient,
        content,
      },
    });

    res.status(201).json(letter);
  } catch (error) {
    console.error('Create letter error:', error);
    res.status(500).json({ error: 'Failed to create letter' });
  }
};

export const updateLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, isDelivered } = req.body;

    const letter = await prisma.lovedOneLetter.findFirst({
      where: { id, userId: req.userId },
    });

    if (!letter) {
      res.status(404).json({ error: 'Letter not found' });
      return;
    }

    const updated = await prisma.lovedOneLetter.update({
      where: { id },
      data: {
        content,
        isDelivered,
        deliveredAt: isDelivered ? new Date() : null,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update letter error:', error);
    res.status(500).json({ error: 'Failed to update letter' });
  }
};

export const deleteLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const letter = await prisma.lovedOneLetter.findFirst({
      where: { id, userId: req.userId },
    });

    if (!letter) {
      res.status(404).json({ error: 'Letter not found' });
      return;
    }

    await prisma.lovedOneLetter.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete letter error:', error);
    res.status(500).json({ error: 'Failed to delete letter' });
  }
};
