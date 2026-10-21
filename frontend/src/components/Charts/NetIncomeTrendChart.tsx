import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CompanyEnriched } from '../../types';

interface NetIncomeTrendChartProps {
  companies: CompanyEnriched[];
  darkMode: boolean;
}

const COMPANY_COLORS = ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6'];

export const NetIncomeTrendChart: React.FC<NetIncomeTrendChartProps> = ({ companies, darkMode }) => {
  const [viewMode, setViewMode] = useState<'nominal' | 'growth'>('nominal');

  const allYears = Array.from(
    new Set(companies.flatMap(c => c.financials.map(f => f.year)))
  ).sort((a, b) => a - b);

  const chartData = allYears.map(year => {
    const row: any = { year: `FY${year}` };
    companies.forEach(c => {
      const fin = c.financials.find(f => f.year === year);
      if (fin) {
        row[c.ticker] = viewMode === 'nominal' ? fin.netIncome : Number((fin.yoy.netIncomeGrowth * 100).toFixed(1));
      } else {
        row[c.ticker] = null;
      }
    });
    return row;
  });

  const formatCurrencyY = (val: number) => {
    if (viewMode === 'growth') return `${val}%`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(0)}B`;
    return `$${val}M`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Net Income & Growth Trajectory
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Compare earnings expansion and volatility over fiscal reporting cycles.
          </p>
        </div>

        {/* Nominal vs Percentage Growth Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs">
          <button
            onClick={() => setViewMode('nominal')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              viewMode === 'nominal'
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Net Income ($M)
          </button>
          <button
            onClick={() => setViewMode('growth')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              viewMode === 'growth'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            YoY Growth Rate (%)
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="year"
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              tickFormatter={formatCurrencyY}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                borderColor: darkMode ? '#374151' : '#E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '12px',
                color: darkMode ? '#F3F4F6' : '#111827'
              }}
              formatter={(value: any, name: any) => [
                viewMode === 'nominal' ? `$${Number(value).toLocaleString()}M` : `${value}%`,
                `${name} Net Income`
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            {companies.map((c, idx) => (
              <Line
                key={c.ticker}
                type="monotone"
                dataKey={c.ticker}
                name={`${c.ticker}`}
                stroke={COMPANY_COLORS[idx % COMPANY_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
