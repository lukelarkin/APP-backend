import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createIFSCheckIn = async (req: AuthRequest, res: Response) => {
  try {
    const { partName, emotion, quadrant, intensity, burden, need, notes } = req.body;
    const userId = req.userId;

    // Validation
    if (!partName || !emotion || !quadrant || intensity === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: partName, emotion, quadrant, intensity' 
      });
    }

    if (typeof intensity !== 'number' || intensity < 1 || intensity > 10) {
      return res.status(400).json({ 
        error: 'Intensity must be a number between 1 and 10' 
      });
    }

    // Create check-in
    const checkIn = await prisma.partsCheckIn.create({
      data: {
        userId: userId || 1, // Default user for demo purposes
        partName,
        emotion,
        quadrant,
        intensity,
        burden,
        need,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'IFS check-in created successfully',
      checkIn,
    });
  } catch (error) {
    console.error('Error creating IFS check-in:', error);
    return res.status(500).json({ error: 'Failed to create check-in' });
  }
};

export const syncIFSCheckIns = async (req: AuthRequest, res: Response) => {
  try {
    const { checkIns } = req.body;
    const userId = req.userId;

    if (!Array.isArray(checkIns) || checkIns.length === 0) {
      return res.status(400).json({ 
        error: 'checkIns must be a non-empty array' 
      });
    }

    // Validate each check-in
    for (const checkIn of checkIns) {
      if (!checkIn.partName || !checkIn.emotion || !checkIn.quadrant || checkIn.intensity === undefined) {
        return res.status(400).json({ 
          error: 'Each check-in must have partName, emotion, quadrant, and intensity' 
        });
      }
    }

    // Create all check-ins in a transaction
    const createdCheckIns = await prisma.$transaction(
      checkIns.map((checkIn) =>
        prisma.partsCheckIn.create({
          data: {
            userId: userId || 1,
            partName: checkIn.partName,
            emotion: checkIn.emotion,
            quadrant: checkIn.quadrant,
            intensity: checkIn.intensity,
            burden: checkIn.burden,
            need: checkIn.need,
            notes: checkIn.notes,
            createdAt: checkIn.timestamp ? new Date(checkIn.timestamp) : new Date(),
          },
        })
      )
    );

    return res.status(200).json({
      message: `Successfully synced ${createdCheckIns.length} check-ins`,
      syncedCount: createdCheckIns.length,
      checkIns: createdCheckIns,
    });
  } catch (error) {
    console.error('Error syncing IFS check-ins:', error);
    return res.status(500).json({ error: 'Failed to sync check-ins' });
  }
};

export const getIFSCheckIns = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const checkIns = await prisma.partsCheckIn.findMany({
      where: userId ? { userId } : {},
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const totalCount = await prisma.partsCheckIn.count({
      where: userId ? { userId } : {},
    });

    return res.status(200).json({
      checkIns,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + checkIns.length < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching IFS check-ins:', error);
    return res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
};
