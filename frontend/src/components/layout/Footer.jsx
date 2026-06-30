import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp } from 'react-icons/fi';

const SOCIALS = [
  { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiMail, href: 'mailto:you@example.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="container-px py-12 border-t border-white/[0.06]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-light-accent/50 font-mono">
          © {new Date().getFullYear()} Ram. Built from scratch — backend to pixels.
        </p>

        <div className="flex items-center gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="text-light-accent/60 hover:text-primary transition-colors duration-300 text-lg"
            >
              <s.icon />
            </a>
          ))}
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/60 hover:text-primary transition-colors duration-300"
          aria-label="Back to top"
        >
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
}
