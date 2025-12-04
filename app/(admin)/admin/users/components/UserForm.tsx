'use client';

import { useState } from 'react';
import React from 'react';

export interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
  hidePassword?: boolean;
  extraActions?: React.ReactNode;
}

export default function UserForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel = 'Lưu',
  hidePassword = false,
  extraActions,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    password: initialValues?.password || '',
    role: initialValues?.role || 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          {!hidePassword && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Min 8 ký tự, chữ hoa, chữ thường, số"
                required={!hidePassword}
              />
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-semibold"
        >
          {submitting ? 'Đang lưu...' : submitLabel}
        </button>
        {extraActions}
      </div>
    </form>
  );
}
