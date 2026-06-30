import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import MagneticButton from '../ui/MagneticButton.jsx';
import api from '../../utils/api.js';

function useTypedRoles(roles) {
  const [text, setText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles?.length) return;
    const current = roles[roleIndex % roles.length];
    const speed = deleting ? 35 : 70;
    const pause = 1400;

    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), pause);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setRoleIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);

  return text;
}

export default function Hero() {
  const sectionRef = useRef(null);
  const [hero, setHero] = useState({
    greeting: "Hello, I'm",
    name: 'Ram',
    roles: ['Full Stack Developer', 'Backend Developer', 'Problem Solver'],
    tagline: 'I build fast, scalable, and reliable software — from database to deploy.',
  });
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    api.get('/hero').then(({ data }) => {
      if (data?.data) setHero((h) => ({ ...h, ...data.data }));
    }).catch(() => {});
  }, []);

  const typed = useTypedRoles(hero.roles);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMouse({ x: (e.clientX / innerWidth) * 100, y: (e.clientY / innerHeight) * 100 });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-noise"
    >
      {/* Mouse-follow ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(158,200,185,0.10), transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-mesh-gradient" />

      {/* Floating shapes */}
      <div className="pointer-events-none absolute top-1/4 right-[8%] w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-1/4 left-[6%] w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-float-delayed" />

      <motion.div style={{ y, opacity }} className="relative container-px pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow mb-6"
        >
          Available for select freelance &amp; full-time work
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="heading-lg max-w-4xl"
        >
          {hero.greeting} <span className="text-primary">{hero.name}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 h-12 md:h-16 flex items-center"
        >
          <span className="font-display text-2xl md:text-4xl text-light-accent/90">
            {typed}
            <span className="inline-block w-[2px] h-6 md:h-8 bg-primary ml-1 align-middle animate-pulse-slow" />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="body-text max-w-xl mt-6 text-lg"
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <MagneticButton as="a" href="#projects" className="btn-primary">
            View Projects
          </MagneticButton>
          <MagneticButton as="a" href="#contact" className="btn-ghost">
            Contact Me
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-light-accent/50 font-mono text-[10px] uppercase tracking-[0.2em]"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.a>
    </section>
  );
}
