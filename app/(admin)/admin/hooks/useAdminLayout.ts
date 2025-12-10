'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAdminLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return stored === 'dark' ? true : stored === 'light' ? false : prefersDark;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => setIsDarkMode((v) => !v);

  const handleChangeView = (view: string) => {
    const map: Record<string, string> = {
      dashboard: '/admin',
      posts: '/admin/posts',
      media: '/admin/media',
      users: '/admin/users',
      settings: '/admin/settings',
    };
    const target = map[view];
    if (target) router.push(target);
  };

  const getCurrentView = () => {
    if (pathname?.includes('/posts')) return 'posts';
    if (pathname?.includes('/media')) return 'media';
    if (pathname?.includes('/users')) return 'users';
    if (pathname?.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const getBreadcrumbs = () => {
    const view = getCurrentView();

    if (view === 'posts') {
      if (pathname?.endsWith('/create')) return ['Bài viết', 'Tạo mới'];
      if (pathname?.match(/\/posts\/\d+(?:\/edit)?$/)) return ['Bài viết', 'Chỉnh sửa'];
      return ['Bài viết', 'Danh sách'];
    }

    if (view === 'media') {
      if (pathname?.endsWith('/media/create')) return ['Media', 'Tải mới'];
      if (pathname?.match(/\/media\/[^/]+$/)) return ['Media', 'Chỉnh sửa'];
      return ['Media', 'Danh sách'];
    }

    if (view === 'users') {
      if (pathname?.endsWith('/edit')) return ['Người dùng', 'Chỉnh sửa'];
      return ['Người dùng', 'Danh sách'];
    }

    if (view === 'settings') {
      return ['Cài đặt'];
    }

    return ['Dashboard'];
  };

  return {
    isDarkMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    mediaModalOpen,
    setMediaModalOpen,
    pathname,
    handleThemeToggle,
    handleChangeView,
    getCurrentView,
    getBreadcrumbs,
  };
}
