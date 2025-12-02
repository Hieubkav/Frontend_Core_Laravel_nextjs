import React from 'react';
import StatCard from './StatCard';
import { DASHBOARD_STATS } from '../constants';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat, index) => (
          <StatCard key={index} data={stat} />
        ))}
      </div>
      
      {/* Empty State / Welcome Message for minimalism */}
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="text-4xl mb-4">👋</div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chào mừng trở lại!</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
            Hệ thống đang hoạt động ổn định. Chọn một module từ menu bên trái (Phân tích, Người dùng, Đơn hàng...) để bắt đầu làm việc.
          </p>
      </div>
    </div>
  );
};

export default Dashboard;