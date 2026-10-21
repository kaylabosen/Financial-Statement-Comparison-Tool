import React from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, PieChart, ShieldCheck, Scale, Wallet, Activity } from 'lucide-react';
import { CompanyEnriched } from '../types';

interface FinancialSummaryCardsProps {
  companies: CompanyEnriched[];
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({ companies }) => {
  const metrics = [
    {
      id: 'revenue',
      title: 'Revenue (Total Sales)',
      icon: DollarSign,
      getter: (lat: any) => lat.revenue,
      growthGetter: (lat: any) => lat.yoy.revenueGrowth,
      higherIsBetter: true,
      description: 'Gross inflow from products, subscriptions, and services'
    },
    {
      id: 'operatingIncome',
      title: 'Operating Income (EBIT)',
      icon: Activity,
      getter: (lat: any) => lat.operatingIncome,
      growthGetter: (lat: any) => lat.yoy.operatingIncomeGrowth,
      higherIsBetter: true,
      description: 'Profit realized from core operations after operating expenses'
    },
    {
      id: 'netIncome',
      title: 'Net Income (Bottom Line)',
      icon: TrendingUp,
      getter: (lat: any) => lat.netIncome,
      growthGetter: (lat: any) => lat.yoy.netIncomeGrowth,
      higherIsBetter: true,
      description: 'Total earnings after all expenses, taxes, and interest'
    },
    {
      id: 'totalAssets',
      title: 'Total Assets',
      icon: PieChart,
      getter: (lat: any) => lat.totalAssets,
      growthGetter: (lat: any) => lat.yoy.assetsGrowth,
      higherIsBetter: true,
      description: 'Economic resources owned (cash, PPE, receivables, IP)'
    },
    {
      id: 'totalLiabilities',
      title: 'Total Liabilities',
      icon: Scale,
      getter: (lat: any) => lat.totalLiabilities,
      growthGetter: (lat: any) => lat.yoy.liabilitiesGrowth,
      higherIsBetter: false, // For liabilities, lower growth is generally safer
      description: 'Aggregate debt, obligations, and creditor claims'
    },
    {
      id: 'shareholdersEquity',
      title: "Shareholders' Equity",
      icon: Wallet,
      getter: (lat: any) => lat.shareholdersEquity,
      growthGetter: (lat: any) => lat.yoy.equityGrowth,
      higherIsBetter: true,
      description: 'Net book value remaining for shareholders (Assets − Liabilities)'
    }
  ];

  const formatCurrency = (val: number) => {
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}B`;
    return `$${val.toLocaleString()}M`;
  };

  const getBadgeStyle = (growth: number, higherIsBetter: boolean) => {
    const absGrowth = Math.abs(growth);
    if (absGrowth < 0.005) {
      return {
        bg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
        icon: Minus,
        text: '0.0%'
      };
    }

    const isPositive = growth > 0;
    const isImprovement = higherIsBetter ? isPositive : !isPositive;

    if (isImprovement) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        icon: TrendingUp,
        text: `${isPositive ? '+' : ''}${(growth * 100).toFixed(1)}%`
      };
    } else {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        icon: TrendingDown,
        text: `${isPositive ? '+' : ''}${(growth * 100).toFixed(1)}%`
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
            Financial Summary Cards
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Latest fiscal year values, prior period comparisons, and YoY growth indicators.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Improvement
          </span>
          <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Decline
          </span>
          <span className="flex items-center gap-1 font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> No Change
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700/60">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {metric.title}
                  </h4>
                  <p className="text-[10px] text-gray-400">{metric.description}</p>
                </div>
              </div>

              {/* Side-by-side comparison for each selected company */}
              <div className="space-y-3 pt-1">
                {companies.map(c => {
                  const latest = c.latestFinancials;
                  const prev = c.previousFinancials;
                  const currentVal = metric.getter(latest);
                  const prevVal = metric.getter(prev);
                  const growth = metric.growthGetter(latest);
                  const badge = getBadgeStyle(growth, metric.higherIsBetter);
                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={c.ticker}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                            {c.ticker}
                          </span>
                          <span className="text-[10px] text-gray-400">FY{latest.year}</span>
                        </div>
                        <div className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                          {formatCurrency(currentVal)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Prior FY{prev.year}: {formatCurrency(prevVal)}
                        </div>
                      </div>

                      {/* YoY Growth Badge */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${badge.bg}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{badge.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
