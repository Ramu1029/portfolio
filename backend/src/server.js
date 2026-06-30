import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import { heroRouter, aboutRouter, settingsRouter } from './routes/singletons.js';
import {
  skillsRouter,
  experienceRouter,
  achievementsRouter,
  certificationsRouter,
  socialLinksRouter,
} from './routes/resources.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
import './db/index.js'; // ensure schema is initialized

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Basic global rate limit to slow down abuse / brute force
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 });
app.use('/api', globalLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/certifications', certificationsRouter);
app.use('/api/social-links', socialLinksRouter);
app.use('/api/hero', heroRouter);
app.use('/api/about', aboutRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
