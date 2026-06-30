import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import prisma from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional().default(''),
  message: z.string().min(1).max(5000),
});

// Prevent spam/abuse of the public contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

// PUBLIC — submit contact form
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const parsed = contactSchema.parse(req.body);
    const id = uuid();
    await prisma.contact.create({
      data: {
        id,
        name: parsed.name,
        email: parsed.email,
        subject: parsed.subject,
        message: parsed.message,
      },
    });
    res.status(201).json({ success: true, message: "Thanks — I'll get back to you soon." });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
});

// ADMIN — list messages
router.get('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const rows = await prisma.contact.findMany({ orderBy: { created_at: 'desc' } });
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

// ADMIN — mark read
router.put('/:id/read', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const existing = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await prisma.contact.update({ where: { id: req.params.id }, data: { read: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ADMIN — delete
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const existing = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
