import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import prisma from '../db/index.js';
import { signToken, cookieOptions, COOKIE_NAME } from '../utils/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional(),
});

/**
 * POST /api/auth/register
 * Public self-registration always creates role="user".
 * The only way to become "admin" is for the email to match
 * ADMIN_EMAIL on first login/registration — enforced server-side.
 */
router.post('/register', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const role = parsed.email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase()
      ? 'admin'
      : 'user';
    const passwordHash = bcrypt.hashSync(parsed.password, 10);
    const id = uuid();
    await prisma.user.create({
      data: {
        id,
        email: parsed.email,
        name: parsed.name || null,
        password_hash: passwordHash,
        role,
        provider: 'credentials',
      },
    });

    const token = signToken({ sub: id, role });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.status(201).json({ user: { id, email: parsed.email, name: parsed.name || null, role } });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.omit({ name: true }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = bcrypt.compareSync(parsed.password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({ sub: user.id, role: user.role });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ success: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
