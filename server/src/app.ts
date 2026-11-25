import cors from 'cors';
import express from 'express';

export interface AppOptions {
  corsOrigins?: readonly string[];
}

export function createApp({ corsOrigins = [] }: AppOptions = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: [...corsOrigins] }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      name: 'go-dojo',
      time: new Date().toISOString()
    });
  });

  return app;
}
