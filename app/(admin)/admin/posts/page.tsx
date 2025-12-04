'use client';

import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type MouseEvent,
} from 'react';
import Link from 'next/link';
import {
  GripVertical,
  Pencil,
  Trash2,
  Settings2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { Post, PaginationMeta } from './types';

type ColumnKey = 'content' | 'slug' | 'status' | 'updated';

const columnOptions: { key: ColumnKey; label: string }[] = [
  { key: 'content', label: 'Mô tả ngắn' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'updated', label: 'Cập nhật' },
];

type Toast = { id: number; type: 'success' | 'error'; message: string };

const toPlainText = (content: string) => {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    if (!parsed?.root) return content;

    const walk = (node: any): string => {
      const self = typeof node?.text === 'string' ? node.text : '';
      const children = Array.isArray(node?.children) ? node.children.map(walk).join(' ') : '';
      return [self, children].filter(Boolean).join(' ');
    };

    return walk(parsed.root).replace(/\s+/g, ' ').trim();
  } catch {
    return content;
  }
};

export default function PostsPage() {
  const { loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<ColumnKey, boolean>>({
    content: true,
    slug: false, // ẩn slug mặc định
    status: true,
    updated: true,
  });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [orderDirty, setOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  useEffect(() => {
    loadPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadPosts = async (pageNumber = 1) => {
    setPageLoading(true);
    setError('');

    try {
      const response = await api.get('/posts', {
        params: { page: pageNumber },
      });

      const payload = response.data.data;
      const items = Array.isArray(payload) ? payload : payload?.data ?? [];
      const pagination = Array.isArray(payload) ? null : payload?.meta ?? null;

      setPosts(items);
      setMeta(pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bài viết');
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

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`);
      setSuccess('Đã xoá bài viết');
      pushToast('success', 'Đã xoá bài viết');
      await loadPosts(page);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Xoá thất bại';
      setError(msg);
      pushToast('error', msg);
    }
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startIndex = useMemo(() => {
    const perPage = (meta?.per_page ?? posts.length) || 0;
    const currentPage = meta?.current_page ?? page;
    return (currentPage - 1) * perPage;
  }, [meta, page, posts.length]);

  const baseColumns = 5; // checkbox + STT + drag + title + actions
  const emptyColSpan =
    baseColumns +
    Number(visibleCols.slug) +
    Number(visibleCols.status) +
    Number(visibleCols.updated);

  const renderStatusBadge = (active: boolean) => (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        active
          ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200'
          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
      }`}
    >
      {active ? 'Đang hiển thị' : 'Nháp / Ẩn'}
    </span>
  );

  const toggleStatus = async (post: Post) => {
    const next = !post.active;
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, active: next } : p)));
    try {
      await api.patch(`/posts/${post.id}`, { active: next });
      pushToast('success', next ? 'Đã bật hiển thị' : 'Đã chuyển sang nháp');
    } catch (err: any) {
      pushToast('error', err.response?.data?.message || 'Cập nhật trạng thái thất bại');
      // rollback
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, active: !next } : p)));
    }
  };

  const handleBulk = async (action: 'delete' | 'show' | 'hide') => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    try {
      if (action === 'delete') {
        await Promise.all(ids.map((id) => api.delete(`/posts/${id}`)));
        pushToast('success', `Đã xoá ${ids.length} bài viết`);
      } else {
        const active = action === 'show';
        await Promise.all(ids.map((id) => api.patch(`/posts/${id}`, { active })));
        pushToast('success', active ? 'Đã bật hiển thị' : 'Đã ẩn bài viết');
      }
      setSelectedIds(new Set());
      await loadPosts(page);
    } catch (err: any) {
      pushToast('error', err.response?.data?.message || 'Bulk action thất bại');
    }
  };

  const handleDragStart = (id: number, e: DragEvent<HTMLTableRowElement>) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLTableRowElement>, overId: number) => {
    e.preventDefault();
    if (draggingId === null || draggingId === overId) return;
    setPosts((prev) => {
      const current = [...prev];
      const from = current.findIndex((p) => p.id === draggingId);
      const to = current.findIndex((p) => p.id === overId);
      if (from === -1 || to === -1) return prev;
      const [moved] = current.splice(from, 1);
      current.splice(to, 0, moved);
      return current;
    });
    setOrderDirty(true);
  };

  const handleDragEnd = () => setDraggingId(null);

  const saveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await Promise.all(
        posts.map((p, index) => api.patch(`/posts/${p.id}`, { order: index + 1 }))
      );
      pushToast('success', 'Đã lưu thứ tự');
      setOrderDirty(false);
    } catch (err: any) {
      pushToast('error', err.response?.data?.message || 'Lưu thứ tự thất bại');
    } finally {
      setIsSavingOrder(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)));
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

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  if (authLoading || pageLoading) {
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản lý bài viết</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Danh sách bài viết và trạng thái hiển thị.
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
                  <p className="pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                    Slug mặc định được ẩn, bật khi cần kiểm tra SEO.
                  </p>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/admin/posts/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            + Tạo bài viết
          </Link>
        </div>
      </div>

      {(orderDirty || selectedIds.size > 0) && (
        <div className="flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-700 dark:text-slate-200">Bulk action:</span>
            <button
              onClick={() => handleBulk('show')}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <Eye size={16} /> Hiển thị
            </button>
            <button
              onClick={() => handleBulk('hide')}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40"
            >
              <EyeOff size={16} /> Ẩn
            </button>
            <button
              onClick={() => handleBulk('delete')}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/40 disabled:opacity-40"
            >
              <Trash2 size={16} /> Xoá
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedIds.size} mục đã chọn
            </span>
          </div>

          {orderDirty && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Thứ tự đã thay đổi</span>
              <button
                onClick={saveOrder}
                disabled={isSavingOrder}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSavingOrder ? 'Đang lưu...' : 'Lưu thứ tự'}
              </button>
            </div>
          )}
        </div>
      )}

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

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-xs font-semibold uppercase text-slate-700 dark:text-slate-200">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === posts.length && posts.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                  />
                </th>
                <th className="px-4 py-3 w-12">STT</th>
                <th className="px-4 py-3 w-12 text-center">Kéo</th>
                <th className="px-4 py-3">Tiêu đề</th>
                {visibleCols.slug && <th className="px-4 py-3">Slug</th>}
                {visibleCols.status && <th className="px-4 py-3">Trạng thái</th>}
                {visibleCols.updated && <th className="px-4 py-3">Cập nhật</th>}
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={emptyColSpan}
                    className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    Chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => {
                  const rowNumber = startIndex + idx + 1;
                  const zebra =
                    idx % 2 === 0
                      ? 'bg-white dark:bg-slate-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40';

                  return (
                    <tr
                      key={post.id}
                      draggable
                      onDragStart={(e) => handleDragStart(post.id, e)}
                      onDragOver={(e) => handleDragOver(e, post.id)}
                      onDragEnd={handleDragEnd}
                      className={`${zebra} border-b last:border-0 border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors`}
                    >
                      <td className="px-4 py-4" onClick={stopPropagation}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={() => toggleSelectRow(post.id)}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 accent-indigo-600"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-100">
                        {rowNumber}
                      </td>
                      <td className="px-4 py-4 text-center text-slate-400 dark:text-slate-500">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                          <GripVertical size={16} />
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {post.title}
                        </div>
                        {visibleCols.content && (
                          <p className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-xl">
                            {toPlainText(post.content)}
                          </p>
                        )}
                      </td>
                      {visibleCols.slug && (
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                          {post.slug || '—'}
                        </td>
                      )}
                      {visibleCols.status && (
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleStatus(post)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                              post.active
                                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-100 dark:border-green-500/30'
                                : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                            }`}
                          >
                            {post.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {post.active ? 'Đang hiển thị' : 'Nháp / Ẩn'}
                          </button>
                        </td>
                      )}
                      {visibleCols.updated && (
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {new Date(post.updated_at || post.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-slate-700"
                            title="Xoá"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg shadow px-4 py-3 border border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Trang {meta.current_page} / {meta.last_page} - Tổng {meta.total} bài viết
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={meta.current_page <= 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Trước
            </button>
            <button
              onClick={() => setPage((p) => (meta.current_page >= meta.last_page ? p : p + 1))}
              disabled={meta.current_page >= meta.last_page}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Sau
            </button>
          </div>
        </div>
      )}

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

