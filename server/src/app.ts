import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';

export interface AppOptions {
  corsOrigins?: readonly string[];
}

export const createApp = ({ corsOrigins = [] }: AppOptions = {}): Express => {
  const app: Express = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: [...corsOrigins] }));
  app.use(express.json());

  app.get('/api/health', (_request: Request, response: Response): void => {
    response.json({
      ok: true,
      name: 'go-dojo',
      time: new Date().toISOString(),
    });
  });

  return app;
};
