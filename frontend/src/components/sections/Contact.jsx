import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import { useReveal, fadeUp, staggerContainer } from '../../hooks/useReveal.js';
import MagneticButton from '../ui/MagneticButton.jsx';
import api from '../../utils/api.js';

export default function Contact() {
  const { ref, inView } = useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid md:grid-cols-2 gap-16 items-start"
      >
        <div>
          <motion.span variants={fadeUp} className="eyebrow">Get in touch</motion.span>
          <motion.h2 variants={fadeUp} className="heading-md mt-4 mb-6">
            Let's build something that actually ships.
          </motion.h2>
          <motion.p variants={fadeUp} className="body-text max-w-md">
            Have a project, a role, or just a technical question? My inbox is open —
            I read everything myself.
          </motion.p>
        </div>

        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
            />
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
            />
          </div>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
          />
          <textarea
            required
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Every great project starts with a conversation..."
            rows={5}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors resize-none"
          />
          <MagneticButton
            as="button"
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto disabled:opacity-60"
          >
            {submitting ? 'Sending...' : <>Send message <FiSend /></>}
          </MagneticButton>
        </motion.form>
      </motion.div>
    </section>
  );
}
