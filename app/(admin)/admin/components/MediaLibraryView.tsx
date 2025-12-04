'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Copy, ExternalLink, Image as ImageIcon, Loader2, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { MediaItem, PaginationMeta } from '../media/types';
import { formatSize, isImageMime } from '../media/utils';
import MediaUploadForm from '../media/components/MediaUploadForm';

type FilterType = 'all' | 'image' | 'pdf';

interface MediaLibraryViewProps {
  onSelect?: (item: MediaItem) => void;
  dense?: boolean;
  autoClose?: () => void;
  showUpload?: boolean;
}

export default function MediaLibraryView({
  onSelect,
  dense = false,
  autoClose,
  showUpload = true,
}: MediaLibraryViewProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyId, setCopyId] = useState<number | null>(null);

  const loadMedia = async (pageNumber = 1) => {
    setLoading(true);
    setError('');

    try {
      const params: Record<string, any> = { page: pageNumber };
      if (search.trim()) params.search = search.trim();
      if (typeFilter === 'image') params.mime_type = 'image/';
      if (typeFilter === 'pdf') params.mime_type = 'application/pdf';

      const res = await api.get('/media', { params });
      const payload = res.data.data;
      const data = Array.isArray(payload) ? payload : payload?.data ?? [];
      const pagination = Array.isArray(payload) ? null : (payload?.meta as PaginationMeta | null);

      setItems(data);
      setMeta(pagination);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const handleUploaded = (item: MediaItem) => {
    setItems((prev) => [item, ...prev]);
    loadMedia(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa media này?')) return;
    try {
      await api.delete(`/media/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa');
    }
  };

  const handleCopy = async (url: string, id: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyId(id);
      setTimeout(() => setCopyId((prev) => (prev === id ? null : prev)), 2000);
    } catch {
      setError('Không thể copy URL');
    }
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMedia(1);
  };

  const gridCols = dense
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  const footerInfo = useMemo(() => {
    if (!meta) return '';
    const start = (meta.current_page - 1) * meta.per_page + 1;
    const end = Math.min(meta.current_page * meta.per_page, meta.total);
    return `${start}-${end} / ${meta.total}`;
  }, [meta]);

  const topLayout = dense
    ? 'gap-3'
    : showUpload
      ? 'md:flex-row md:items-start md:justify-between gap-4'
      : 'gap-4';

  return (
    <div className="space-y-4">
      <div className={`flex flex-col ${topLayout}`}>
        <form
          onSubmit={handleSubmitSearch}
          className={`flex flex-col sm:flex-row gap-2 ${showUpload ? 'w-full md:w-auto' : 'w-full'}`}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc file..."
            className="w-full sm:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="image">Ảnh</option>
              <option value="pdf">PDF</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm font-semibold shadow hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={14} />
              Tải lại
            </button>
          </div>
        </form>

        {showUpload && (
          <div className="w-full md:w-[420px]">
            <MediaUploadForm compact onUploaded={handleUploaded} />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin mr-2" size={20} />
          Đang tải...
        </div>
      ) : (
        <div className={`grid ${gridCols} gap-4`}>
          {items.map((item) => {
            const image = isImageMime(item.mime_type);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                  {image ? (
                    <Image
                      src={item.thumbnail_url || item.url}
                      alt={item.custom_properties?.alt || item.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-500 gap-2 text-sm">
                      <ImageIcon size={18} />
                      {item.mime_type || 'file'}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow hover:shadow-md"
                      title="Copy URL"
                    >
                      {copyId === item.id ? <CheckIcon /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow hover:shadow-md"
                      title="Mở tab mới"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3 space-y-2 text-sm flex-1 flex flex-col">
                  <div className="font-semibold line-clamp-2 break-words">{item.name || item.file_name}</div>
                  <div className="text-slate-500 text-xs">
                    {item.mime_type || 'N/A'}  {formatSize(item.size)}
                  </div>
                  {item.custom_properties?.title && (
                    <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {item.custom_properties.title}
                    </div>
                  )}
                  <div className="mt-auto flex gap-2">
                    {onSelect && (
                      <button
                        onClick={() => {
                          onSelect(item);
                          autoClose?.();
                        }}
                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-3 py-2 text-xs font-semibold hover:bg-emerald-700"
                      >
                        Dùng
                      </button>
                    )}
                    {!onSelect && (
                      <Link
                        href={`/admin/media/${item.id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-300 px-3 py-2 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-slate-800"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={14} />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-xs font-semibold hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!items.length && (
            <div className="col-span-full text-center py-12 text-slate-500">
              Không có media nào.
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <div>{footerInfo}</div>
        {meta && (
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => loadMedia(page - 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              Trước
            </button>
            <div className="px-2">
              {meta.current_page}/{meta.last_page}
            </div>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => loadMedia(page + 1)}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-3 w-3 text-emerald-600"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);
