import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { REVENUE_DATA } from '../constants';

const OverviewChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[500px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Xu hướng Doanh thu</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dữ liệu tăng trưởng theo thời gian thực.</p>
        </div>
        <select className="text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md px-2 py-1 outline-none">
          <option>12 tháng qua</option>
          <option>30 ngày qua</option>
          <option>7 ngày qua</option>
        </select>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
               contentStyle={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                 borderRadius: '8px', 
                 border: '1px solid #e2e8f0', 
                 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                 color: '#0f172a'
               }}
               itemStyle={{ color: '#0f172a' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart;