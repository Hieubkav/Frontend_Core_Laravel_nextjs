'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  FileText,
  Images,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentView?: string;
  currentPath?: string;
  onChangeView?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  currentView,
  currentPath,
  onChangeView,
}) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng Quan', href: '/admin' },
    { id: 'posts', icon: FileText, label: 'Bài viết', href: '/admin/posts' },
    { id: 'media', icon: Images, label: 'Media', href: '/admin/media' },
    { id: 'users', icon: Users, label: 'Người dùng', href: '/admin/users' },
    { id: 'settings', icon: Settings, label: 'Cài Đặt', href: '/admin/settings' },
  ];

  const bottomItems = [{ id: 'notifications', icon: Bell, label: 'Thông Báo' }];

  const normalizePath = (path?: string | null) =>
    (path || '').replace(/\/+$/, '') || '/';

  const activeNormalized = normalizePath(activePath);

  const isActive = (itemId: string, href?: string) => {
    if (href) {
      const hrefNormalized = normalizePath(href);
      // Dashboard chỉ active ở dạng /admin, không áp theo các route con
      if (hrefNormalized === '/admin') {
        return activeNormalized === hrefNormalized;
      }
      return activeNormalized.startsWith(hrefNormalized);
    }
    return currentView === itemId;
  };

  const renderItem = (item: (typeof menuItems)[number]) => {
    const active = isActive(item.id, item.href);
    const commonClasses = `
      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
      ${
        active
          ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      }
      ${collapsed ? 'justify-center' : ''}
    `;
    const iconClass = active
      ? 'text-slate-200'
      : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-300';

    if (item.href) {
      return (
        <Link
          key={item.id}
          href={item.href}
          className={commonClasses}
          title={collapsed ? item.label : undefined}
        >
          <item.icon size={20} className={iconClass} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onChangeView && onChangeView(item.id)}
        className={commonClasses}
        title={collapsed ? item.label : undefined}
      >
        <item.icon size={20} className={iconClass} />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`
        ${collapsed ? 'w-20' : 'w-64'}
        flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        h-screen sticky top-0 transition-all duration-300 z-30
      `}
    >
      {/* Logo Area */}
      <div
        className={`p-6 flex items-center ${
          collapsed ? 'justify-center' : 'justify-between'
        } border-b border-slate-100 dark:border-slate-800 h-16`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">Z</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ZenUI
            </span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold">Z</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400
            ${collapsed ? 'hidden' : 'block'}
          `}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
        {menuItems.map(renderItem)}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors
                ${collapsed ? 'justify-center' : ''}
             `}
          >
            <item.icon size={20} className="text-slate-500 dark:text-slate-500" />
            {!collapsed && item.label}
          </button>
        ))}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
