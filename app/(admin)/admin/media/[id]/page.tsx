'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ExternalLink, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { MediaItem } from '../types';
import { formatSize, isImageMime } from '../utils';

export default function EditMediaPage() {
  const params = useParams<{ id: string }>();
  const mediaId = params?.id;

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (mediaId) {
      loadMedia(mediaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  const loadMedia = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/media/${id}`);
      const item = response.data.data as MediaItem;
      setMedia(item);
      setName(item.name || '');
      setTitle(item.custom_properties?.title || '');
      setAlt(item.custom_properties?.alt || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không tìm thấy media');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mediaId) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/media/${mediaId}`, {
        name: name.trim() || null,
        title: title.trim() || null,
        alt: alt.trim() || null,
      });
      const item = response.data.data as MediaItem;
      setMedia(item);
      setSuccess('Đã cập nhật metadata');
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError?.[0] || 'Cập nhật thất bại');
      } else {
        setError(err.response?.data?.message || 'Cập nhật thất bại');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p>Đang tải media...</p>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error || 'Không tìm thấy media'}
        </div>
        <Link
          href="/admin/media"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isImage = isImageMime(media.mime_type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chỉnh sửa media</h1>
          <p className="text-gray-600 mt-1">Cập nhật tên hiển thị, title, alt cho file.</p>
        </div>
        <Link
          href="/admin/media"
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tên hiển thị</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="VD: Banner trang chủ"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="SEO title hoặc chú thích"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Alt text</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Mô tả ngắn gọn cho ảnh"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              href="/admin/media"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Hủy
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin" size={16} />}
              Lưu thay đổi
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="relative aspect-video rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800">
            {isImage ? (
              <Image
                src={media.thumbnail_url || media.url}
                alt={media.custom_properties?.alt || media.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-300">
                {media.mime_type || 'File'}
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold">File</span>
              <span className="text-slate-500 dark:text-slate-400">{media.file_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Loại</span>
              <span className="text-slate-500 dark:text-slate-400">{media.mime_type || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Dung lượng</span>
              <span className="text-slate-500 dark:text-slate-400">{formatSize(media.size)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Tạo</span>
              <span className="text-slate-500 dark:text-slate-400">
                {new Date(media.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={media.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800"
            >
              <ExternalLink size={16} />
              Mở trong tab mới
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
