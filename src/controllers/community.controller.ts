import { Response, NextFunction } from 'express';
import communityService from '../services/community.service';
import { AuthRequest } from '../types';
import { successResponse } from '../utils/response';

export class CommunityController {
  async createMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const message = await communityService.createMessage(req.user!.id, req.body);
      return successResponse(res, message, 201);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await communityService.getMessages(req.user!.id, page, limit);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getRituals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rituals = await communityService.getRituals();
      return successResponse(res, rituals);
    } catch (error) {
      next(error);
    }
  }

  async joinRitual(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await communityService.joinRitual(req.user!.id, id);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CommunityController();
