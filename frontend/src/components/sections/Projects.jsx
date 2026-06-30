import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import ProjectCard from './ProjectCard.jsx';
import api from '../../utils/api.js';

export default function Projects() {
  const { ref, inView } = useReveal();
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/projects', { params: { limit: 50 } }).then(({ data }) => {
      setAll(data?.data || []);
    }).catch(() => {});
  }, []);

  const featured = useMemo(() => all.filter((p) => p.featured), [all]);
  const categories = useMemo(
    () => ['All', ...new Set(all.map((p) => p.category).filter(Boolean))],
    [all]
  );

  const filtered = useMemo(() => {
    return all.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [all, search, category]);

  return (
    <section id="projects" ref={ref} className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.span variants={fadeUp} className="eyebrow">
          Selected work
        </motion.span>
        <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-4">
          Featured projects
        </motion.h2>
        <motion.p variants={fadeUp} className="body-text max-w-xl mb-16">
          A few projects I'm proud of — chosen for technical depth, not just polish.
        </motion.p>

        {featured.length > 0 && (
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
          <h3 className="font-display text-xl text-white">All projects</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-accent/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="bg-white/[0.04] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm w-full sm:w-56 focus:border-primary/50 outline-none transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-full px-4 py-2 text-sm focus:border-primary/50 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-bg">{c}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-light-accent/50 text-center py-12">
              No projects match that search yet.
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
