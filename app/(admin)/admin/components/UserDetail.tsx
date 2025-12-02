import React from 'react';
import { User, ActivityLog } from '../types';
import { ACTIVITY_LOG } from '../constants';
import { Mail, Phone, MapPin, Calendar, Edit2, Shield, Clock, ArrowLeft } from 'lucide-react';

interface UserDetailProps {
  user: User;
  onBack: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách
        </button>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
              Khoá tài khoản
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
              <Edit2 size={14} /> Chỉnh sửa
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
             <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-500">
               {user.name.charAt(0)}
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{user.email}</p>
             <div className="flex justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full border border-indigo-100 dark:border-indigo-800">
                   {user.role}
                </span>
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full border border-emerald-100 dark:border-emerald-800">
                   {user.status}
                </span>
             </div>
             
             <div className="border-t border-slate-100 dark:border-slate-700 pt-6 text-left space-y-4">
                <div className="flex items-center gap-3 text-sm">
                   <Mail size={16} className="text-slate-400" />
                   <span className="text-slate-600 dark:text-slate-300 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Phone size={16} className="text-slate-400" />
                   <span className="text-slate-600 dark:text-slate-300">+84 901 234 567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <MapPin size={16} className="text-slate-400" />
                   <span className="text-slate-600 dark:text-slate-300">TP. Hồ Chí Minh, Việt Nam</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Calendar size={16} className="text-slate-400" />
                   <span className="text-slate-600 dark:text-slate-300">Tham gia: 20/10/2023</span>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Thống kê</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 dark:text-slate-400">Tổng chi tiêu</span>
                   <span className="font-medium text-slate-900 dark:text-white">{user.spent}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 dark:text-slate-400">Đơn hàng</span>
                   <span className="font-medium text-slate-900 dark:text-white">14</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500 dark:text-slate-400">Đánh giá</span>
                   <span className="font-medium text-slate-900 dark:text-white">4.8/5.0</span>
                </div>
             </div>
          </div>
        </div>

        {/* Detailed Info & Timeline */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30">
                 <h3 className="font-semibold text-slate-900 dark:text-white">Hoạt động gần đây</h3>
              </div>
              <div className="p-6">
                 <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                    {ACTIVITY_LOG.map((log) => (
                       <div key={log.id} className="relative pl-8">
                          <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-white dark:border-slate-800 
                             ${log.action === 'Login' ? 'bg-emerald-400' : ''}
                             ${log.action === 'Order' ? 'bg-indigo-400' : ''}
                             ${log.action === 'Update Profile' ? 'bg-amber-400' : ''}
                             ${log.action === 'Logout' ? 'bg-slate-400' : ''}
                          `}></span>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                             <span className="font-medium text-sm text-slate-900 dark:text-white">{log.action}</span>
                             <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {log.timestamp}
                             </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-md">
                             {log.description}
                          </p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
           
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                 <h3 className="font-semibold text-slate-900 dark:text-white">Ghi chú bảo mật</h3>
                 <Shield size={16} className="text-slate-400" />
              </div>
              <div className="p-6">
                 <textarea 
                    className="w-full h-24 p-3 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    placeholder="Thêm ghi chú nội bộ về khách hàng này..."
                 ></textarea>
                 <div className="flex justify-end mt-2">
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Lưu ghi chú</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;