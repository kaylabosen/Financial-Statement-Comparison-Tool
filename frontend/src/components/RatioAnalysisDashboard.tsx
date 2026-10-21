import React, { useState } from 'react';
import { Award, Info, Percent, Droplets, Anchor } from 'lucide-react';
import { CompanyEnriched } from '../types';

interface RatioAnalysisDashboardProps {
  companies: CompanyEnriched[];
}

export const RatioAnalysisDashboard: React.FC<RatioAnalysisDashboardProps> = ({ companies }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'profitability' | 'liquidity' | 'leverage'>('all');

  const ratioDefinitions = [
    // Profitability
    {
      category: 'profitability',
      id: 'operatingMargin',
      name: 'Operating Margin',
      formula: 'Operating Income / Revenue',
      description: 'Measures profitability from core operations before interest and tax.',
      benchmark: '> 15% is strong',
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
      getter: (r: any) => r.operatingMargin,
      higherIsBetter: true
    },
    {
      category: 'profitability',
      id: 'profitMargin',
      name: 'Net Profit Margin',
      formula: 'Net Income / Revenue',
      description: 'Percentage of revenue left after all operating and non-operating expenses.',
      benchmark: '> 10% is healthy',
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
      getter: (r: any) => r.profitMargin,
      higherIsBetter: true
    },
    {
      category: 'profitability',
      id: 'returnOnAssets',
      name: 'Return on Assets (ROA)',
      formula: 'Net Income / Total Assets',
      description: 'How efficiently management deploys company assets to generate net earnings.',
      benchmark: '> 5% is standard',
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
      getter: (r: any) => r.returnOnAssets,
      higherIsBetter: true
    },
    {
      category: 'profitability',
      id: 'returnOnEquity',
      name: 'Return on Equity (ROE)',
      formula: "Net Income / Shareholders' Equity",
      description: 'Profitability generated per dollar of equity capital invested.',
      benchmark: '> 15% is attractive',
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
      getter: (r: any) => r.returnOnEquity,
      higherIsBetter: true
    },

    // Liquidity
    {
      category: 'liquidity',
      id: 'currentRatio',
      name: 'Current Ratio',
      formula: 'Current Assets / Current Liabilities',
      description: 'Ability to pay short-term obligations due within one year.',
      benchmark: '> 1.2x is safe',
      format: (val: number) => `${val.toFixed(2)}x`,
      getter: (r: any) => r.currentRatio,
      higherIsBetter: true
    },
    {
      category: 'liquidity',
      id: 'quickRatio',
      name: 'Quick Ratio (Acid-Test)',
      formula: '(Current Assets − Inventory) / Current Liabilities',
      description: 'Immediate liquidity without needing to liquidate inventory.',
      benchmark: '> 1.0x is robust',
      format: (val: number) => `${val.toFixed(2)}x`,
      getter: (r: any) => r.quickRatio,
      higherIsBetter: true
    },

    // Leverage
    {
      category: 'leverage',
      id: 'debtToEquity',
      name: 'Debt-to-Equity Ratio',
      formula: "Total Liabilities / Shareholders' Equity",
      description: 'Proportion of total creditor financing relative to equity capital.',
      benchmark: '< 2.0x is conservative',
      format: (val: number) => `${val.toFixed(2)}x`,
      getter: (r: any) => r.debtToEquity,
      higherIsBetter: false // Lower D/E represents less debt risk
    },
    {
      category: 'leverage',
      id: 'debtRatio',
      name: 'Debt Ratio',
      formula: 'Total Liabilities / Total Assets',
      description: 'Percentage of total assets financed through debt obligations.',
      benchmark: '< 0.50 is low leverage',
      format: (val: number) => `${(val * 100).toFixed(1)}%`,
      getter: (r: any) => r.debtRatio,
      higherIsBetter: false
    }
  ];

  const filteredRatios = activeCategory === 'all' 
    ? ratioDefinitions 
    : ratioDefinitions.filter(r => r.category === activeCategory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-4">
      
      {/* Category Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Financial Ratio Analysis
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Automated profitability, liquidity, and financial leverage formulas.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Ratios (8)
          </button>
          <button
            onClick={() => setActiveCategory('profitability')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeCategory === 'profitability'
                ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Percent className="w-3 h-3" /> Profitability
          </button>
          <button
            onClick={() => setActiveCategory('liquidity')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeCategory === 'liquidity'
                ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3 h-3" /> Liquidity
          </button>
          <button
            onClick={() => setActiveCategory('leverage')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition cursor-pointer ${
              activeCategory === 'leverage'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Anchor className="w-3 h-3" /> Leverage
          </button>
        </div>
      </div>

      {/* Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRatios.map(item => {
          // Determine best company for this ratio
          const values = companies.map(c => ({
            ticker: c.ticker,
            val: item.getter(c.latestFinancials.ratios)
          }));

          const leader = item.higherIsBetter
            ? values.reduce((prev, curr) => (curr.val > prev.val ? curr : prev))
            : values.reduce((prev, curr) => (curr.val < prev.val ? curr : prev));

          return (
            <div
              key={item.id}
              className="bg-gray-50 dark:bg-gray-900/60 rounded-xl p-4 border border-gray-200 dark:border-gray-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {item.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {item.benchmark}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mb-1">
                  Formula: {item.formula}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">
                  {item.description}
                </p>

                {/* Values for each company */}
                <div className="space-y-1.5">
                  {companies.map(c => {
                    const val = item.getter(c.latestFinancials.ratios);
                    const isWinner = c.ticker === leader.ticker && companies.length > 1;

                    return (
                      <div
                        key={c.ticker}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition ${
                          isWinner
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/80'
                            : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{c.ticker}</span>
                          {isWinner && (
                            <span className="flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                              <Award className="w-2.5 h-2.5" /> Best
                            </span>
                          )}
                        </div>
                        <span className={`font-mono font-bold ${isWinner ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {item.format(val)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
