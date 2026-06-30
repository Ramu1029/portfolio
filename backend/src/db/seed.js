import dotenv from 'dotenv';
dotenv.config();
import prisma from './index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

async function upsertAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';
  if (!email || !password) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — skipping admin seed.');
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  const hash = bcrypt.hashSync(password, 10);
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { password_hash: hash, role: 'admin', name },
    });
    console.log(`Updated existing admin user: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        id: uuid(),
        email,
        name,
        password_hash: hash,
        role: 'admin',
        provider: 'credentials',
      },
    });
    console.log(`Created admin user: ${email}`);
  }
}

async function seedSampleProjects() {
  const count = await prisma.project.count();
  if (count > 0) return;
  const sample = [
    {
      title: 'Realtime Order Pipeline',
      slug: 'realtime-order-pipeline',
      description: 'Event-driven backend processing thousands of orders per minute with guaranteed delivery.',
      tech_stack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      category: 'Backend',
      featured: true,
    },
    {
      title: 'Developer Analytics Dashboard',
      slug: 'developer-analytics-dashboard',
      description: 'A full-stack dashboard for visualizing CI/CD pipeline health and deployment metrics.',
      tech_stack: ['React', 'Express', 'SQLite', 'Chart.js'],
      category: 'Full Stack',
      featured: true,
    },
    {
      title: 'Auth Microservice',
      slug: 'auth-microservice',
      description: 'A reusable, role-based authentication and authorization microservice.',
      tech_stack: ['Node.js', 'JWT', 'bcrypt', 'Express'],
      category: 'Backend',
      featured: false,
    },
  ];
  for (const [index, project] of sample.entries()) {
    await prisma.project.create({
      data: {
        id: uuid(),
        title: project.title,
        slug: project.slug,
        description: project.description,
        tech_stack: JSON.stringify(project.tech_stack),
        images: JSON.stringify([]),
        category: project.category,
        featured: project.featured,
        status: 'published',
        project_date: new Date(2025, index, 1).toISOString().slice(0, 10),
      },
    });
  }
  console.log('Seeded sample projects.');
}

async function seedSkills() {
  const count = await prisma.skill.count();
  if (count > 0) return;
  const groups = {
    Frontend: ['React.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    Backend: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL'],
    Database: ['PostgreSQL', 'SQLite', 'MongoDB', 'Redis'],
    Tools: ['Docker', 'Git', 'CI/CD', 'AWS'],
  };
  let order = 0;
  for (const [category, names] of Object.entries(groups)) {
    for (const name of names) {
      await prisma.skill.create({
        data: {
          id: uuid(),
          name,
          category,
          proficiency: 75 + Math.floor(Math.random() * 20),
          sort_order: order++,
        },
      });
    }
  }
  console.log('Seeded skills.');
}

async function main() {
  await upsertAdmin();
  await seedSampleProjects();
  await seedSkills();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
