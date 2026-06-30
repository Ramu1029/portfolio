import prisma from '../db/index.js';
import { verifyToken, COOKIE_NAME } from '../utils/auth.js';

/**
 * requireAuth — verifies the JWT session cookie, loads the user fresh from
 * Prisma (never trusts stale token claims for role), and attaches req.user.
 */
export function requireAuth(req, res, next) {
  const run = async () => {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const payload = verifyToken(token);
    if (!payload?.sub) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    req.user = user;
    next();
  };

  run().catch(next);
}

/**
 * requireAdmin — must be used AFTER requireAuth. Re-checks role from DB,
 * never from the JWT payload alone, so a role downgrade takes effect
 * immediately without waiting for token expiry.
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
