'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MediaModal from './components/MediaModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  // Apply theme class + persist
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

  return (
    <div
      className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans`}
    >
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          currentView={getCurrentView()}
          currentPath={pathname}
          onChangeView={handleChangeView}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          isDarkMode={isDarkMode}
          toggleTheme={handleThemeToggle}
          breadcrumbs={getBreadcrumbs()}
          onOpenMedia={() => setMediaModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <MediaModal open={mediaModalOpen} onClose={() => setMediaModalOpen(false)} />
      </div>
    </div>
  );
}
