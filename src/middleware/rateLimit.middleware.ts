import rateLimit from 'express-rate-limit';
import config from '../config';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

export const triggerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 triggers per minute per IP
  message: 'Too many trigger events, please slow down.',
});
