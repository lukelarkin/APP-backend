import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getTriggers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const triggers = await prisma.trigger.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(triggers);
  } catch (error) {
    console.error('Get triggers error:', error);
    res.status(500).json({ error: 'Failed to fetch triggers' });
  }
};

export const createTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, description, severity, coping, webhookUrl } = req.body;

    const trigger = await prisma.trigger.create({
      data: {
        userId: req.userId as string,
        name,
        description,
        severity,
        coping,
        webhookUrl,
      },
    });

    res.status(201).json(trigger);
  } catch (error) {
    console.error('Create trigger error:', error);
    res.status(500).json({ error: 'Failed to create trigger' });
  }
};

export const updateTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, severity, coping, webhookUrl, isActive } = req.body;

    const trigger = await prisma.trigger.findFirst({
      where: { id, userId: req.userId },
    });

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    const updated = await prisma.trigger.update({
      where: { id },
      data: {
        name,
        description,
        severity,
        coping,
        webhookUrl,
        isActive,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update trigger error:', error);
    res.status(500).json({ error: 'Failed to update trigger' });
  }
};

export const deleteTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trigger = await prisma.trigger.findFirst({
      where: { id, userId: req.userId },
    });

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    await prisma.trigger.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete trigger error:', error);
    res.status(500).json({ error: 'Failed to delete trigger' });
  }
};

export const activateTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trigger = await prisma.trigger.findFirst({
      where: { id, userId: req.userId },
    });

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    // If webhook URL exists, call it
    if (trigger.webhookUrl) {
      try {
        const fetch = (await import('node-fetch')).default;
        await fetch(trigger.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: req.userId,
            triggerId: id,
            triggerName: trigger.name,
            severity: trigger.severity,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Webhook call failed:', webhookError);
        // Don't fail the whole request if webhook fails
      }
    }

    res.json({
      success: true,
      trigger,
      message: 'Trigger activated',
    });
  } catch (error) {
    console.error('Activate trigger error:', error);
    res.status(500).json({ error: 'Failed to activate trigger' });
  }
};
