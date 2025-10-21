import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getPushTokens = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { userId: req.userId, isActive: true },
    });

    res.json(tokens);
  } catch (error) {
    console.error('Get push tokens error:', error);
    res.status(500).json({ error: 'Failed to fetch push tokens' });
  }
};

export const registerPushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { token, platform } = req.body;

    // Check if token already exists for this user
    const existingToken = await prisma.pushToken.findUnique({
      where: { token },
    });

    if (existingToken) {
      // Update existing token
      const updated = await prisma.pushToken.update({
        where: { token },
        data: {
          userId: req.userId as string,
          platform,
          isActive: true,
        },
      });
      res.json(updated);
      return;
    }

    // Create new token
    const newToken = await prisma.pushToken.create({
      data: {
        userId: req.userId as string,
        token,
        platform,
      },
    });

    res.status(201).json(newToken);
  } catch (error) {
    console.error('Register push token error:', error);
    res.status(500).json({ error: 'Failed to register push token' });
  }
};

export const deactivatePushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const existingToken = await prisma.pushToken.findFirst({
      where: { token, userId: req.userId },
    });

    if (!existingToken) {
      res.status(404).json({ error: 'Token not found' });
      return;
    }

    const updated = await prisma.pushToken.update({
      where: { id: existingToken.id },
      data: { isActive: false },
    });

    res.json(updated);
  } catch (error) {
    console.error('Deactivate push token error:', error);
    res.status(500).json({ error: 'Failed to deactivate push token' });
  }
};

export const deletePushToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const existingToken = await prisma.pushToken.findFirst({
      where: { token, userId: req.userId },
    });

    if (!existingToken) {
      res.status(404).json({ error: 'Token not found' });
      return;
    }

    await prisma.pushToken.delete({ where: { id: existingToken.id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete push token error:', error);
    res.status(500).json({ error: 'Failed to delete push token' });
  }
};
