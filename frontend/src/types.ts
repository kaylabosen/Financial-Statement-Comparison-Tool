export interface FinancialRatios {
  profitMargin: number;
  operatingMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  debtRatio: number;
}

export interface YoYGrowth {
  revenueGrowth: number;
  netIncomeGrowth: number;
  operatingIncomeGrowth: number;
  assetsGrowth: number;
  liabilitiesGrowth: number;
  equityGrowth: number;
}

export interface FinancialYearData {
  year: number;
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  totalAssets: number;
  currentAssets: number;
  inventory: number;
  totalLiabilities: number;
  currentLiabilities: number;
  shareholdersEquity: number;
  freeCashFlow?: number;
  ratios: FinancialRatios;
  yoy: YoYGrowth;
}

export interface CAGRSummary {
  periods: number;
  startYear: number;
  endYear: number;
  revenueCAGR: number;
  netIncomeCAGR: number;
  operatingIncomeCAGR: number;
}

export interface CompanyEnriched {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number; // Millions USD
  currentPrice: number;
  description: string;
  years: number[];
  financials: FinancialYearData[];
  latestYear: number;
  latestFinancials: FinancialYearData;
  previousFinancials: FinancialYearData;
  cagrSummary: CAGRSummary;
}

export interface CompanySummary {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  currentPrice: number;
  description: string;
}

export interface AIExplanationSection {
  id: string;
  title: string;
  content: string;
  winner?: string | null;
  metric?: string | null;
}

export interface AIExplanation {
  title: string;
  summary: string;
  sections: AIExplanationSection[];
}
