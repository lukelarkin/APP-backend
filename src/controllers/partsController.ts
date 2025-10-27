import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getPartsCheckIns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = '30', offset = '0' } = req.query;

    const checkIns = await prisma.partsCheckIn.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json(checkIns);
  } catch (error) {
    console.error('Get parts check-ins error:', error);
    res.status(500).json({ error: 'Failed to fetch parts check-ins' });
  }
};

export const createPartsCheckIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { partName, emotion, message, burden, needs } = req.body;

    const checkIn = await prisma.partsCheckIn.create({
      data: {
        userId: req.userId as string,
        partName,
        emotion,
        message,
        burden,
        needs,
      },
    });

    res.status(201).json(checkIn);
  } catch (error) {
    console.error('Create parts check-in error:', error);
    res.status(500).json({ error: 'Failed to create parts check-in' });
  }
};

export const getPartsByName = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { partName } = req.params;

    const checkIns = await prisma.partsCheckIn.findMany({
      where: {
        userId: req.userId,
        partName,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(checkIns);
  } catch (error) {
    console.error('Get parts by name error:', error);
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
};
