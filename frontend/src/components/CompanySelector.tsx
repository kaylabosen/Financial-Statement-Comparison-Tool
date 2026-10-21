import React, { useState } from 'react';
import { Search, Plus, X, Building, Check, Layers } from 'lucide-react';
import { CompanySummary, CompanyEnriched } from '../types';

interface CompanySelectorProps {
  selectedTickers: string[];
  availableCompanies: CompanySummary[];
  companiesData?: CompanyEnriched[];
  onAddTicker: (ticker: string) => void;
  onRemoveTicker: (ticker: string) => void;
  onPresetSelect: (tickers: string[]) => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedTickers,
  availableCompanies,
  companiesData = [],
  onAddTicker,
  onRemoveTicker,
  onPresetSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCompanies = availableCompanies.filter(c => {
    const q = searchTerm.toLowerCase();
    return c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  const presets = [
    { label: 'MSFT vs AAPL', tickers: ['MSFT', 'AAPL'] },
    { label: 'Cloud Giants: MSFT vs GOOGL vs AMZN', tickers: ['MSFT', 'GOOGL', 'AMZN'] },
    { label: 'Tech & AI Leaders: MSFT vs AAPL vs NVDA', tickers: ['MSFT', 'AAPL', 'NVDA'] },
    { label: 'Big Tech 4: MSFT, AAPL, GOOGL, META', tickers: ['MSFT', 'AAPL', 'GOOGL', 'META'] }
  ];

  const formatMarketCap = (cap: number) => {
    if (cap >= 1000000) return `$${(cap / 1000000).toFixed(2)}T`;
    if (cap >= 1000) return `$${(cap / 1000).toFixed(1)}B`;
    return `$${cap}M`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Company Selection Panel
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
              {selectedTickers.length} of 5 Selected
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Compare 2 to 5 publicly traded companies side-by-side using SEC Form 10-K filings.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3" /> Presets:
          </span>
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => onPresetSelect(p.tickers)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-50 dark:bg-gray-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Company Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-4">
        {selectedTickers.map(ticker => {
          const comp = availableCompanies.find(c => c.ticker === ticker);
          const enriched = companiesData.find(c => c.ticker === ticker);
          const fhQuote = enriched?.finnhub?.quote;
          return (
            <div
              key={ticker}
              className="relative group bg-gray-50 dark:bg-gray-900/80 rounded-lg p-3 border border-blue-200 dark:border-blue-900/50 shadow-sm hover:border-blue-400 transition"
            >
              <button
                onClick={() => onRemoveTicker(ticker)}
                disabled={selectedTickers.length <= 2}
                title={selectedTickers.length <= 2 ? 'At least 2 companies required' : `Remove ${ticker}`}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition disabled:opacity-30 disabled:hover:text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {ticker}
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {comp ? comp.name : ticker}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs my-1.5 pt-1">
                <span className="text-gray-500 dark:text-gray-400">Finnhub Quote:</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    ${enriched?.currentPrice?.toFixed(2) || comp?.currentPrice?.toFixed(2) || '—'}
                  </span>
                  {fhQuote && (
                    <span className={`text-[10px] font-semibold ${fhQuote.percentChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {fhQuote.percentChange >= 0 ? '+' : ''}{fhQuote.percentChange.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-200/60 dark:border-gray-800 text-xs">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {enriched?.marketCap ? formatMarketCap(enriched.marketCap) : comp ? formatMarketCap(comp.marketCap) : 'N/A'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Company Trigger */}
        {selectedTickers.length < 5 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-full min-h-[95px] flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs font-semibold">+ Add Company ({5 - selectedTickers.length} left)</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[280px]">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ticker, name, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredCompanies.map(c => {
                    const isSelected = selectedTickers.includes(c.ticker);
                    return (
                      <button
                        key={c.ticker}
                        disabled={isSelected}
                        onClick={() => {
                          onAddTicker(c.ticker);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                          isSelected 
                            ? 'bg-gray-100 dark:bg-gray-700/50 opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{c.ticker}</span>
                            <span className="font-normal text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{c.name}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">{c.industry} • {formatMarketCap(c.marketCap)}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
