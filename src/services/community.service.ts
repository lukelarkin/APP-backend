import prisma from '../config/database';
import { CommunityMessageDto } from '../types';

export class CommunityService {
  async createMessage(userId: string, data: CommunityMessageDto) {
    const message = await prisma.communityMessage.create({
      data: {
        senderId: userId,
        recipientId: data.recipientId,
        messageType: data.messageType,
        content: data.content,
        isPublic: !data.recipientId, // Private if recipient specified
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            archetype: true,
          },
        },
      },
    });

    return message;
  }

  async getMessages(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.communityMessage.findMany({
        where: {
          OR: [
            { isPublic: true },
            { recipientId: userId },
            { senderId: userId },
          ],
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              archetype: true,
            },
          },
        },
      }),
      prisma.communityMessage.count({
        where: {
          OR: [
            { isPublic: true },
            { recipientId: userId },
            { senderId: userId },
          ],
        },
      }),
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRituals() {
    // Placeholder for future ritual functionality
    return {
      rituals: [
        {
          id: 'ritual-1',
          name: 'Morning Gratitude Circle',
          description: 'Start your day with collective appreciation',
          time: '08:00',
          participants: 0,
        },
        {
          id: 'ritual-2',
          name: 'Evening Reflection',
          description: 'Close the day with shared insights',
          time: '20:00',
          participants: 0,
        },
      ],
    };
  }

  async joinRitual(userId: string, ritualId: string) {
    // Placeholder - would create ritual participation record
    return {
      success: true,
      message: 'Successfully joined ritual',
      ritualId,
    };
  }
}

export default new CommunityService();
