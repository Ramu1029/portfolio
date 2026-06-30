import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ projects: 0, messages: 0, skills: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/projects/admin', { params: { limit: 1 } }),
      api.get('/contact'),
      api.get('/skills'),
    ]).then(([projects, contacts, skills]) => {
      setCounts({
        projects: projects.data.pagination?.total || 0,
        messages: contacts.data.data?.filter((m) => !m.read).length || 0,
        skills: skills.data.data?.length || 0,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total projects', value: counts.projects, to: '/admin/projects' },
    { label: 'Unread messages', value: counts.messages, to: '/admin/messages' },
    { label: 'Skills listed', value: counts.skills, to: '/admin/skills' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Overview</h1>
      <p className="text-light-accent/50 text-sm mb-8">A quick snapshot of your portfolio content.</p>

      <div className="grid sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="glass-card p-6 hover:border-primary/30 transition-colors">
            <div className="font-display text-3xl font-semibold text-primary">{c.value}</div>
            <div className="text-sm text-light-accent/60 mt-2">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
