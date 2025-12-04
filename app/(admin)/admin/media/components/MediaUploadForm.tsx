'use client';

import { useEffect, useState } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { MediaItem } from '../types';
import { formatSize, isImageMime } from '../utils';

interface MediaUploadFormProps {
  onUploaded?: (item: MediaItem) => void;
  compact?: boolean;
  submitLabel?: string;
}

export default function MediaUploadForm({
  onUploaded,
  compact = false,
  submitLabel = 'Upload',
}: MediaUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');

  const handleFileChange = (selected: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setError('');
    setSuccess('');

    if (!selected) {
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(selected));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    if (name.trim()) form.append('name', name.trim());
    if (title.trim()) form.append('title', title.trim());
    if (alt.trim()) form.append('alt', alt.trim());

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch('/api/media-upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      const payload = await res.json();
      if (!res.ok) {
        const detail =
          payload?.message ||
          payload?.error ||
          (typeof payload === 'string' ? payload : '') ||
          'Upload thất bại';
        throw new Error(detail);
      }

      const uploaded: MediaItem = payload.data;
      onUploaded?.(uploaded);
      setSuccess('Upload thành công');
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setName('');
      setTitle('');
      setAlt('');
    } catch (err: any) {
      setError(err.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const cardPadding = compact ? 'p-3' : 'p-4';
  const textSize = compact ? 'text-sm' : 'text-base';

  return (
    <div
      className={`bg-white/80 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl shadow-sm ${cardPadding} space-y-3`}
    >
      <div className="flex items-center gap-2">
        <UploadCloud size={18} className="text-indigo-500" />
        <span className="font-semibold text-sm">Tải file mới</span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm">
          {success}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 dark:text-slate-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
          {uploading ? 'Đang tải...' : submitLabel}
        </button>
      </div>

      {previewUrl && (
        <div className="mt-1 flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 p-2">
          {file && isImageMime(file.type) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-md border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="h-16 w-16 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-700 dark:text-slate-200">
              File
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
              {file?.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {(file?.type || 'Unknown')}  {file ? formatSize(file.size) : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleFileChange(null)}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X size={14} />
            Bỏ chọn
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${textSize}`}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên hiển thị"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-2 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-2 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950 px-2 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
