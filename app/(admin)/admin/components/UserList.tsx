import React, { useState } from 'react';
import { USERS_DATA } from '../constants';
import { Search, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { User } from '../types';

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const filteredData = USERS_DATA.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(u => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 h-10 w-full sm:w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
             <Filter size={16} />
             <span>Lọc</span>
           </button>
           <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
             <Download size={16} />
             <span>Export</span>
           </button>
           <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
             + Thêm Mới
           </button>
        </div>
      </div>

      {/* Bulk Actions Alert */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-4 py-2 rounded-lg flex items-center justify-between">
           <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Đã chọn {selectedIds.length} hàng</span>
           <div className="flex gap-2">
              <button className="text-xs text-rose-600 dark:text-rose-400 hover:underline">Xoá</button>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Gửi Email</button>
           </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 w-4">
                  <input type="checkbox" 
                    checked={selectedIds.length === filteredData.length && filteredData.length > 0} 
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700" 
                  />
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200">
                  <div className="flex items-center gap-1">Người Dùng <ArrowUpDown size={14} /></div>
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Trạng Thái</th>
                <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Vai Trò</th>
                <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-right">Chi Tiêu</th>
                <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredData.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" 
                       checked={selectedIds.includes(user.id)}
                       onChange={() => toggleSelect(user.id)}
                       className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectUser(user)}>
                      <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                      ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                      ${user.status === 'Inactive' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : ''}
                      ${user.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                    `}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.role}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">{user.spent}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded transition-colors"
                            title="Sửa"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded transition-colors"
                            title="Xoá"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
             Hiển thị 1-7 trong 248 kết quả
          </div>
          <div className="flex items-center gap-2">
             <button className="p-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
                <ChevronLeft size={16} className="text-slate-500" />
             </button>
             <button className="p-1 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                <ChevronRight size={16} className="text-slate-500" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;