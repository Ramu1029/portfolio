import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import prisma from '../db/index.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  description: z.string().optional().default(''),
  long_description: z.string().optional().default(''),
  tech_stack: z.array(z.string()).optional().default([]),
  github_url: z.string().url().optional().or(z.literal('')).default(''),
  live_url: z.string().url().optional().or(z.literal('')).default(''),
  images: z.array(z.string()).optional().default([]),
  category: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published']).optional().default('published'),
  project_date: z.string().optional().default(''),
  sort_order: z.number().optional().default(0),
});

function rowToProject(row) {
  return {
    ...row,
    tech_stack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
    images: row.images ? JSON.parse(row.images) : [],
    featured: !!row.featured,
  };
}

function buildProjectWhere(query) {
  const where = { status: 'published' };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }
  if (query.category) {
    where.category = query.category;
  }
  if (query.featured === 'true') {
    where.featured = true;
  }
  return where;
}

// GET /api/projects — PUBLIC, only published, supports search/category/pagination
router.get('/', async (req, res, next) => {
  try {
    const { search = '', category, page = '1', limit = '12', featured } = req.query;
    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 12, 1), 50);
    const offset = (p - 1) * l;

    const where = buildProjectWhere({ search, category, featured });

    const [total, rows] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
        skip: offset,
        take: l,
      }),
    ]);

    res.json({
      data: rows.map(rowToProject),
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/admin — ADMIN, all statuses, supports search/pagination
router.get('/admin', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { search = '', page = '1', limit = '20' } = req.query;
    const p = Math.max(parseInt(page) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const offset = (p - 1) * l;

    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [total, rows] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
        skip: offset,
        take: l,
      }),
    ]);

    res.json({
      data: rows.map(rowToProject),
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:slug — PUBLIC (published only) — single project
router.get('/:slug', async (req, res, next) => {
  try {
    const row = await prisma.project.findFirst({
      where: { slug: req.params.slug, status: 'published' },
    });
    if (!row) return res.status(404).json({ error: 'Project not found' });
    res.json({ data: rowToProject(row) });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — ADMIN only
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const parsed = projectSchema.parse(req.body);
    const existing = await prisma.project.findUnique({ where: { slug: parsed.slug } });
    if (existing) return res.status(409).json({ error: 'A project with this slug already exists' });

    const id = uuid();
    const row = await prisma.project.create({
      data: {
        id,
        title: parsed.title,
        slug: parsed.slug,
        description: parsed.description,
        long_description: parsed.long_description,
        tech_stack: JSON.stringify(parsed.tech_stack),
        github_url: parsed.github_url,
        live_url: parsed.live_url,
        images: JSON.stringify(parsed.images),
        category: parsed.category,
        featured: parsed.featured,
        status: parsed.status,
        project_date: parsed.project_date,
        sort_order: parsed.sort_order,
      },
    });
    res.status(201).json({ data: rowToProject(row) });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
});

// PUT /api/projects/:id — ADMIN only
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const parsed = projectSchema.partial().parse(req.body);
    const merged = { ...rowToProject(existing), ...parsed };

    const row = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title: merged.title,
        slug: merged.slug,
        description: merged.description,
        long_description: merged.long_description,
        tech_stack: JSON.stringify(merged.tech_stack),
        github_url: merged.github_url,
        live_url: merged.live_url,
        images: JSON.stringify(merged.images),
        category: merged.category,
        featured: merged.featured,
        status: merged.status,
        project_date: merged.project_date,
        sort_order: merged.sort_order,
      },
    });
    res.json({ data: rowToProject(row) });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors[0].message });
    next(err);
  }
});

// DELETE /api/projects/:id — ADMIN only
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
