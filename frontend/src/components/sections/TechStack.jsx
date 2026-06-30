import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

export default function TechStack() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get('/skills').then(({ data }) => setSkills(data?.data || [])).catch(() => {});
  }, []);

  if (!skills.length) return null;
  const row = [...skills, ...skills]; // duplicate for seamless loop

  return (
    <section className="py-16 border-y border-white/[0.06] overflow-hidden">
      <div className="flex animate-marquee w-max">
        {row.map((s, i) => (
          <span
            key={`${s.id}-${i}`}
            className="font-display text-2xl md:text-3xl text-white/15 mx-8 whitespace-nowrap hover:text-primary/60 transition-colors"
          >
            {s.name}
          </span>
        ))}
      </div>
    </section>
  );
}
