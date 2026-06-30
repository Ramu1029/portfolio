import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MagneticButton — the page's signature micro-interaction. The button
 * physically "pulls" toward the cursor within a small radius, like a
 * compass needle finding north — a small nod to a backend dev's love of
 * precise, responsive systems.
 */
export default function MagneticButton({ children, className = '', as: Tag = 'button', strength = 0.35, ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.3 }}
      className="inline-block"
    >
      <Tag className={className} {...props}>
        {children}
      </Tag>
    </motion.div>
  );
}
