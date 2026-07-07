import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access.');
        return;
      }
      toast.success('Welcome back.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg container-px">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center text-sm text-light-accent/70 hover:text-primary transition-colors mb-4">
          ← Back to home
        </Link>
        <form onSubmit={handleSubmit} className="glass-card w-full p-8">
          <h1 className="font-display text-2xl font-semibold mb-1">Admin sign in</h1>
          <p className="text-light-accent/50 text-sm mb-8">Restricted area — owner only.</p>

        <div className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none"
          />
        </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-8 disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
