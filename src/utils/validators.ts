import { body, param, query, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('archetype')
    .isIn(['Warrior', 'Sage', 'Lover', 'Seeker'])
    .withMessage('Archetype must be one of: Warrior, Sage, Lover, Seeker'),
  body('timezone').optional().isString(),
  body('bedtime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
];

export const loginValidation: ValidationChain[] = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const checkInValidation: ValidationChain[] = [
  body('part').notEmpty().withMessage('Part is required'),
  body('emotion').notEmpty().withMessage('Emotion is required'),
  body('quadrant').notEmpty().withMessage('Quadrant is required'),
  body('intensity').isInt({ min: 1, max: 10 }).withMessage('Intensity must be between 1 and 10'),
  body('notes').optional().isString(),
];

export const letterValidation: ValidationChain[] = [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('author').optional().isString(),
  body('audioUrl').optional().isURL().withMessage('Audio URL must be valid'),
];

export const messageValidation: ValidationChain[] = [
  body('messageType')
    .isIn(['gratitude', 'support', 'ritual'])
    .withMessage('Message type must be one of: gratitude, support, ritual'),
  body('content').notEmpty().withMessage('Content is required'),
  body('recipientId').optional().isString(),
];

export const paginationValidation: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const idParamValidation: ValidationChain[] = [
  param('id').notEmpty().withMessage('ID is required'),
];
