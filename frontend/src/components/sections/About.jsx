import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import api from '../../utils/api.js';

export default function About() {
  const { ref, inView } = useReveal();
  const [about, setAbout] = useState({
    heading: 'About Me',
    content:
      'I am a full stack developer focused on backend systems, clean architecture, and shipping things that work in production, not just in demos.',
    years_experience: 3,
    projects_completed: 20,
    happy_clients: 12,
  });

  useEffect(() => {
    api.get('/about').then(({ data }) => {
      if (data?.data) setAbout((a) => ({ ...a, ...data.data }));
    }).catch(() => {});
  }, []);

  const stats = [
    { label: 'Years experience', value: about.years_experience },
    { label: 'Projects shipped', value: about.projects_completed },
    { label: 'Clients served', value: about.happy_clients },
  ];

  return (
    <section id="about" ref={ref} className="section relative">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid md:grid-cols-12 gap-12 items-start"
      >
        <motion.div variants={fadeUp} className="md:col-span-4">
          <span className="eyebrow">Who I am</span>
          <h2 className="heading-md mt-4">{about.heading}</h2>
        </motion.div>

        <div className="md:col-span-8">
          <motion.p variants={fadeUp} className="body-text text-lg md:text-xl max-w-2xl">
            {about.content}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 grid grid-cols-3 gap-8 max-w-md">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">
                  {s.value}+
                </div>
                <div className="text-xs text-light-accent/60 mt-1 font-mono uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
