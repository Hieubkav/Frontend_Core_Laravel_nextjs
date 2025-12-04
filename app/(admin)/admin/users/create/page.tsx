'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import UserForm, { UserFormValues } from '../components/UserForm';

export default function CreateUserPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/users', {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        role: values.role,
      });

      setSuccess('Tạo người dùng thành công');
      setTimeout(() => router.push('/admin/users'), 800);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError?.[0] || 'Tạo thất bại');
      } else {
        setError(err.response?.data?.message || 'Tạo thất bại');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo người dùng</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Nhập thông tin và lưu để tạo tài khoản mới.
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
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Tạo người dùng"
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
