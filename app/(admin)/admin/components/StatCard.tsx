import React from 'react';
import { StatMetric } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  data: StatMetric;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const Icon = data.icon;
  
  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10';
    if (trend === 'down') return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10';
    return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-700/50';
  };

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{data.title}</span>
        <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
           <Icon size={18} className="text-slate-700 dark:text-slate-300" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">{data.value}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${getTrendColor(data.trend)}`}>
            <TrendIcon size={12} />
            {data.change}
          </span>
          {data.description && <span className="text-xs text-slate-400 dark:text-slate-500">{data.description}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;