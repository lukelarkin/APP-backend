import swaggerJsDoc from 'swagger-jsdoc';
import config from '../config';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TARU Backend API',
      version: '1.0.0',
      description:
        'Backend API for TARU - Trauma-informed iOS app providing just-in-time interventions for behavioral addictions',
      contact: {
        name: 'TARU Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/${config.apiVersion}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        webhookAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-webhook-secret',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'CheckIns', description: 'Daily IFS check-in endpoints' },
      { name: 'Streaks', description: 'Streak tracking endpoints' },
      { name: 'Interventions', description: 'Intervention content endpoints' },
      { name: 'Letters', description: 'Loved one letter endpoints' },
      { name: 'Community', description: 'Community message and ritual endpoints' },
      { name: 'Triggers', description: 'Trigger webhook endpoints' },
      { name: 'Push', description: 'Push notification endpoints' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions);
