import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import api from '../../utils/api.js';

export default function Skills() {
  const { ref, inView } = useReveal();
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills').then(({ data }) => setSkills(data?.data || [])).catch(() => {});
  }, []);

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    acc[cat] = acc[cat] || [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.span variants={fadeUp} className="eyebrow">
          Toolbox
        </motion.span>
        <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-16">
          Skills &amp; technologies
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <motion.div key={category} variants={fadeUp}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-secondary mb-6">
                {category}
              </h3>
              <div className="space-y-5">
                {items.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/90">{skill.name}</span>
                      <span className="text-light-accent/50 font-mono text-xs">{skill.proficiency}%</span>
                    </div>
                    <div className="h-[3px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: inView ? `${skill.proficiency}%` : 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
