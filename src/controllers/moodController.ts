import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getMoodCheckIns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = '30', offset = '0' } = req.query;

    const checkIns = await prisma.moodCheckIn.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(checkIns);
  } catch (error) {
    console.error('Get mood check-ins error:', error);
    res.status(500).json({ error: 'Failed to fetch mood check-ins' });
  }
};

export const createMoodCheckIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { mood, intensity, notes, tags } = req.body;

    const checkIn = await prisma.moodCheckIn.create({
      data: {
        userId: req.userId as string,
        mood,
        intensity,
        notes,
        tags: tags || [],
      },
    });

    res.status(201).json(checkIn);
  } catch (error) {
    console.error('Create mood check-in error:', error);
    res.status(500).json({ error: 'Failed to create mood check-in' });
  }
};

export const getMoodStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = '7' } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const checkIns = await prisma.moodCheckIn.findMany({
      where: {
        userId: req.userId,
        createdAt: { gte: daysAgo },
      },
      select: {
        mood: true,
        intensity: true,
        createdAt: true,
      },
    });

    const stats = {
      count: checkIns.length,
      averageIntensity: checkIns.length > 0
        ? checkIns.reduce((sum: number, c: any) => sum + c.intensity, 0) / checkIns.length
        : 0,
      moodDistribution: checkIns.reduce((acc: Record<string, number>, c: any) => {
        acc[c.mood] = (acc[c.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json(stats);
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to fetch mood stats' });
  }
};
