import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import prisma from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const modelMap = {
  skills: 'skill',
  experience: 'experience',
  achievements: 'achievement',
  certifications: 'certification',
  social_links: 'socialLink',
  contacts: 'contact',
  users: 'user',
  projects: 'project',
  hero: 'hero',
  about: 'about',
  settings: 'setting',
};

function buildOrderBy(orderBy) {
  if (!orderBy) return undefined;
  if (Array.isArray(orderBy)) return orderBy;
  return orderBy.split(',').map((entry) => {
    const [field, direction = 'asc'] = entry.trim().split(/\s+/);
    return { [field]: direction.toLowerCase() === 'desc' ? 'desc' : 'asc' };
  });
}

/**
 * Builds a simple CRUD router for "list" style tables (skills, experience,
 * achievements, certifications, social_links). GET is public, write ops are
 * admin-only. jsonFields are stored as JSON strings and parsed on read.
 */
export function createCrudRouter({ table, fields, jsonFields = [], orderBy = 'sort_order ASC, created_at DESC' }) {
  const router = Router();
  const modelName = modelMap[table];
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

  function normalizeValue(field, value) {
    if (jsonFields.includes(field)) return JSON.stringify(value || []);
    if (typeof value === 'boolean') return value ? 1 : 0;
    return value ?? null;
  }

  function normalizeRowValue(field, value) {
    if (jsonFields.includes(field)) return value ? (typeof value === 'string' ? JSON.parse(value) : value) : [];
    return value;
  }

  // PUBLIC list
  router.get('/', async (req, res, next) => {
    try {
      const rows = await client.findMany({ orderBy: buildOrderBy(orderBy) });
      res.json({ data: rows.map(parseRow) });
    } catch (err) {
      next(err);
    }
  });

  // PUBLIC single
  router.get('/:id', async (req, res, next) => {
    try {
      const row = await client.findUnique({ where: { id: req.params.id } });
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json({ data: parseRow(row) });
    } catch (err) {
      next(err);
    }
  });

  // ADMIN create
  router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const id = uuid();
      const data = fields.reduce((acc, field) => {
        const value = req.body[field];
        acc[field] = normalizeValue(field, value);
        return acc;
      }, { id });
      const row = await client.create({ data });
      res.status(201).json({ data: parseRow(row) });
    } catch (err) {
      next(err);
    }
  });

  // ADMIN update
  router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const existing = await client.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: 'Not found' });
      const data = fields.reduce((acc, field) => {
        const value = req.body[field] !== undefined ? req.body[field] : normalizeRowValue(field, existing[field]);
        acc[field] = normalizeValue(field, value);
        return acc;
      }, {});
      const row = await client.update({ where: { id: req.params.id }, data });
      res.json({ data: parseRow(row) });
    } catch (err) {
      next(err);
    }
  });

  // ADMIN delete
  router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
    try {
      const existing = await client.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ error: 'Not found' });
      await client.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
