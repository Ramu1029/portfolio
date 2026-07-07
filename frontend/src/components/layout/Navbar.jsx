import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiShieldCheck, HiX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const isHome = location.pathname === '/';
  const adminHref = isAuthenticated && isAdmin ? '/admin' : '/admin/login';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]' : 'bg-transparent'
      }`}
    >
      <nav className="container-px relative z-10 flex items-center justify-between gap-4 py-4 md:py-5">
        <Link to="/" className="font-display font-semibold text-lg tracking-tight shrink-0">
          Ram<span className="text-primary">.</span>
        </Link>

        {isHome && (
          <ul className="hidden md:flex flex-1 items-center justify-center gap-8 font-mono text-[11px] tracking-[0.24em] uppercase">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative block px-1 py-2 text-light-accent/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to={adminHref}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors duration-300 hover:border-primary/40 hover:bg-primary/20"
          >
            <HiShieldCheck className="text-base" />
            Admin
          </Link>
          <a href="#contact" className="btn-ghost !px-5 !py-2.5 text-sm whitespace-nowrap">
            Let's talk
          </a>
        </div>

        <button
          className="md:hidden ml-auto text-2xl text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-bg/95 backdrop-blur-xl border-t border-white/10"
          >
            <ul className="container-px py-6 flex flex-col gap-5 font-mono text-sm uppercase tracking-wide">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setOpen(false)} className="text-light-accent/80">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to={adminHref} onClick={() => setOpen(false)} className="inline-flex items-center gap-2 text-primary">
                  <HiShieldCheck />
                  Admin Access
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
