import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api.js';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact');
      setMessages(data.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`);
    load();
  };

  const handleDelete = async () => {
    await api.delete(`/contact/${confirmDelete.id}`);
    toast.success('Deleted');
    setConfirmDelete(null);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Messages</h1>

      {loading ? (
        <p className="text-light-accent/50 text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-light-accent/50 text-sm">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`glass-card p-5 ${!m.read ? 'border-primary/30' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{m.name}</h3>
                    <span className="text-light-accent/40 text-xs">{m.email}</span>
                  </div>
                  {m.subject && <p className="text-sm text-light-accent/70 mt-1">{m.subject}</p>}
                  <p className="text-sm text-light-accent/60 mt-2">{m.message}</p>
                  <p className="font-mono text-[11px] text-light-accent/30 mt-3">{m.created_at}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => markRead(m.id)} className="p-2 text-light-accent/60 hover:text-primary" title="Mark read">
                    <FiMail />
                  </button>
                  <button onClick={() => setConfirmDelete(m)} className="p-2 text-light-accent/60 hover:text-red-400" title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this message?"
        description="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
