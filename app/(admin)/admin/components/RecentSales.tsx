import React from 'react';
import { RECENT_TRANSACTIONS } from '../constants';

const RecentSales: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Giao Dịch Gần Đây</h3>
        <p className="text-sm text-slate-500">Bạn đã có {RECENT_TRANSACTIONS.length} giao dịch hôm nay.</p>
      </div>
      <div className="space-y-6">
        {RECENT_TRANSACTIONS.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium overflow-hidden">
                {/* Fallback avatar logic */}
                <span className="text-sm">{transaction.user.split(' ').map(n => n[0]).join('').substring(0,2)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {transaction.user}
                </p>
                <p className="text-xs text-slate-500">{transaction.email}</p>
              </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{transaction.amount}</p>
                <p className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1
                    ${transaction.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${transaction.status === 'Pending' ? 'bg-amber-50 text-amber-600' : ''}
                    ${transaction.status === 'Failed' ? 'bg-red-50 text-red-600' : ''}
                `}>
                    {transaction.status}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;