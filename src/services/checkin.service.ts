import prisma from '../config/database';
import { CheckInDto } from '../types';

export class CheckInService {
  async createCheckIn(userId: string, data: CheckInDto) {
    const checkIn = await prisma.checkIn.create({
      data: {
        userId,
        part: data.part,
        emotion: data.emotion,
        quadrant: data.quadrant,
        intensity: data.intensity,
        notes: data.notes,
      },
    });

    // Update self_led streak
    await this.updateStreak(userId);

    return checkIn;
  }

  async getCheckIns(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.checkIn.count({ where: { userId } }),
    ]);

    return {
      checkIns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStreaks(userId: string) {
    const streaks = await prisma.streak.findMany({
      where: { userId },
    });

    return streaks.reduce(
      (acc, streak) => {
        acc[streak.type] = {
          current: streak.current,
          best: streak.best,
          lastCheck: streak.lastCheck,
        };
        return acc;
      },
      {} as Record<string, { current: number; best: number; lastCheck: Date }>
    );
  }

  private async updateStreak(userId: string) {
    const streak = await prisma.streak.findUnique({
      where: {
        userId_type: {
          userId,
          type: 'self_led',
        },
      },
    });

    if (!streak) return;

    const now = new Date();
    const lastCheck = new Date(streak.lastCheck);
    const hoursSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

    let newCurrent = streak.current;
    if (hoursSinceLastCheck < 24) {
      // Same day or within 24 hours
      newCurrent = streak.current;
    } else if (hoursSinceLastCheck < 48) {
      // Next day, increment streak
      newCurrent = streak.current + 1;
    } else {
      // Streak broken, reset to 1
      newCurrent = 1;
    }

    const newBest = Math.max(newCurrent, streak.best);

    await prisma.streak.update({
      where: {
        userId_type: {
          userId,
          type: 'self_led',
        },
      },
      data: {
        current: newCurrent,
        best: newBest,
        lastCheck: now,
      },
    });
  }
}

export default new CheckInService();
