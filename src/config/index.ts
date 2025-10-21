import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',

  database: {
    url: process.env.DATABASE_URL || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  trigger: {
    webhookSecret: process.env.TRIGGER_WEBHOOK_SECRET || 'your-webhook-secret-token',
    processingDelayMs: parseInt(process.env.TRIGGER_PROCESSING_DELAY_MS || '5000', 10),
  },

  expo: {
    accessToken: process.env.EXPO_ACCESS_TOKEN || '',
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  features: {
    enableSwaggerDocs: process.env.ENABLE_SWAGGER_DOCS === 'true',
    enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
  },
};

export default config;
