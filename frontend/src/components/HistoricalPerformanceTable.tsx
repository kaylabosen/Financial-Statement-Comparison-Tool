import React, { useState } from 'react';
import { Calendar, TrendingUp, Filter } from 'lucide-react';
import { CompanyEnriched } from '../types';

interface HistoricalPerformanceTableProps {
  companies: CompanyEnriched[];
}

export const HistoricalPerformanceTable: React.FC<HistoricalPerformanceTableProps> = ({ companies }) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'operatingIncome' | 'netIncome' | 'totalAssets' | 'freeCashFlow'>('revenue');
  const [yearSpan, setYearSpan] = useState<number>(5);

  const metricsConfig = {
    revenue: {
      name: 'Revenue (Sales)',
      getter: (f: any) => f.revenue,
      growthGetter: (f: any) => f.yoy.revenueGrowth,
      cagrGetter: (c: any) => c.cagrSummary.revenueCAGR
    },
    operatingIncome: {
      name: 'Operating Income (EBIT)',
      getter: (f: any) => f.operatingIncome,
      growthGetter: (f: any) => f.yoy.operatingIncomeGrowth,
      cagrGetter: (c: any) => c.cagrSummary.operatingIncomeCAGR
    },
    netIncome: {
      name: 'Net Income (Profit)',
      getter: (f: any) => f.netIncome,
      growthGetter: (f: any) => f.yoy.netIncomeGrowth,
      cagrGetter: (c: any) => c.cagrSummary.netIncomeCAGR
    },
    totalAssets: {
      name: 'Total Assets',
      getter: (f: any) => f.totalAssets,
      growthGetter: (f: any) => f.yoy.assetsGrowth,
      cagrGetter: (_: any) => null
    },
    freeCashFlow: {
      name: 'Free Cash Flow (FCF)',
      getter: (f: any) => f.freeCashFlow ?? 0,
      growthGetter: (_: any) => 0,
      cagrGetter: (_: any) => null
    }
  };

  const activeMetricConfig = metricsConfig[selectedMetric];

  // Get distinct years in ascending order, filtered by yearSpan
  const allYears = Array.from(
    new Set(companies.flatMap(c => c.financials.map(f => f.year)))
  ).sort((a, b) => a - b).slice(-yearSpan);

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString()}M`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Historical Performance Comparison Table
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            5-Year historical numbers, YoY Growth trajectories, and Compound Annual Growth Rate (CAGR).
          </p>
        </div>

        {/* Filter Controls: Metric Selector & Year Span */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e: any) => setSelectedMetric(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="revenue">Metric: Revenue</option>
            <option value="operatingIncome">Metric: Operating Income</option>
            <option value="netIncome">Metric: Net Income</option>
            <option value="totalAssets">Metric: Total Assets</option>
            <option value="freeCashFlow">Metric: Free Cash Flow</option>
          </select>

          {/* Span Filter */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
            <button
              onClick={() => setYearSpan(3)}
              className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                yearSpan === 3
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              3 Years
            </button>
            <button
              onClick={() => setYearSpan(5)}
              className={`px-2 py-1 rounded font-medium transition cursor-pointer ${
                yearSpan === 5
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              5 Years
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 uppercase font-semibold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2.5 px-3">Company</th>
              {allYears.map(year => (
                <th key={year} className="py-2.5 px-3 text-right">
                  FY{year}
                </th>
              ))}
              <th className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400">
                CAGR ({yearSpan}Y)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {companies.map(c => {
              const cagrVal = activeMetricConfig.cagrGetter(c);

              return (
                <React.Fragment key={c.ticker}>
                  {/* Nominal Values Row */}
                  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                    <td className="py-2.5 px-3 font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <span className="text-blue-600 dark:text-blue-400">{c.ticker}</span>
                      <span className="text-gray-400 font-normal truncate max-w-[120px]">
                        ({c.name.split(' ')[0]})
                      </span>
                    </td>
                    {allYears.map(year => {
                      const fin = c.financials.find(f => f.year === year);
                      const val = fin ? activeMetricConfig.getter(fin) : 0;
                      return (
                        <td key={year} className="py-2.5 px-3 text-right font-mono font-medium text-gray-900 dark:text-gray-200">
                          {formatCurrency(val)}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {cagrVal !== null ? `${(cagrVal * 100).toFixed(1)}%` : '—'}
                    </td>
                  </tr>

                  {/* YoY Growth Rate Sub-Row */}
                  <tr className="bg-gray-50/30 dark:bg-gray-900/20 text-[11px] text-gray-400">
                    <td className="py-1 px-3 italic pl-6 text-gray-400">
                      └ YoY Growth:
                    </td>
                    {allYears.map((year, idx) => {
                      const fin = c.financials.find(f => f.year === year);
                      const growth = fin ? activeMetricConfig.growthGetter(fin) : 0;
                      const isFirst = idx === 0;

                      return (
                        <td key={year} className="py-1 px-3 text-right font-mono">
                          {isFirst ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <span
                              className={
                                growth > 0
                                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                  : growth < 0
                                  ? 'text-rose-600 dark:text-rose-400 font-medium'
                                  : 'text-gray-400'
                              }
                            >
                              {growth > 0 ? '+' : ''}{(growth * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-1 px-3 text-right text-gray-400 font-mono text-[10px]">
                      Compound
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
