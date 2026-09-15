import 'express-async-errors'; // patches Express to forward a rejected async handler to the error middleware below, instead of an unhandled rejection crashing the whole process
import cors from 'cors';
import express from 'express';
import path from 'path';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/quran', express.static(path.join(__dirname, '../data/quran')));
  app.use('/api/hadith', express.static(path.join(__dirname, '../data/hadith')));
  app.use('/api', publicRouter);
  app.use('/api/admin', adminRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  return app;
}
