import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CompanySelector } from './components/CompanySelector';
import { FinancialSummaryCards } from './components/FinancialSummaryCards';
import { RatioAnalysisDashboard } from './components/RatioAnalysisDashboard';
import { RevenueTrendChart } from './components/Charts/RevenueTrendChart';
import { NetIncomeTrendChart } from './components/Charts/NetIncomeTrendChart';
import { RatioComparisonChart } from './components/Charts/RatioComparisonChart';
import { FinancialStructureChart } from './components/Charts/FinancialStructureChart';
import { HistoricalPerformanceTable } from './components/HistoricalPerformanceTable';
import { AIExplanationModal } from './components/AIExplanationModal';
import { 
  fetchCompanies, 
  fetchCompanyComparison, 
  fetchAIExplanation,
  FALLBACK_COMPANIES 
} from './services/api';
import { CompanyEnriched, CompanySummary, AIExplanation } from './types';
import { AlertCircle, BarChart3, LineChart as LineChartIcon, Sparkles } from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [availableCompanies, setAvailableCompanies] = useState<CompanySummary[]>(FALLBACK_COMPANIES);
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['MSFT', 'AAPL']);
  const [companiesData, setCompaniesData] = useState<CompanyEnriched[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // AI Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Synchronize Dark Mode class on HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load available companies list
  useEffect(() => {
    fetchCompanies().then(comps => {
      if (comps && comps.length > 0) {
        setAvailableCompanies(comps);
      }
    });
  }, []);

  // Fetch comparison data whenever selectedTickers changes
  const loadComparison = async (tickers: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanyComparison(tickers);
      if (data && data.length > 0) {
        setCompaniesData(data);
      } else {
        setError('No financial data returned for the selected companies.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve financial statement data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(selectedTickers);
  }, [selectedTickers]);

  // Handle company selection
  const handleAddTicker = (ticker: string) => {
    if (selectedTickers.includes(ticker)) return;
    if (selectedTickers.length >= 5) {
      alert('You can compare a maximum of 5 companies at once.');
      return;
    }
    setSelectedTickers([...selectedTickers, ticker]);
  };

  const handleRemoveTicker = (ticker: string) => {
    if (selectedTickers.length <= 2) {
      alert('At least two companies must be selected for comparison.');
      return;
    }
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  };

  const handlePresetSelect = (tickers: string[]) => {
    setSelectedTickers(tickers);
  };

  // Trigger AI explanation
  const handleExplainClick = async () => {
    setIsAIModalOpen(true);
    setAiLoading(true);
    try {
      const narrative = await fetchAIExplanation(selectedTickers);
      setAiExplanation(narrative);
    } catch (err) {
      console.error('Failed to generate explanation', err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* Top Navigation */}
      <Header
        companies={companiesData}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onExplainClick={handleExplainClick}
        onRefresh={() => loadComparison(selectedTickers)}
        loading={loading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Company Selector Panel */}
        <CompanySelector
          selectedTickers={selectedTickers}
          availableCompanies={availableCompanies}
          companiesData={companiesData}
          onAddTicker={handleAddTicker}
          onRemoveTicker={handleRemoveTicker}
          onPresetSelect={handlePresetSelect}
        />

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Unable to complete comparison</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Fetching SEC Form 10-K filings and computing ratios...</p>
          </div>
        )}

        {!loading && companiesData.length >= 2 && (
          <>
            {/* 1. Financial Summary Cards (KPIs with YoY deltas) */}
            <FinancialSummaryCards companies={companiesData} />

            {/* 2. Interactive Charts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-blue-500" />
                    Interactive Financial Visualizations
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Dynamic time-series, benchmark bars, and balance sheet capital structure.
                  </p>
                </div>
              </div>

              {/* 2x2 Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RevenueTrendChart companies={companiesData} darkMode={darkMode} />
                <NetIncomeTrendChart companies={companiesData} darkMode={darkMode} />
                <RatioComparisonChart companies={companiesData} darkMode={darkMode} />
                <FinancialStructureChart companies={companiesData} darkMode={darkMode} />
              </div>
            </div>

            {/* 3. Financial Ratio Analysis Dashboard */}
            <RatioAnalysisDashboard companies={companiesData} />

            {/* 4. Historical Performance 5-Year Table */}
            <HistoricalPerformanceTable companies={companiesData} />

            {/* Explainer Banner Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Need an Executive Summary of Differences?
                  </h4>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Generate an instant institutional evaluation detailing profitability drivers, liquidity cushions, and debt risk.
                  </p>
                </div>
              </div>
              <button
                onClick={handleExplainClick}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-purple-900 hover:bg-purple-50 shadow-md transition cursor-pointer flex-shrink-0"
              >
                Explain Differences Now
              </button>
            </div>
          </>
        )}

      </main>

      {/* AI Explanation Modal */}
      <AIExplanationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        explanation={aiExplanation}
        loading={aiLoading}
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Financial Statement Comparison Tool • SEC EDGAR XBRL Data</span>
          <span className="text-[11px] text-gray-400">
            For investor research, academic evaluation, and peer financial comparison.
          </span>
        </div>
      </footer>

    </div>
  );
}

export default App;
