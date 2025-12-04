'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

type SettingForm = {
  site_name: string;
  primary_color: string;
  secondary_color: string;
  seo_title: string;
  seo_description: string;
  phone: string;
  address: string;
  email: string;
};

const initialValues: SettingForm = {
  site_name: '',
  primary_color: '#000000',
  secondary_color: '#ffffff',
  seo_title: '',
  seo_description: '',
  phone: '',
  address: '',
  email: '',
};

export default function SettingsPage() {
  const { loading: authLoading } = useAuth();
  const [form, setForm] = useState<SettingForm>(initialValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await api.get('/settings');
        const data = res.data?.data ?? {};
        setForm({
          site_name: data.site_name ?? '',
          primary_color: data.primary_color || '#000000',
          secondary_color: data.secondary_color || '#ffffff',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          email: data.email ?? '',
        });
      } catch (err: unknown) {
        const message = extractErrorMessage(err, 'Không tải được setting');
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  const handleChange =
    (key: keyof SettingForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/settings', form);
      setSuccess('Đã cập nhật cài đặt thành công');
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Cập nhật thất bại');
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const extractErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string; errors?: Record<string, string[]> };
      if (data?.errors) {
        const first = Object.values(data.errors)[0];
        if (Array.isArray(first) && first[0]) return first[0];
      }
      if (typeof data?.message === 'string') return data.message;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cài đặt website</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Quản lý thông tin chung, màu sắc và SEO cho website.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-500/40">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-500/40">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Thông tin chung</h2>
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">Tên website</label>
              <input
                type="text"
                value={form.site_name}
                onChange={handleChange('site_name')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ví dụ: ZenBlog"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-300">Màu chủ đạo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primary_color || '#000000'}
                    onChange={handleChange('primary_color')}
                    className="h-10 w-16 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    value={form.primary_color}
                    onChange={handleChange('primary_color')}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-600 dark:text-slate-300">Màu phụ</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.secondary_color || '#ffffff'}
                    onChange={handleChange('secondary_color')}
                    className="h-10 w-16 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    value={form.secondary_color}
                    onChange={handleChange('secondary_color')}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Liên hệ</h2>
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">Số điện thoại</label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange('phone')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                placeholder="0123 456 789"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">Địa chỉ</label>
              <input
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">SEO</h2>
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-300">SEO Title</label>
            <input
              type="text"
              value={form.seo_title}
              onChange={handleChange('seo_title')}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              placeholder="Tiêu đề cho công cụ tìm kiếm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-300">SEO Description</label>
            <textarea
              value={form.seo_description}
              onChange={handleChange('seo_description')}
              rows={4}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              placeholder="Mô tả ngắn cho công cụ tìm kiếm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}
