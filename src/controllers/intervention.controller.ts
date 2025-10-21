import { Response, NextFunction } from 'express';
import interventionService from '../services/intervention.service';
import { AuthRequest, Archetype } from '../types';
import { successResponse } from '../utils/response';

export class InterventionController {
  async getInterventions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { archetype } = req.params;
      const interventions = await interventionService.getInterventions(archetype as Archetype);
      successResponse(res, interventions);
    } catch (error) {
      next(error);
    }
  }

  async createLetter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const letter = await interventionService.createLetter(req.user!.id, req.body);
      successResponse(res, letter, 201);
    } catch (error) {
      next(error);
    }
  }

  async getLetters(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const letters = await interventionService.getLetters(req.user!.id);
      successResponse(res, letters);
    } catch (error) {
      next(error);
    }
  }

  async updateLetter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const letter = await interventionService.updateLetter(req.user!.id, id, req.body);
      successResponse(res, letter);
    } catch (error) {
      next(error);
    }
  }

  async deleteLetter(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await interventionService.deleteLetter(req.user!.id, id);
      successResponse(res, { message: 'Letter deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new InterventionController();
