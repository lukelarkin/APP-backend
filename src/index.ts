import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import archetypeRoutes from './routes/archetype';
import moodRoutes from './routes/mood';
import partsRoutes from './routes/parts';
import letterRoutes from './routes/letter';
import journalRoutes from './routes/journal';
import gratitudeRoutes from './routes/gratitude';
import communityRoutes from './routes/community';
import triggerRoutes from './routes/trigger';
import pushTokenRoutes from './routes/pushToken';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/archetypes', archetypeRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/push-tokens', pushTokenRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`🚀 TARU Backend running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

export default app;
