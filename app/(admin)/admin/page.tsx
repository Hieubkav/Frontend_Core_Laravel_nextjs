'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import Analytics from './components/Analytics';
import Notifications from './components/Notifications';
import { User } from './types';

export default function AdminPage() {
  // Theme State (start light to match SSR, hydrate from storage on mount)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hydrate theme from localStorage / system preference once on client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored === 'dark' ? true : stored === 'light' ? false : prefersDark;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDarkMode(next);
  }, []);
  
  // Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Navigation/View State
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Toggle Theme Class on Body + persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedUser(null);
    setMobileSidebarOpen(false);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setCurrentView('user-detail');
  };

  const getBreadcrumbs = () => {
    if (currentView === 'dashboard') return ['Tổng Quan'];
    if (currentView === 'users') return ['Người Dùng', 'Danh Sách'];
    if (currentView === 'user-detail') return ['Người Dùng', selectedUser?.name || 'Chi Tiết'];
    if (currentView === 'orders') return ['Đơn Hàng'];
    if (currentView === 'products') return ['Sản Phẩm'];
    if (currentView === 'analytics') return ['Phân Tích & Báo Cáo'];
    if (currentView === 'notifications') return ['Thông Báo'];
    if (currentView === 'settings') return ['Cài Đặt'];
    if (currentView === 'data') return ['Quản Lý Dữ Liệu'];
    return [currentView];
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans`}>
      
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-30 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
         <Sidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed}
            currentView={currentView}
            onChangeView={handleViewChange}
         />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header 
           toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
           isDarkMode={isDarkMode} 
           toggleTheme={handleThemeToggle}
           breadcrumbs={getBreadcrumbs()}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="mb-8">
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                  {currentView === 'user-detail' ? 'Chi Tiết Hồ Sơ' : getBreadcrumbs()[0]}
               </h1>
               <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {currentView === 'dashboard' && 'Chào mừng quay lại! Đây là tình hình kinh doanh hôm nay.'}
                  {currentView === 'users' && 'Quản lý thông tin và trạng thái người dùng.'}
                  {currentView === 'user-detail' && `Xem và chỉnh sửa thông tin của ${selectedUser?.name}.`}
                  {currentView === 'analytics' && 'Phân tích xu hướng tăng trưởng và hiệu suất sản phẩm.'}
                  {currentView === 'notifications' && 'Các cảnh báo và thông tin quan trọng từ hệ thống.'}
               </p>
            </div>

            {/* View Content Router */}
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'users' && <UserList onSelectUser={handleUserSelect} />}
            {currentView === 'user-detail' && selectedUser && (
               <UserDetail user={selectedUser} onBack={() => setCurrentView('users')} />
            )}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'notifications' && <Notifications />}
            
            {/* Placeholder for other views */}
            {['orders', 'products', 'data', 'settings'].includes(currentView) && (
               <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                  <p className="text-slate-400">Module đang được phát triển...</p>
                  <button onClick={() => setCurrentView('dashboard')} className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">Quay về trang chủ</button>
               </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
