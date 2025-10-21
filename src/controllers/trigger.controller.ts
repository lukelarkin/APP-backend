import { Request, Response, NextFunction } from 'express';
import triggerService from '../services/trigger.service';
import config from '../config';
import { successResponse, errorResponse } from '../utils/response';

export class TriggerController {
  async processTrigger(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate webhook secret
      const webhookSecret = req.headers['x-webhook-secret'];
      if (webhookSecret !== config.trigger.webhookSecret) {
        return errorResponse(res, 'Invalid webhook secret', 401);
      }

      const result = await triggerService.processTrigger(req.body);
      return successResponse(res, result, 202);
    } catch (error) {
      next(error);
    }
  }
}

export default new TriggerController();
