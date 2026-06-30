import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import api from '../../utils/api.js';

export default function ImageUploadField({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wide text-light-accent/50 mb-2">
        {label}
      </label>
      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bg/80 flex items-center justify-center text-white"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <label className="w-32 h-32 rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/40 text-light-accent/50 text-xs">
          <FiUpload />
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  );
}
