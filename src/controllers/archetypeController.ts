import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getArchetypes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const archetypes = await prisma.userArchetype.findMany({
      where: { userId: req.userId },
      orderBy: { strength: 'desc' },
    });

    res.json(archetypes);
  } catch (error) {
    console.error('Get archetypes error:', error);
    res.status(500).json({ error: 'Failed to fetch archetypes' });
  }
};

export const createArchetype = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { archetype, strength, description } = req.body;

    const newArchetype = await prisma.userArchetype.create({
      data: {
        userId: req.userId as string,
        archetype,
        strength: strength || 50,
        description,
      },
    });

    res.status(201).json(newArchetype);
  } catch (error) {
    console.error('Create archetype error:', error);
    res.status(500).json({ error: 'Failed to create archetype' });
  }
};

export const updateArchetype = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { strength, isActive, description } = req.body;

    const archetype = await prisma.userArchetype.findFirst({
      where: { id, userId: req.userId },
    });

    if (!archetype) {
      res.status(404).json({ error: 'Archetype not found' });
      return;
    }

    const updated = await prisma.userArchetype.update({
      where: { id },
      data: {
        strength,
        isActive,
        description,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update archetype error:', error);
    res.status(500).json({ error: 'Failed to update archetype' });
  }
};

export const deleteArchetype = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const archetype = await prisma.userArchetype.findFirst({
      where: { id, userId: req.userId },
    });

    if (!archetype) {
      res.status(404).json({ error: 'Archetype not found' });
      return;
    }

    await prisma.userArchetype.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Delete archetype error:', error);
    res.status(500).json({ error: 'Failed to delete archetype' });
  }
};
