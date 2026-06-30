import { Router } from 'express';
import prisma from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

function buildSingletonRouter({ table, fields, jsonFields = [] }) {
  const router = Router();
  const modelName = table === 'settings' ? 'setting' : table;
  const client = prisma[modelName];

  function parseRow(row) {
    if (!row) return row;
    const out = { ...row };
    jsonFields.forEach((f) => {
      const value = row[f];
      out[f] = value ? (typeof value === 'string' ? JSON.parse(value) : value) : [];
    });
    return out;
  }

  router.get('/', async (req, res, next) => {
    try {
      const row = await client.findUnique({ where: { id: 1 } });
      res.json({ data: parseRow(row) });
    } catch (err) {
      next(err);
    }
  });

  router.put('/', requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const existing = await client.findUnique({ where: { id: 1 } });
      const data = fields.reduce((acc, field) => {
        const value = req.body[field] !== undefined ? req.body[field] : (jsonFields.includes(field)
          ? (existing?.[field] ? JSON.parse(existing[field]) : [])
          : existing?.[field]);
        acc[field] = jsonFields.includes(field) ? JSON.stringify(value || []) : value;
        return acc;
      }, {});
      const row = await client.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data,
      });
      res.json({ data: parseRow(row) });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export const heroRouter = buildSingletonRouter({
  table: 'hero',
  fields: ['greeting', 'name', 'roles', 'tagline', 'resume_url'],
  jsonFields: ['roles'],
});

export const aboutRouter = buildSingletonRouter({
  table: 'about',
  fields: ['heading', 'content', 'image', 'years_experience', 'projects_completed', 'happy_clients'],
});

export const settingsRouter = buildSingletonRouter({
  table: 'settings',
  fields: ['site_title', 'site_description', 'email', 'phone', 'location', 'meta_keywords'],
});
