import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getCommunityMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = '50', offset = '0' } = req.query;

    const messages = await prisma.communityMessage.findMany({
      where: { flagged: false },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Hide user info if anonymous
    const sanitized = messages.map((msg: any) => ({
      ...msg,
      user: msg.isAnonymous ? null : msg.user,
    }));

    res.json(sanitized);
  } catch (error) {
    console.error('Get community messages error:', error);
    res.status(500).json({ error: 'Failed to fetch community messages' });
  }
};

export const createCommunityMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { content, isAnonymous } = req.body;

    const message = await prisma.communityMessage.create({
      data: {
        userId: req.userId as string,
        content,
        isAnonymous: isAnonymous || false,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Create community message error:', error);
    res.status(500).json({ error: 'Failed to create community message' });
  }
};

export const likeCommunityMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.communityMessage.findUnique({
      where: { id },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const updated = await prisma.communityMessage.update({
      where: { id },
      data: {
        likes: message.likes + 1,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Like community message error:', error);
    res.status(500).json({ error: 'Failed to like message' });
  }
};

export const flagCommunityMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.communityMessage.findUnique({
      where: { id },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const updated = await prisma.communityMessage.update({
      where: { id },
      data: {
        flagged: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Flag community message error:', error);
    res.status(500).json({ error: 'Failed to flag message' });
  }
};

export const deleteCommunityMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await prisma.communityMessage.findFirst({
      where: { id, userId: req.userId },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found or not authorized' });
      return;
    }

    await prisma.communityMessage.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete community message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
