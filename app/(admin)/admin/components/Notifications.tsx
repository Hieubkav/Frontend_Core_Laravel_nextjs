import React from 'react';
import { ALERTS } from '../constants';
import { AlertTriangle, Info, Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Bell size={20} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Thông báo hệ thống</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cập nhật các sự kiện quan trọng và cảnh báo.</p>
              </div>
           </div>
           <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Đánh dấu tất cả là đã đọc</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {ALERTS.map((alert) => (
            <div key={alert.id} className={`
              flex items-start gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors
            `}>
              <div className={`
                 p-2 rounded-full flex-shrink-0 mt-0.5
                 ${alert.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''}
                 ${alert.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                 ${alert.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
              `}>
                 {alert.type === 'error' && <AlertTriangle size={18} />}
                 {alert.type === 'warning' && <AlertTriangle size={18} />}
                 {alert.type === 'info' && <Info size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                   <p className="font-medium text-slate-900 dark:text-white">{alert.message}</p>
                   <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {alert.type === 'error' && 'Vui lòng kiểm tra và xử lý ngay lập tức.'}
                    {alert.type === 'warning' && 'Hệ thống phát hiện dấu hiệu bất thường.'}
                    {alert.type === 'info' && 'Thông tin cập nhật trạng thái hệ thống.'}
                </p>
              </div>
            </div>
          ))}
          {ALERTS.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                 <Bell size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                 <p>Không có thông báo mới</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;