import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prismaMock } from './setup';

describe('User Endpoints', () => {
  let token: string;
  const userId = 'test-user-id';

  beforeEach(() => {
    token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '1h' });
  });

  describe('GET /api/users/me', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: 'hashedpassword',
        updatedAt: new Date(),
      });

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'No token provided');
    });
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
      const mockProfile = {
        id: 'profile-id',
        userId,
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        timezone: 'UTC',
        traumaBackground: null,
        preferredArchetype: 'Warrior',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.userProfile.findUnique.mockResolvedValue(mockProfile);

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bio', 'Test bio');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updatedProfile = {
        id: 'profile-id',
        userId,
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        timezone: 'America/New_York',
        traumaBackground: 'Some background',
        preferredArchetype: 'Healer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.userProfile.upsert.mockResolvedValue(updatedProfile);

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bio: 'Updated bio',
          avatarUrl: 'https://example.com/new-avatar.jpg',
          timezone: 'America/New_York',
          preferredArchetype: 'Healer',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bio', 'Updated bio');
    });
  });
});
