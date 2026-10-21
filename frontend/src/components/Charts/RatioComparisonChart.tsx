import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { CompanyEnriched } from '../../types';

interface RatioComparisonChartProps {
  companies: CompanyEnriched[];
  darkMode: boolean;
}

const COMPANY_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const RatioComparisonChart: React.FC<RatioComparisonChartProps> = ({ companies, darkMode }) => {
  // 4 Core target benchmark ratios
  const metrics = [
    { key: 'returnOnAssets', name: 'ROA (%)', multiplier: 100, unit: '%' },
    { key: 'returnOnEquity', name: 'ROE (%)', multiplier: 100, unit: '%' },
    { key: 'currentRatio', name: 'Current Ratio (x)', multiplier: 1, unit: 'x' },
    { key: 'debtToEquity', name: 'Debt-to-Equity (x)', multiplier: 1, unit: 'x' }
  ];

  const chartData = metrics.map(m => {
    const row: any = { metric: m.name, unit: m.unit };
    companies.forEach(c => {
      const r = c.latestFinancials.ratios as any;
      const rawVal = r[m.key] || 0;
      row[c.ticker] = Number((rawVal * m.multiplier).toFixed(2));
    });
    return row;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-base font-bold text-gray-900 dark:text-white">
          Key Ratio Comparison Benchmark (Grouped Bar Chart)
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Comparing Return on Assets, Return on Equity, Current Ratio, and Debt-to-Equity side-by-side.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="metric"
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
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
              formatter={(val: any, name: any, item: any) => [
                `${val}${item.payload.unit || ''}`,
                `${name}`
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            {companies.map((c, idx) => (
              <Bar
                key={c.ticker}
                dataKey={c.ticker}
                name={`${c.ticker}`}
                fill={COMPANY_COLORS[idx % COMPANY_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
