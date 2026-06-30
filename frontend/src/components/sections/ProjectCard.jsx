import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className="glass-card group overflow-hidden h-full flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-dark to-bg-light">
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-4xl text-white/10">
            {project.title?.[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/0 to-bg/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {project.featured ? (
          <span className="absolute top-4 left-4 tag bg-primary/10 border-primary/30 text-primary">
            Featured
          </span>
        ) : null}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-medium text-white">{project.title}</h3>
        <p className="body-text text-sm mt-2 flex-1">{project.description}</p>

        {!!project.tech_stack?.length && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.slice(0, 4).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/[0.06]">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-light-accent/70 hover:text-primary transition-colors"
            >
              <FiGithub /> Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-light-accent/70 hover:text-primary transition-colors"
            >
              <FiExternalLink /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
