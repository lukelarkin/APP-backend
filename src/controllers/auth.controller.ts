import { Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';

export class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      successResponse(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        errorResponse(res, 'Refresh token is required', 400);
      }

      const result = await authService.refreshToken(refreshToken);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        errorResponse(res, 'Refresh token is required', 400);
      }

      await authService.logout(refreshToken);
      successResponse(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
