import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api.js';

const inputClass = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors';
const labelClass = 'block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-light-accent/50 text-sm">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold mb-8">Site settings</h1>
      <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
        <div>
          <label className={labelClass}>Site title</label>
          <input className={inputClass} value={settings.site_title || ''} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Site description (SEO)</label>
          <textarea rows={3} className={`${inputClass} resize-none`} value={settings.site_description || ''} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Contact email</label>
          <input className={inputClass} value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={settings.location || ''} onChange={(e) => setSettings({ ...settings, location: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Meta keywords</label>
          <input className={inputClass} value={settings.meta_keywords || ''} onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
