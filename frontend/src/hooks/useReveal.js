import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * useReveal — returns a ref + boolean "inView" for scroll-triggered animations.
 * Pairs with Framer Motion variants: animate={inView ? 'visible' : 'hidden'}
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px', ...options });
  return { ref, inView };
}

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
