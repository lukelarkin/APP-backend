import { Response, NextFunction } from 'express';
import checkInService from '../services/checkin.service';
import { AuthRequest } from '../types';
import { successResponse } from '../utils/response';

export class CheckInController {
  async createCheckIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const checkIn = await checkInService.createCheckIn(req.user!.id, req.body);
      successResponse(res, checkIn, 201);
    } catch (error) {
      next(error);
    }
  }

  async getCheckIns(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await checkInService.getCheckIns(req.user!.id, page, limit);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getStreaks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const streaks = await checkInService.getStreaks(req.user!.id);
      successResponse(res, streaks);
    } catch (error) {
      next(error);
    }
  }
}

export default new CheckInController();
