import request from 'supertest';
import app from '../index';

describe('IFS Endpoints', () => {
  describe('POST /ifs/checkin', () => {
    it('should create a new IFS check-in', async () => {
      const checkInData = {
        partName: 'Anxious Protector',
        emotion: 'anxious',
        quadrant: 'activated',
        intensity: 7,
        notes: 'Feeling worried about upcoming presentation',
      };

      const response = await request(app)
        .post('/ifs/checkin')
        .send(checkInData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('checkIn');
      expect(response.body.checkIn.partName).toBe(checkInData.partName);
      expect(response.body.checkIn.emotion).toBe(checkInData.emotion);
      expect(response.body.checkIn.intensity).toBe(checkInData.intensity);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        partName: 'Test Part',
        // Missing emotion, quadrant, intensity
      };

      const response = await request(app)
        .post('/ifs/checkin')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid intensity', async () => {
      const invalidData = {
        partName: 'Test Part',
        emotion: 'calm',
        quadrant: 'centered',
        intensity: 15, // Invalid: should be 1-10
      };

      const response = await request(app)
        .post('/ifs/checkin')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('Intensity must be');
    });
  });

  describe('POST /ifs/sync', () => {
    it('should sync multiple IFS check-ins', async () => {
      const checkIns = [
        {
          partName: 'Inner Critic',
          emotion: 'angry',
          quadrant: 'challenged',
          intensity: 6,
          notes: 'Being harsh on myself',
        },
        {
          partName: 'Nurturing Self',
          emotion: 'calm',
          quadrant: 'centered',
          intensity: 8,
          notes: 'Practicing self-compassion',
        },
      ];

      const response = await request(app)
        .post('/ifs/sync')
        .send({ checkIns })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('syncedCount');
      expect(response.body.syncedCount).toBe(2);
      expect(response.body.checkIns).toHaveLength(2);
    });

    it('should return 400 for empty array', async () => {
      const response = await request(app)
        .post('/ifs/sync')
        .send({ checkIns: [] })
        .expect(400);

      expect(response.body.error).toContain('non-empty array');
    });

    it('should return 400 for invalid check-in in array', async () => {
      const checkIns = [
        {
          partName: 'Valid Part',
          emotion: 'calm',
          quadrant: 'centered',
          intensity: 5,
        },
        {
          partName: 'Invalid Part',
          // Missing emotion, quadrant, intensity
        },
      ];

      const response = await request(app)
        .post('/ifs/sync')
        .send({ checkIns })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /ifs/checkins', () => {
    it('should fetch IFS check-ins with pagination', async () => {
      const response = await request(app)
        .get('/ifs/checkins')
        .expect(200);

      expect(response.body).toHaveProperty('checkIns');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.checkIns)).toBe(true);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('offset');
    });

    it('should respect limit and offset parameters', async () => {
      const response = await request(app)
        .get('/ifs/checkins?limit=5&offset=0')
        .expect(200);

      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.checkIns.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});
