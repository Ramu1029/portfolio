import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import api from '../../utils/api.js';

export default function AchievementsCertifications() {
  const { ref, inView } = useReveal();
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    api.get('/achievements').then(({ data }) => setAchievements(data?.data || [])).catch(() => {});
    api.get('/certifications').then(({ data }) => setCertifications(data?.data || [])).catch(() => {});
  }, []);

  if (!achievements.length && !certifications.length) return null;

  return (
    <section id="achievements" ref={ref} className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid md:grid-cols-2 gap-16"
      >
        {!!achievements.length && (
          <div>
            <motion.span variants={fadeUp} className="eyebrow">Recognition</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-10">Achievements</motion.h2>
            <div className="space-y-6">
              {achievements.map((a) => (
                <motion.div key={a.id} variants={fadeUp} className="flex gap-4">
                  <FiAward className="text-primary text-xl mt-1 shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">{a.title}</h3>
                    {a.description && <p className="body-text text-sm mt-1">{a.description}</p>}
                    {a.date && <p className="font-mono text-xs text-light-accent/40 mt-1">{a.date}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!!certifications.length && (
          <div>
            <motion.span variants={fadeUp} className="eyebrow">Credentials</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-10">Certifications</motion.h2>
            <div className="space-y-4">
              {certifications.map((c) => (
                <motion.a
                  key={c.id}
                  variants={fadeUp}
                  href={c.credential_url || '#'}
                  target={c.credential_url ? '_blank' : undefined}
                  rel="noreferrer"
                  className="glass-card flex items-center justify-between p-5 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <h3 className="text-white font-medium text-sm">{c.title}</h3>
                    <p className="text-light-accent/50 text-xs mt-1">{c.issuer} · {c.issue_date}</p>
                  </div>
                  {c.credential_url && <FiExternalLink className="text-light-accent/40" />}
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
