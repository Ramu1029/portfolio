import { createCrudRouter } from './genericCrud.js';

export const skillsRouter = createCrudRouter({
  table: 'skills',
  fields: ['name', 'category', 'proficiency', 'icon', 'sort_order'],
});

export const experienceRouter = createCrudRouter({
  table: 'experience',
  fields: ['role', 'company', 'location', 'start_date', 'end_date', 'current', 'description', 'tech_stack', 'type', 'sort_order'],
  jsonFields: ['tech_stack'],
});

export const achievementsRouter = createCrudRouter({
  table: 'achievements',
  fields: ['title', 'description', 'date', 'link', 'sort_order'],
});

export const certificationsRouter = createCrudRouter({
  table: 'certifications',
  fields: ['title', 'issuer', 'issue_date', 'credential_url', 'image', 'sort_order'],
});

export const socialLinksRouter = createCrudRouter({
  table: 'social_links',
  fields: ['platform', 'url', 'icon', 'sort_order'],
});
