import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { swaggerSpec } from './config/swagger';
import logger from './utils/logger';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Security
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Rate limiting
    this.app.use(`/api/${config.apiVersion}`, apiLimiter);
  }

  private initializeRoutes() {
    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    // API routes
    this.app.use(`/api/${config.apiVersion}`, routes);

    // Swagger documentation
    if (config.features.enableSwaggerDocs) {
      this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      this.app.get('/docs.json', (_req: Request, res: Response) => {
        res.json(swaggerSpec);
      });
      logger.info('Swagger documentation available at /docs');
    }

    // 404 handler
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  public listen() {
    this.app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Version: ${config.apiVersion}`);
    });
  }
}

export default App;
