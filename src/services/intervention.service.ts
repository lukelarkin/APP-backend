import prisma from '../config/database';
import redis from '../config/redis';
import { LetterDto, Archetype } from '../types';
import { AppError } from '../utils/response';

const INTERVENTION_CACHE_KEY = (archetype: string) => `interventions:${archetype}`;
const INTERVENTION_CACHE_TTL = 3600; // 1 hour

export class InterventionService {
  async getInterventions(archetype: Archetype) {
    // Try to get from cache first
    const cached = await redis.get(INTERVENTION_CACHE_KEY(archetype));
    if (cached) {
      return JSON.parse(cached);
    }

    // Generate archetype-specific interventions
    const interventions = this.generateInterventions(archetype);

    // Cache the result
    await redis.setex(INTERVENTION_CACHE_KEY(archetype), INTERVENTION_CACHE_TTL, JSON.stringify(interventions));

    return interventions;
  }

  async createLetter(userId: string, data: LetterDto) {
    const letter = await prisma.lovedOneLetter.create({
      data: {
        userId,
        subject: data.subject,
        body: data.body,
        author: data.author,
        audioUrl: data.audioUrl,
      },
    });

    return letter;
  }

  async getLetters(userId: string) {
    const letters = await prisma.lovedOneLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return letters;
  }

  async updateLetter(userId: string, letterId: string, data: Partial<LetterDto>) {
    // Verify ownership
    const letter = await prisma.lovedOneLetter.findFirst({
      where: { id: letterId, userId },
    });

    if (!letter) {
      throw new AppError('Letter not found', 404);
    }

    const updated = await prisma.lovedOneLetter.update({
      where: { id: letterId },
      data,
    });

    return updated;
  }

  async deleteLetter(userId: string, letterId: string) {
    // Verify ownership
    const letter = await prisma.lovedOneLetter.findFirst({
      where: { id: letterId, userId },
    });

    if (!letter) {
      throw new AppError('Letter not found', 404);
    }

    await prisma.lovedOneLetter.delete({
      where: { id: letterId },
    });
  }

  private generateInterventions(archetype: Archetype) {
    const baseInterventions = {
      letters: {
        title: 'Loved One Letters',
        description: 'Messages from people who care about you',
      },
      journal: {
        title: 'Wilderness Journal',
        description: 'Reflective prompts for self-discovery',
      },
      gratitude: {
        title: 'Gratitude Rituals',
        description: 'Practices to cultivate appreciation',
      },
      breathing: {
        title: 'Nervous System Resets',
        description: 'Breathwork and physiological techniques',
      },
    };

    const archetypeContent: Record<Archetype, Record<string, string[]>> = {
      Warrior: {
        journal: [
          'What battle are you fighting today, and what strength will you draw upon?',
          'Describe a moment when you stood your ground. What made you strong?',
          'How can you channel your warrior energy into protecting what matters most?',
        ],
        gratitude: [
          'Name three victories, no matter how small, from today.',
          'Who fought alongside you today? Express gratitude for their support.',
          'What challenge taught you something valuable?',
        ],
      },
      Sage: {
        journal: [
          'What wisdom have you gained from today\'s experiences?',
          'Reflect on a pattern you\'ve noticed. What does it teach you?',
          'How can you use your understanding to guide others?',
        ],
        gratitude: [
          'What lesson are you grateful for today?',
          'Acknowledge the teachers in your life, past and present.',
          'What knowledge or insight enriched your day?',
        ],
      },
      Lover: {
        journal: [
          'What brought you joy or connection today?',
          'Describe a moment when you felt truly present with someone.',
          'How did you express care for yourself or others?',
        ],
        gratitude: [
          'Who made you feel seen and valued today?',
          'What beauty did you encounter?',
          'Express appreciation for a relationship that sustains you.',
        ],
      },
      Seeker: {
        journal: [
          'What are you searching for right now?',
          'Describe a moment of curiosity or wonder from today.',
          'What new path or possibility are you exploring?',
        ],
        gratitude: [
          'What discovery or insight surprised you today?',
          'Acknowledge the journey, not just the destination.',
          'What opportunity for growth are you grateful for?',
        ],
      },
    };

    return {
      archetype,
      interventions: {
        ...baseInterventions,
        archetypeSpecific: {
          journal: archetypeContent[archetype].journal,
          gratitude: archetypeContent[archetype].gratitude,
        },
      },
    };
  }
}

export default new InterventionService();
