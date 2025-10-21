import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthRequest, JwtPayload } from '../types';
import { errorResponse } from '../utils/response';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        archetype: decoded.archetype,
      };
      next();
    } catch (error) {
      return errorResponse(res, 'Invalid or expired token', 401);
    }
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 500);
  }
};
