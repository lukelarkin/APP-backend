import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const createOrUpdateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { bio, avatarUrl, timezone, traumaBackground, preferredArchetype } = req.body;

    const profile = await prisma.userProfile.upsert({
      where: { userId: req.userId as string },
      update: {
        bio,
        avatarUrl,
        timezone,
        traumaBackground,
        preferredArchetype,
      },
      create: {
        userId: req.userId as string,
        bio,
        avatarUrl,
        timezone,
        traumaBackground,
        preferredArchetype,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
