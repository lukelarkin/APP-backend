import request from 'supertest';
import express, { Application } from 'express';
import authRoutes from '../../routes/auth.routes';

const app: Application = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should validate required fields', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({});

      expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
        archetype: 'Warrior',
      });

      expect(response.status).toBe(400);
    });

    it('should validate password length', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'short',
        archetype: 'Warrior',
      });

      expect(response.status).toBe(400);
    });

    it('should validate archetype enum', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        archetype: 'InvalidArchetype',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should validate required fields', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({});

      expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });
  });
});
