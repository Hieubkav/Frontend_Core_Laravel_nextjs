'use client';

import React from 'react';

const Dashboard: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {formattedDate}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
          Trang quản trị
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-4">
          Sử dụng menu bên trái để truy cập các chức năng quản lý.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;