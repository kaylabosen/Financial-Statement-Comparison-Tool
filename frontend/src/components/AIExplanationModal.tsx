import React from 'react';
import { X, Sparkles, Award, ShieldAlert, CheckCircle2, Copy, Check } from 'lucide-react';
import { AIExplanation } from '../types';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: AIExplanation | null;
  loading: boolean;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  isOpen,
  onClose,
  explanation,
  loading
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!explanation) return;
    const fullText = `${explanation.title}\n\n${explanation.summary}\n\n` + 
      explanation.sections.map(s => `${s.title}:\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Financial Differences Analysis
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold uppercase">
                  Institutional Synthesis
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automated comparative diagnostics across profitability, solvency, leverage, and risk profiles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={loading || !explanation}
              className="p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Copy narrative to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <Sparkles className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Synthesizing SEC 10-K statements and calculating relative performance...
              </p>
              <p className="text-xs text-gray-400">Evaluating margins, working capital, debt structures, and CAGRs.</p>
            </div>
          ) : explanation ? (
            <>
              {/* Executive Summary Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Executive Takeaway
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  "{explanation.summary}"
                </p>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-4">
                {explanation.sections.map(section => (
                  <div
                    key={section.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {section.title}
                      </h4>
                      {section.winner && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>Leader: {section.winner}</span>
                          {section.metric && <span className="opacity-75">({section.metric})</span>}
                        </div>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-gray-400">
              No analysis available. Please select at least two companies and click Explain Differences.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            Close Analysis
          </button>
        </div>

      </div>
    </div>
  );
};
