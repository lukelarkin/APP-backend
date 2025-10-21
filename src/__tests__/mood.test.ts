import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prismaMock } from './setup';

describe('Mood Check-in Endpoints', () => {
  let token: string;
  const userId = 'test-user-id';

  beforeEach(() => {
    token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
  });

  describe('POST /api/mood', () => {
    it('should create a mood check-in', async () => {
      const mockCheckIn = {
        id: 'checkin-id',
        userId,
        mood: 'calm',
        intensity: 7,
        notes: 'Feeling peaceful today',
        tags: ['meditation', 'morning'],
        createdAt: new Date(),
      };

      prismaMock.moodCheckIn.create.mockResolvedValue(mockCheckIn);

      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mood: 'calm',
          intensity: 7,
          notes: 'Feeling peaceful today',
          tags: ['meditation', 'morning'],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mood', 'calm');
      expect(response.body).toHaveProperty('intensity', 7);
    });

    it('should validate intensity range', async () => {
      const response = await request(app)
        .post('/api/mood')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mood: 'anxious',
          intensity: 15, // Invalid: should be 1-10
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/mood', () => {
    it('should get mood check-ins', async () => {
      const mockCheckIns = [
        {
          id: 'checkin-1',
          userId,
          mood: 'calm',
          intensity: 7,
          notes: 'Good morning',
          tags: ['morning'],
          createdAt: new Date(),
        },
        {
          id: 'checkin-2',
          userId,
          mood: 'anxious',
          intensity: 4,
          notes: 'Evening anxiety',
          tags: ['evening'],
          createdAt: new Date(),
        },
      ];

      prismaMock.moodCheckIn.findMany.mockResolvedValue(mockCheckIns);

      const response = await request(app)
        .get('/api/mood')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/mood/stats', () => {
    it('should get mood statistics', async () => {
      const mockCheckIns = [
        {
          mood: 'calm',
          intensity: 7,
          createdAt: new Date(),
        },
        {
          mood: 'calm',
          intensity: 8,
          createdAt: new Date(),
        },
        {
          mood: 'anxious',
          intensity: 4,
          createdAt: new Date(),
        },
      ];

      prismaMock.moodCheckIn.findMany.mockResolvedValue(mockCheckIns as any);

      const response = await request(app)
        .get('/api/mood/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 3);
      expect(response.body).toHaveProperty('averageIntensity');
      expect(response.body).toHaveProperty('moodDistribution');
    });
  });
});
