'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import PostForm, { PostFormValues } from '../components/PostForm';

export default function CreatePostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (values: PostFormValues) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/posts', {
        title: values.title.trim(),
        slug: values.slug.trim(),
        content: values.content.trim(),
        active: values.active,
        thumbnail: values.thumbnail.trim() || null,
        order: values.order === '' ? undefined : Number(values.order),
      });

      setSuccess('Tạo bài viết thành công');
      setTimeout(() => router.push('/admin/posts'), 800);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError?.[0] || 'Tạo bài viết thất bại');
      } else {
        setError(err.response?.data?.message || 'Tạo bài viết thất bại');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tạo bài viết</h1>
          <p className="text-gray-600 mt-1">Nhập thông tin và lưu để xuất bản.</p>
        </div>
        <Link
          href="/admin/posts"
          className="text-blue-600 hover:text-blue-700 font-semibold"
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

      <PostForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Tạo bài viết"
        hideSlug
        hideOrder
        extraActions={
          <Link
            href="/admin/posts"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Huỷ
          </Link>
        }
      />
    </div>
  );
}