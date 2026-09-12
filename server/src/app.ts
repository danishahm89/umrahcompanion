import cors from 'cors';
import express from 'express';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', publicRouter);
  app.use('/api/admin', adminRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
