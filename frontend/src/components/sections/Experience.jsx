import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import api from '../../utils/api.js';

export default function Experience() {
  const { ref, inView } = useReveal();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/experience').then(({ data }) => setItems(data?.data || [])).catch(() => {});
  }, []);

  return (
    <section id="experience" ref={ref} className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.span variants={fadeUp} className="eyebrow">
          Track record
        </motion.span>
        <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-16">
          Experience &amp; freelance work
        </motion.h2>

        <div className="relative max-w-3xl">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent" />
          <div className="space-y-12">
            {items.map((item) => (
              <motion.div key={item.id} variants={fadeUp} className="relative pl-10">
                <span className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-bg border-2 border-primary" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl text-white font-medium">{item.role}</h3>
                  <span className="text-secondary">·</span>
                  <span className="text-light-accent/80">{item.company}</span>
                  {item.type === 'freelance' && (
                    <span className="tag !text-[10px]">Freelance</span>
                  )}
                </div>
                <p className="font-mono text-xs text-light-accent/50 mt-1">
                  {item.start_date} — {item.current ? 'Present' : item.end_date}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
                {item.description && (
                  <p className="body-text mt-3 max-w-xl">{item.description}</p>
                )}
                {!!item.tech_stack?.length && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tech_stack.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
