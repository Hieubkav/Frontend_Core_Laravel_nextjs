'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import UserForm, { UserFormValues } from '../../components/UserForm';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  created_at: string;
}

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

  const loadUser = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data.data as User);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không tìm thấy người dùng');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UserFormValues) => {
    if (!userId) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/users/${userId}`, {
        name: values.name.trim(),
        email: values.email.trim(),
        ...(values.password && { password: values.password.trim() }),
        role: values.role,
      });

      setUser(response.data.data as User);
      setSuccess('Đã cập nhật người dùng');
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Đang tải người dùng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-500/40">
          {error || 'Không tìm thấy người dùng'}
        </div>
        <Link
          href="/admin/users"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Chỉnh sửa người dùng</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Cập nhật thông tin và quyền truy cập.
          </p>
        </div>
        <Link
          href="/admin/users"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-500/40">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-500/40">
          {error}
        </div>
      )}

      <UserForm
        initialValues={{
          name: user.name,
          email: user.email,
          password: '',
          role: user.role as 'user' | 'admin',
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Lưu thay đổi"
        hidePassword={true}
        extraActions={
          <Link
            href="/admin/users"
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-semibold"
          >
            Hủy
          </Link>
        }
      />
    </div>
  );
}
