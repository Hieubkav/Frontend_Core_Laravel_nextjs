'use client';

import Link from 'next/link';
import MediaLibraryView from '../components/MediaLibraryView';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Media</h1>
          <p className="text-gray-600 mt-1">
            Danh sách toàn bộ file ảnh / tài liệu để upload lên hệ thống.
          </p>
        </div>
        <Link
          href="/admin/media/create"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          + Tải media mới
        </Link>
      </div>

      <MediaLibraryView showUpload={false} />
    </div>
  );
}
