import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import api from '../../utils/api.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import ImageUploadField from './ImageUploadField.jsx';

/**
 * ResourceManager — config-driven CRUD UI shared by Projects, Skills,
 * Experience, Achievements, and Certifications admin screens.
 *
 * fields: [{ key, label, type: 'text'|'textarea'|'number'|'checkbox'|'tags'|'select'|'image', options? }]
 */
export default function ResourceManager({ title, endpoint, writeEndpoint, fields, paginated = false, getLabel }) {
  const writeBase = writeEndpoint || endpoint;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = paginated ? { search, page, limit: 10 } : {};
      const { data } = await api.get(endpoint, { params });
      setItems(data.data || []);
      if (paginated && data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch {
      toast.error(`Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, search, page, paginated, title]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    const initial = {};
    fields.forEach((f) => { initial[f.key] = f.type === 'tags' ? [] : f.type === 'checkbox' ? false : ''; });
    setForm(initial);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`${writeBase}/${editing.id}`, form);
        toast.success('Updated');
      } else {
        await api.post(writeBase, form);
        toast.success('Created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${writeBase}/${confirmDelete.id}`);
      toast.success('Deleted');
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <button onClick={openCreate} className="btn-primary !px-5 !py-2.5 text-sm">
          <FiPlus /> New
        </button>
      </div>

      {paginated && (
        <div className="relative mb-6 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-light-accent/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="bg-white/[0.04] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm w-full focus:border-primary/50 outline-none"
          />
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-light-accent/50 text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-light-accent/50 text-sm">Nothing here yet — create the first one.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="p-4 text-white">{getLabel ? getLabel(item) : item.title || item.name}</td>
                  <td className="p-4 w-24 text-right">
                    <button onClick={() => openEdit(item)} className="text-light-accent/60 hover:text-primary p-2">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(item)} className="text-light-accent/60 hover:text-red-400 p-2">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-full text-xs ${p === page ? 'bg-primary text-bg' : 'text-light-accent/60 hover:bg-white/[0.06]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="glass-card w-full max-w-lg p-6 my-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-medium">{editing ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h3>
                <button type="button" onClick={() => setModalOpen(false)} className="text-light-accent/50 hover:text-white">
                  <FiX />
                </button>
              </div>

              <div className="space-y-5">
                {fields.map((f) => (
                  <FieldInput key={f.key} field={f} value={form[f.key]} onChange={(v) => updateField(f.key, v)} />
                ))}
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full mt-8 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Delete "${confirmDelete?.title || confirmDelete?.name || ''}"?`}
        description="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const base = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors';

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2">{field.label}</label>
        <textarea rows={4} className={`${base} resize-none`} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="accent-primary w-4 h-4" />
        <span className="text-sm text-light-accent/80">{field.label}</span>
      </label>
    );
  }
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2">{field.label}</label>
        <select className={base} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o} value={o} className="bg-bg">{o}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === 'tags') {
    return (
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2">
          {field.label} <span className="normal-case text-light-accent/30">(comma separated)</span>
        </label>
        <input
          className={base}
          value={(value || []).join(', ')}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      </div>
    );
  }
  if (field.type === 'image') {
    return <ImageUploadField label={field.label} value={value} onChange={onChange} />;
  }
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2">{field.label}</label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        className={base}
        value={value ?? ''}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}
