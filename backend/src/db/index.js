import dotenv from 'dotenv';
import pkg from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

dotenv.config();

const { PrismaClient } = pkg;
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

const globalForPrisma = globalThis;
const prisma = globalForPrisma.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export async function initializeDatabase() {
  await prisma.$connect();

  await prisma.hero.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      greeting: "Hello, I'm",
      name: 'Ram',
      roles: JSON.stringify(['Full Stack Developer', 'Backend Developer', 'Problem Solver']),
      tagline: 'I build fast, scalable, and reliable software — from database to deploy.',
      resume_url: '',
    },
    update: {},
  });

  await prisma.about.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heading: 'About Me',
      content: 'I am a full stack developer focused on backend systems, clean architecture, and shipping things that work in production, not just in demos.',
      years_experience: 3,
      projects_completed: 20,
      happy_clients: 12,
    },
    update: {},
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      site_title: 'Ram — Full Stack Developer',
      site_description: 'Portfolio of Ram, a full stack developer specializing in backend systems and scalable architecture.',
      email: 'you@example.com',
      phone: '',
      location: 'India',
      meta_keywords: 'full stack developer, backend developer, react, node.js',
    },
    update: {},
  });
}

await initializeDatabase();

export default prisma;
