'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MediaUploadForm from '../components/MediaUploadForm';
import { MediaItem } from '../types';

export default function CreateMediaPage() {
  const router = useRouter();
  const [success, setSuccess] = useState('');

  const handleUploaded = (item: MediaItem) => {
    setSuccess('Tải media thành công');
    setTimeout(() => router.push(`/admin/media/${item.id}`), 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tải media mới</h1>
          <p className="text-gray-600 mt-1">
            Chọn file, nhập metadata và tải lên hệ thống. Sau khi tải xong bạn có thể chỉnh sửa thêm.
          </p>
        </div>
        <Link
          href="/admin/media"
          className="text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <MediaUploadForm onUploaded={handleUploaded} submitLabel="Tải lên" />
    </div>
  );
}
