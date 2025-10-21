import prisma from '../config/database';
import { AppError } from '../utils/response';

export class UserService {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        archetype: true,
        timezone: true,
        bedtime: true,
        settings: true,
        pushToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(
    userId: string,
    data: { timezone?: string; bedtime?: string; settings?: object }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        archetype: true,
        timezone: true,
        bedtime: true,
        settings: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateArchetype(userId: string, archetype: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { archetype },
      select: {
        id: true,
        email: true,
        archetype: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserStats(userId: string) {
    const [checkInsCount, streaks, lettersCount] = await Promise.all([
      prisma.checkIn.count({ where: { userId } }),
      prisma.streak.findMany({ where: { userId } }),
      prisma.lovedOneLetter.count({ where: { userId } }),
    ]);

    const selfLedStreak = streaks.find((s) => s.type === 'self_led');
    const abstinenceStreak = streaks.find((s) => s.type === 'abstinence');

    return {
      totalCheckIns: checkInsCount,
      selfLedStreak: {
        current: selfLedStreak?.current || 0,
        best: selfLedStreak?.best || 0,
      },
      abstinenceStreak: {
        current: abstinenceStreak?.current || 0,
        best: abstinenceStreak?.best || 0,
      },
      lettersCount,
    };
  }

  async registerPushToken(userId: string, pushToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { pushToken },
    });
  }
}

export default new UserService();
