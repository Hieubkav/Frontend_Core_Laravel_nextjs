import React from 'react';
import OverviewChart from './OverviewChart';
import { TOP_PRODUCTS } from '../constants';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <OverviewChart />
        </div>
        
        {/* Top Products */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Hiệu Suất</h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><MoreHorizontal size={18} /></button>
          </div>
          <div className="flex-1 overflow-auto pr-2">
            <ul className="space-y-5">
              {TOP_PRODUCTS.map((product) => (
                <li key={product.id} className="flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.revenue}</p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${product.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {product.growth > 0 ? '+' : ''}{product.growth}%
                       <ArrowUpRight size={10} className={product.growth < 0 ? 'rotate-90' : ''} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full mt-6 py-2 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;