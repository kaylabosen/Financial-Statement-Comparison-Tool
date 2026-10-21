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

interface RevenueTrendChartProps {
  companies: CompanyEnriched[];
  darkMode: boolean;
}

const COMPANY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ companies, darkMode }) => {
  // Track visibility toggles per ticker
  const [visibleTickers, setVisibleTickers] = useState<Record<string, boolean>>({});

  // Merge historical revenue data by year
  const allYears = Array.from(
    new Set(companies.flatMap(c => c.financials.map(f => f.year)))
  ).sort((a, b) => a - b);

  const chartData = allYears.map(year => {
    const row: any = { year: `FY${year}` };
    companies.forEach(c => {
      const fin = c.financials.find(f => f.year === year);
      row[c.ticker] = fin ? fin.revenue : null;
    });
    return row;
  });

  const toggleTicker = (ticker: string) => {
    setVisibleTickers(prev => ({
      ...prev,
      [ticker]: prev[ticker] !== undefined ? !prev[ticker] : false
    }));
  };

  const formatCurrencyY = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}T`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}B`;
    return `$${val}M`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">
            Revenue Trend Comparison (5-Year)
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Multi-line comparative trajectory in Millions USD. Click company badges to toggle lines.
          </p>
        </div>

        {/* Interactive company visibility toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          {companies.map((c, idx) => {
            const isVisible = visibleTickers[c.ticker] ?? true;
            const color = COMPANY_COLORS[idx % COMPANY_COLORS.length];
            return (
              <button
                key={c.ticker}
                onClick={() => toggleTicker(c.ticker)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                  isVisible
                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                    : 'bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-400 line-through opacity-60'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span>{c.ticker}</span>
              </button>
            );
          })}
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
                `$${Number(value).toLocaleString()}M`,
                `${name} Revenue`
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            {companies.map((c, idx) => {
              const isVisible = visibleTickers[c.ticker] ?? true;
              if (!isVisible) return null;
              return (
                <Line
                  key={c.ticker}
                  type="monotone"
                  dataKey={c.ticker}
                  name={`${c.ticker} (${c.name.split(' ')[0]})`}
                  stroke={COMPANY_COLORS[idx % COMPANY_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
