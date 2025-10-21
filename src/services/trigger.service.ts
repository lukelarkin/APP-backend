import { Queue, Worker } from 'bullmq';
import prisma from '../config/database';
import config from '../config';
import { TriggerEventDto, Archetype } from '../types';
import logger from '../utils/logger';

const TRIGGER_QUEUE_NAME = 'trigger-processing';

export class TriggerService {
  private triggerQueue: Queue;

  constructor() {
    this.triggerQueue = new Queue(TRIGGER_QUEUE_NAME, {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
    });

    this.initializeWorker();
  }

  async processTrigger(data: TriggerEventDto) {
    // Store the trigger event
    const triggerEvent = await prisma.triggerEvent.create({
      data: {
        userId: data.userId,
        eventType: data.eventType,
        payload: (data.payload || {}) as Record<string, never>,
      },
    });

    // Queue for async processing
    await this.triggerQueue.add(
      'process-trigger',
      {
        triggerEventId: triggerEvent.id,
        userId: data.userId,
        eventType: data.eventType,
        payload: data.payload,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      }
    );

    return triggerEvent;
  }

  private initializeWorker() {
    const worker = new Worker(
      TRIGGER_QUEUE_NAME,
      async (job) => {
        const { triggerEventId, userId, eventType } = job.data;

        try {
          // Get user data
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              archetype: true,
              pushToken: true,
            },
          });

          if (!user) {
            logger.error(`User not found for trigger event: ${triggerEventId}`);
            return;
          }

          // Get recent check-in data for context
          const recentCheckIn = await prisma.checkIn.findFirst({
            where: { userId },
            orderBy: { timestamp: 'desc' },
          });

          // Generate intervention based on archetype and event type
          const intervention = this.selectIntervention(
            user.archetype as Archetype,
            eventType,
            recentCheckIn
          );

          // Format push notification
          const notification = this.formatNotification(user.archetype as Archetype, intervention);

          // Log notification (would send via Expo/FCM in production)
          logger.info('Push notification prepared:', {
            userId,
            archetype: user.archetype,
            eventType,
            notification,
            pushToken: user.pushToken,
          });

          // Update trigger event with response
          await prisma.triggerEvent.update({
            where: { id: triggerEventId },
            data: {
              interventionId: intervention.type,
              response: {
                notification,
                timestamp: new Date().toISOString(),
              },
            },
          });

          // In production, send via Expo Push Notifications
          if (config.features.enablePushNotifications && user.pushToken) {
            await this.sendPushNotification(user.pushToken, notification);
          }
        } catch (error) {
          logger.error('Error processing trigger:', error);
          throw error;
        }
      },
      {
        connection: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
        },
      }
    );

    worker.on('completed', (job) => {
      logger.info(`Trigger job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`Trigger job ${job?.id} failed:`, err);
    });
  }

  private selectIntervention(
    _archetype: Archetype,
    eventType: string,
    recentCheckIn: { emotion: string; quadrant: string; intensity: number } | null
  ) {
    // Simple intervention selection logic
    // In production, this would be more sophisticated

    // Select based on event type
    if (eventType.includes('late_night') || eventType.includes('hrv_spike')) {
      return { type: 'breathing', priority: 'high' };
    }

    if (recentCheckIn && recentCheckIn.intensity > 7) {
      return { type: 'letter', priority: 'high' };
    }

    // Default to journal for most triggers
    return { type: 'journal', priority: 'medium' };
  }

  private formatNotification(
    archetype: Archetype,
    intervention: { type: string; priority: string }
  ) {
    const archetypeMessages: Record<Archetype, Record<string, string>> = {
      Warrior: {
        letter: 'Take a breath, Warrior – your Loved One letter awaits',
        journal: 'Warrior, pause and reflect. Your journal is ready.',
        breathing: 'Ground yourself, Warrior. Time for a reset.',
        gratitude: 'Warrior, acknowledge your victories today.',
      },
      Sage: {
        letter: 'Wise one, a message from your loved ones calls to you',
        journal: 'Sage, what wisdom will you uncover today?',
        breathing: 'Center yourself, Sage. Find your calm.',
        gratitude: "Sage, reflect on today's lessons with gratitude.",
      },
      Lover: {
        letter: 'Your heart knows the way – a letter from your loved ones',
        journal: 'Lover, connect with your feelings through journaling',
        breathing: 'Breathe into your heart space, Lover',
        gratitude: 'Lover, celebrate the connections in your life',
      },
      Seeker: {
        letter: 'Seeker, discover a message meant for you',
        journal: 'Seeker, explore your inner landscape',
        breathing: 'Seeker, find stillness in this moment',
        gratitude: 'Seeker, appreciate the journey itself',
      },
    };

    return {
      title: 'TARU Moment',
      body: archetypeMessages[archetype][intervention.type] || 'Take a moment for yourself',
      data: {
        type: intervention.type,
        priority: intervention.priority,
        archetype,
      },
    };
  }

  private async sendPushNotification(pushToken: string, notification: object) {
    // Placeholder for Expo Push Notification integration
    logger.info('Sending push notification:', { pushToken, notification });

    // In production:
    // const expo = new Expo({ accessToken: config.expo.accessToken });
    // await expo.sendPushNotificationsAsync([{
    //   to: pushToken,
    //   ...notification
    // }]);
  }
}

export default new TriggerService();
