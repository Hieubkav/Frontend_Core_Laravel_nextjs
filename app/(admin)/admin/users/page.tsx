'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import api from '@/lib/api';
import { Pencil, Trash2, Settings2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  created_at: string;
}

type ColumnKey = 'email' | 'role' | 'created';

const columnOptions: { key: ColumnKey; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Vai trò' },
  { key: 'created', label: 'Ngày tạo' },
];

type Toast = { id: number; type: 'success' | 'error'; message: string };

export default function UsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    email: true,
    role: true,
    created: true,
  });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<{ data: User[] }>('/users');
      setUsers(response.data.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể tải danh sách người dùng';
      setError(msg);
      pushToast('error', msg);
    } finally {
      setPageLoading(false);
    }
  };

  const pushToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá người dùng này?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      pushToast('success', 'Xoá người dùng thành công');
      await loadUsers();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    } catch (err: any) {
      pushToast('error', err.response?.data?.message || 'Xoá thất bại');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.size} người dùng?`)) {
      return;
    }

    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) => api.delete(`/users/${id}`)));
      pushToast('success', `Đã xoá ${ids.length} người dùng`);
      setSelectedIds(new Set());
      await loadUsers();
    } catch (err: any) {
      pushToast('error', err.response?.data?.message || 'Xoá thất bại');
    }
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const baseColumns = 3; // checkbox + STT + actions
  const emptyColSpan =
    baseColumns +
    1 + // name column
    Number(visibleCols.email) +
    Number(visibleCols.role) +
    Number(visibleCols.created);

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Danh sách người dùng hệ thống và quyền truy cập.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setColumnMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400"
            >
              <Settings2 size={18} />
              <span className="hidden sm:inline">Ẩn / hiện cột</span>
            </button>
            {columnMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl z-10">
                <div className="p-3 space-y-2">
                  {columnOptions.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols[col.key]}
                        onChange={() => toggleColumn(col.key)}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/admin/users/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            + Tạo người dùng
          </Link>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-200">Bulk action:</span>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40 disabled:opacity-40"
            >
              <Trash2 size={16} /> Xoá ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-500/40">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-xs font-semibold uppercase text-slate-700 dark:text-slate-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                  />
                </th>
                <th className="px-4 py-3">Tên</th>
                {visibleCols.email && <th className="px-4 py-3">Email</th>}
                {visibleCols.role && <th className="px-4 py-3">Vai trò</th>}
                {visibleCols.created && <th className="px-4 py-3">Ngày tạo</th>}
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={emptyColSpan}
                    className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    Chưa có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => {
                  const zebra =
                    idx % 2 === 0
                      ? 'bg-white dark:bg-slate-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40';

                  return (
                    <tr
                      key={u.id}
                      className={`${zebra} border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(u.id)}
                          onChange={() => toggleSelectRow(u.id)}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {u.name}
                        </div>
                      </td>
                      {visibleCols.email && (
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                      )}
                      {visibleCols.role && (
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              u.is_admin
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200'
                            }`}
                          >
                            {u.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                          </span>
                        </td>
                      )}
                      {visibleCols.created && (
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {new Date(u.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${u.id}/edit`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} />
                          </Link>
                          {currentUser?.id !== u.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-slate-700"
                              title="Xoá"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast stack */}
      <div className="fixed top-6 right-6 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] max-w-sm px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === 'success'
                ? 'bg-green-600 text-white border-green-500'
                : 'bg-red-600 text-white border-red-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
