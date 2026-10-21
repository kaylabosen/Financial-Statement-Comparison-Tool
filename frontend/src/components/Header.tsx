import React from 'react';
import { 
  Building2, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Sun, 
  Moon, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CompanyEnriched } from '../types';
import { exportToExcel, exportToCSV, exportToPDF } from '../utils/exportUtils';

interface HeaderProps {
  companies: CompanyEnriched[];
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onExplainClick: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  companies,
  darkMode,
  setDarkMode,
  onExplainClick,
  onRefresh,
  loading
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Financial Statement Comparison Tool
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                SEC EDGAR
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Finnhub API
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SEC 10-K Ratios & Finnhub Real-Time Market Quotes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Explain Differences Button */}
          <button
            onClick={onExplainClick}
            disabled={companies.length < 2 || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm shadow-purple-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Generate AI-powered financial differences analysis"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explain Differences</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => exportToPDF(companies)}
              disabled={companies.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
              title="Export PDF Report"
            >
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportToExcel(companies)}
              disabled={companies.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
              title="Export Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportToCSV(companies)}
              disabled={companies.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded transition disabled:opacity-50"
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>CSV</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            title="Refresh Financial Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};
