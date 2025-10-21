import { Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { AuthRequest } from '../types';
import { successResponse } from '../utils/response';

export class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.user!.id);
      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { timezone, bedtime, settings } = req.body;
      const user = await userService.updateUser(req.user!.id, {
        timezone,
        bedtime,
        settings,
      });
      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateArchetype(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { archetype } = req.body;
      const user = await userService.updateArchetype(req.user!.id, archetype);
      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await userService.getUserStats(req.user!.id);
      successResponse(res, stats);
    } catch (error) {
      next(error);
    }
  }

  async registerPushToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pushToken } = req.body;
      await userService.registerPushToken(req.user!.id, pushToken);
      successResponse(res, { message: 'Push token registered successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
