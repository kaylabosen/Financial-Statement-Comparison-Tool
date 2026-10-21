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

interface FinancialStructureChartProps {
  companies: CompanyEnriched[];
  darkMode: boolean;
}

export const FinancialStructureChart: React.FC<FinancialStructureChartProps> = ({ companies, darkMode }) => {
  // Chart data: For each company, compare Liabilities + Equity composition
  const chartData = companies.map(c => {
    const lat = c.latestFinancials;
    return {
      ticker: c.ticker,
      name: c.name,
      liabilities: lat.totalLiabilities,
      equity: lat.shareholdersEquity,
      assets: lat.totalAssets,
      debtRatio: Number((lat.ratios.debtRatio * 100).toFixed(1)),
      equityRatio: Number(((lat.shareholdersEquity / lat.totalAssets) * 100).toFixed(1))
    };
  });

  const formatCurrencyY = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}T`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}B`;
    return `$${val}M`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="mb-4">
        <h4 className="text-base font-bold text-gray-900 dark:text-white">
          Balance Sheet Capital Structure (Stacked Bar Chart)
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Composition of Total Liabilities and Shareholders' Equity financing Total Assets.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
            <XAxis
              dataKey="ticker"
              stroke={darkMode ? '#9CA3AF' : '#6B7280'}
              tick={{ fontSize: 12, fontWeight: 600 }}
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
              formatter={(val: any, name: any) => [
                `$${Number(val).toLocaleString()}M`,
                `${name}`
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Bar
              dataKey="liabilities"
              name="Total Liabilities"
              stackId="balanceSheet"
              fill="#EF4444"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="equity"
              name="Shareholders' Equity"
              stackId="balanceSheet"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Footnote */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 text-xs">
        {chartData.map(d => (
          <div key={d.ticker} className="p-2 rounded bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-800 dark:text-gray-200">{d.ticker}:</span>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Equity: <span className="font-semibold text-blue-600 dark:text-blue-400">{d.equityRatio}%</span> | Debt: <span className="font-semibold text-rose-600 dark:text-rose-400">{d.debtRatio}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
