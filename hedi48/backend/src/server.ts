import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { healthRouter } from './modules/health/health.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { habitsRouter } from './modules/habits/habits.routes.js';
import { journalRouter } from './modules/journal/journal.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import hediRouter from './modules/hedi-ai/hedi.routes.js';
import authRouter from './modules/auth/auth.routes.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/health', healthRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/journal', journalRouter);
app.use('/api/users', usersRouter);
app.use('/api/hedi', hediRouter);
app.use('/api/auth', authRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Hedi backend running on ${port}`);
});
