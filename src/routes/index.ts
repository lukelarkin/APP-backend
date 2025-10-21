import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import checkInRoutes from './checkin.routes';
import streakRoutes from './streak.routes';
import interventionRoutes from './intervention.routes';
import letterRoutes from './letter.routes';
import messageRoutes from './message.routes';
import ritualRoutes from './ritual.routes';
import { webhookRoutes, pushRoutes } from './webhook.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/checkins', checkInRoutes);
router.use('/streaks', streakRoutes);
router.use('/interventions', interventionRoutes);
router.use('/letters', letterRoutes);
router.use('/messages', messageRoutes);
router.use('/rituals', ritualRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/push', pushRoutes);

export default router;
