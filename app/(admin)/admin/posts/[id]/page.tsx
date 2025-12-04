'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import PostForm, { PostFormValues } from '../components/PostForm';
import { Post } from '../types';

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const postId = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (postId) {
      loadPost(postId);
    }
  }, [postId]);

  const loadPost = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data.data as Post);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không tìm thấy bài viết');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PostFormValues) => {
    if (!postId) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/posts/${postId}`, {
        title: values.title.trim(),
        slug: values.slug.trim(),
        content: values.content.trim(),
        active: values.active,
        thumbnail: values.thumbnail.trim() || null,
        order: values.order === '' ? undefined : Number(values.order),
      });

      setPost(response.data.data as Post);
      setSuccess('Đã cập nhật bài viết');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error || 'Không tìm thấy bài viết'}
        </div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
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
          <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
          <p className="text-gray-600 mt-1">Cập nhật nội dung và trạng thái.</p>
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
        initialValues={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          thumbnail: post.thumbnail || '',
          order:
            post.order === null || post.order === undefined
              ? ''
              : String(post.order),
          active: post.active,
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Lưu thay đổi"
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
