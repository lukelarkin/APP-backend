import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

// In-memory storage for demo purposes (replace with real database in production)
interface CheckIn {
  id: number;
  userId: number;
  partName: string;
  emotion: string;
  quadrant: string;
  intensity: number;
  burden?: string;
  need?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

let checkInsStore: CheckIn[] = [];
let nextId = 1;

export const createIFSCheckIn = async (req: AuthRequest, res: Response) => {
  try {
    const { partName, emotion, quadrant, intensity, burden, need, notes } = req.body;
    const userId = req.userId || 1;

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

    // Create check-in in memory
    const checkIn: CheckIn = {
      id: nextId++,
      userId,
      partName,
      emotion,
      quadrant,
      intensity,
      burden,
      need,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    checkInsStore.push(checkIn);

    return res.status(201).json({
      message: 'IFS check-in created successfully',
      checkIn: {
        ...checkIn,
        user: {
          id: userId,
          name: 'Demo User',
          email: 'demo@example.com',
        },
      },
    });
  } catch (error) {
    console.error('Error creating IFS check-in:', error);
    return res.status(500).json({ error: 'Failed to create check-in' });
  }
};

export const syncIFSCheckIns = async (req: AuthRequest, res: Response) => {
  try {
    const { checkIns } = req.body;
    const userId = req.userId || 1;

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

    // Create all check-ins in memory
    const createdCheckIns: CheckIn[] = checkIns.map((checkIn) => {
      const newCheckIn: CheckIn = {
        id: nextId++,
        userId,
        partName: checkIn.partName,
        emotion: checkIn.emotion,
        quadrant: checkIn.quadrant,
        intensity: checkIn.intensity,
        burden: checkIn.burden,
        need: checkIn.need,
        notes: checkIn.notes,
        createdAt: checkIn.timestamp ? new Date(checkIn.timestamp) : new Date(),
        updatedAt: new Date(),
      };
      checkInsStore.push(newCheckIn);
      return newCheckIn;
    });

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

    // Filter by userId if authenticated
    let filteredCheckIns = userId 
      ? checkInsStore.filter(c => c.userId === userId)
      : checkInsStore;

    // Sort by date descending
    filteredCheckIns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const paginatedCheckIns = filteredCheckIns.slice(offset, offset + limit);

    // Add user info
    const checkInsWithUser = paginatedCheckIns.map(checkIn => ({
      ...checkIn,
      user: {
        id: checkIn.userId,
        name: 'Demo User',
        email: 'demo@example.com',
      },
    }));

    return res.status(200).json({
      checkIns: checkInsWithUser,
      pagination: {
        total: filteredCheckIns.length,
        limit,
        offset,
        hasMore: offset + paginatedCheckIns.length < filteredCheckIns.length,
      },
    });
  } catch (error) {
    console.error('Error fetching IFS check-ins:', error);
    return res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
};
