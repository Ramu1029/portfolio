import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';
import ImageUploadField from '../../components/admin/ImageUploadField.jsx';

const inputClass = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors';
const labelClass = 'block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2';

export default function AdminContent() {
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [savingHero, setSavingHero] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  useEffect(() => {
    api.get('/hero').then(({ data }) => setHero(data.data));
    api.get('/about').then(({ data }) => setAbout(data.data));
  }, []);

  const saveHero = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      await api.put('/hero', hero);
      toast.success('Hero section updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSavingHero(false);
    }
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    setSavingAbout(true);
    try {
      await api.put('/about', about);
      toast.success('About section updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSavingAbout(false);
    }
  };

  if (!hero || !about) return <p className="text-light-accent/50 text-sm">Loading...</p>;

  return (
    <div className="space-y-10 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Site content</h1>

      <form onSubmit={saveHero} className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg font-medium">Hero section</h2>
        <div>
          <label className={labelClass}>Greeting</label>
          <input className={inputClass} value={hero.greeting || ''} onChange={(e) => setHero({ ...hero, greeting: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Name</label>
          <input className={inputClass} value={hero.name || ''} onChange={(e) => setHero({ ...hero, name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Roles (comma separated)</label>
          <input
            className={inputClass}
            value={(hero.roles || []).join(', ')}
            onChange={(e) => setHero({ ...hero, roles: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
          />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <textarea rows={3} className={`${inputClass} resize-none`} value={hero.tagline || ''} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Resume URL</label>
          <input className={inputClass} value={hero.resume_url || ''} onChange={(e) => setHero({ ...hero, resume_url: e.target.value })} />
        </div>
        <button type="submit" disabled={savingHero} className="btn-primary disabled:opacity-60">
          {savingHero ? 'Saving...' : 'Save hero section'}
        </button>
      </form>

      <form onSubmit={saveAbout} className="glass-card p-6 space-y-5">
        <h2 className="font-display text-lg font-medium">About section</h2>
        <div>
          <label className={labelClass}>Heading</label>
          <input className={inputClass} value={about.heading || ''} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Content</label>
          <textarea rows={4} className={`${inputClass} resize-none`} value={about.content || ''} onChange={(e) => setAbout({ ...about, content: e.target.value })} />
        </div>
        <ImageUploadField label="Photo" value={about.image} onChange={(v) => setAbout({ ...about, image: v })} />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Years exp.</label>
            <input type="number" className={inputClass} value={about.years_experience || 0} onChange={(e) => setAbout({ ...about, years_experience: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Projects</label>
            <input type="number" className={inputClass} value={about.projects_completed || 0} onChange={(e) => setAbout({ ...about, projects_completed: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Clients</label>
            <input type="number" className={inputClass} value={about.happy_clients || 0} onChange={(e) => setAbout({ ...about, happy_clients: Number(e.target.value) })} />
          </div>
        </div>
        <button type="submit" disabled={savingAbout} className="btn-primary disabled:opacity-60">
          {savingAbout ? 'Saving...' : 'Save about section'}
        </button>
      </form>
    </div>
  );
}
