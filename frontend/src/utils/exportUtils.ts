import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { CompanyEnriched } from '../types';

export function exportToExcel(companies: CompanyEnriched[]) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive KPI Comparison
  const summaryRows = companies.map(c => {
    const lat = c.latestFinancials;
    const r = lat.ratios;
    return {
      Ticker: c.ticker,
      Company: c.name,
      Sector: c.sector,
      Industry: c.industry,
      'Market Cap ($M)': c.marketCap,
      'Fiscal Year': lat.year,
      'Revenue ($M)': lat.revenue,
      'Net Income ($M)': lat.netIncome,
      'Operating Income ($M)': lat.operatingIncome,
      'Total Assets ($M)': lat.totalAssets,
      'Total Liabilities ($M)': lat.totalLiabilities,
      'Shareholders Equity ($M)': lat.shareholdersEquity,
      'Profit Margin': `${(r.profitMargin * 100).toFixed(2)}%`,
      'Operating Margin': `${(r.operatingMargin * 100).toFixed(2)}%`,
      'ROA': `${(r.returnOnAssets * 100).toFixed(2)}%`,
      'ROE': `${(r.returnOnEquity * 100).toFixed(2)}%`,
      'Current Ratio': r.currentRatio,
      'Quick Ratio': r.quickRatio,
      'Debt-to-Equity': r.debtToEquity,
      '5Y Rev CAGR': `${(c.cagrSummary.revenueCAGR * 100).toFixed(2)}%`
    };
  });
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary Comparison');

  // Sheet 2: 5-Year Historical Financials
  const histRows: any[] = [];
  companies.forEach(c => {
    c.financials.forEach(f => {
      histRows.push({
        Ticker: c.ticker,
        Company: c.name,
        Year: f.year,
        'Revenue ($M)': f.revenue,
        'Operating Income ($M)': f.operatingIncome,
        'Net Income ($M)': f.netIncome,
        'Total Assets ($M)': f.totalAssets,
        'Current Assets ($M)': f.currentAssets,
        'Inventory ($M)': f.inventory,
        'Total Liabilities ($M)': f.totalLiabilities,
        'Current Liabilities ($M)': f.currentLiabilities,
        'Shareholders Equity ($M)': f.shareholdersEquity,
        'Free Cash Flow ($M)': f.freeCashFlow || 0,
        'YoY Revenue Growth': `${(f.yoy.revenueGrowth * 100).toFixed(2)}%`,
        'YoY Net Income Growth': `${(f.yoy.netIncomeGrowth * 100).toFixed(2)}%`
      });
    });
  });
  const wsHist = XLSX.utils.json_to_sheet(histRows);
  XLSX.utils.book_append_sheet(wb, wsHist, '5-Year Financials');

  // Sheet 3: Ratios Timeline
  const ratioRows: any[] = [];
  companies.forEach(c => {
    c.financials.forEach(f => {
      ratioRows.push({
        Ticker: c.ticker,
        Company: c.name,
        Year: f.year,
        'Profit Margin': `${(f.ratios.profitMargin * 100).toFixed(2)}%`,
        'Operating Margin': `${(f.ratios.operatingMargin * 100).toFixed(2)}%`,
        'Return on Assets (ROA)': `${(f.ratios.returnOnAssets * 100).toFixed(2)}%`,
        'Return on Equity (ROE)': `${(f.ratios.returnOnEquity * 100).toFixed(2)}%`,
        'Current Ratio': f.ratios.currentRatio,
        'Quick Ratio': f.ratios.quickRatio,
        'Debt-to-Equity': f.ratios.debtToEquity,
        'Debt Ratio': `${(f.ratios.debtRatio * 100).toFixed(2)}%`
      });
    });
  });
  const wsRatios = XLSX.utils.json_to_sheet(ratioRows);
  XLSX.utils.book_append_sheet(wb, wsRatios, 'Ratios History');

  const filename = `Financial_Comparison_${companies.map(c => c.ticker).join('_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportToCSV(companies: CompanyEnriched[]) {
  const headers = [
    'Ticker', 'Company Name', 'Year', 'Revenue ($M)', 'Operating Income ($M)', 'Net Income ($M)',
    'Total Assets ($M)', 'Current Assets ($M)', 'Total Liabilities ($M)', 'Equity ($M)',
    'Profit Margin', 'Operating Margin', 'ROA', 'ROE', 'Current Ratio', 'Debt to Equity'
  ];

  const rows: string[] = [headers.join(',')];

  companies.forEach(c => {
    c.financials.forEach(f => {
      const row = [
        c.ticker,
        `"${c.name}"`,
        f.year,
        f.revenue,
        f.operatingIncome,
        f.netIncome,
        f.totalAssets,
        f.currentAssets,
        f.totalLiabilities,
        f.shareholdersEquity,
        `${(f.ratios.profitMargin * 100).toFixed(2)}%`,
        `${(f.ratios.operatingMargin * 100).toFixed(2)}%`,
        `${(f.ratios.returnOnAssets * 100).toFixed(2)}%`,
        `${(f.ratios.returnOnEquity * 100).toFixed(2)}%`,
        f.ratios.currentRatio,
        f.ratios.debtToEquity
      ];
      rows.push(row.join(','));
    });
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `financial_comparison_${companies.map(c => c.ticker).join('_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(companies: CompanyEnriched[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header banner
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageWidth, 70, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL STATEMENT COMPARISON REPORT', 30, 36);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Companies: ${companies.map(c => c.ticker).join(' vs ')}`, 30, 54);

  // Section 1: Executive KPI Overview
  let y = 100;
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Financial Summary (Latest Fiscal Year)', 30, y);

  y += 20;
  companies.forEach((c) => {
    const lat = c.latestFinancials;
    const r = lat.ratios;

    doc.setFillColor(243, 244, 246);
    doc.roundedRect(30, y, pageWidth - 60, 65, 4, 4, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(`${c.name} (${c.ticker}) - FY${lat.year}`, 40, y + 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Revenue: $${lat.revenue.toLocaleString()}M | Net Income: $${lat.netIncome.toLocaleString()}M | Operating Inc: $${lat.operatingIncome.toLocaleString()}M`, 40, y + 34);
    doc.text(`Profit Margin: ${(r.profitMargin * 100).toFixed(1)}% | Op Margin: ${(r.operatingMargin * 100).toFixed(1)}% | ROE: ${(r.returnOnEquity * 100).toFixed(1)}% | Current Ratio: ${r.currentRatio}x | D/E: ${r.debtToEquity}x`, 40, y + 48);

    y += 75;
  });

  // Section 2: Ratio Comparison Matrix
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('2. Financial Ratio Benchmarks', 30, y);

  y += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Metric', 35, y);
  let colX = 170;
  companies.forEach(c => {
    doc.text(`${c.ticker}`, colX, y);
    colX += 75;
  });

  y += 8;
  doc.setDrawColor(209, 213, 219);
  doc.line(30, y, pageWidth - 30, y);

  const ratioList = [
    { label: 'Operating Margin', key: (r: any) => `${(r.operatingMargin * 100).toFixed(1)}%` },
    { label: 'Net Profit Margin', key: (r: any) => `${(r.profitMargin * 100).toFixed(1)}%` },
    { label: 'Return on Assets (ROA)', key: (r: any) => `${(r.returnOnAssets * 100).toFixed(1)}%` },
    { label: 'Return on Equity (ROE)', key: (r: any) => `${(r.returnOnEquity * 100).toFixed(1)}%` },
    { label: 'Current Ratio', key: (r: any) => `${r.currentRatio}x` },
    { label: 'Quick Ratio', key: (r: any) => `${r.quickRatio}x` },
    { label: 'Debt-to-Equity', key: (r: any) => `${r.debtToEquity}x` },
    { label: '5-Yr Revenue CAGR', key: (_: any, c: any) => `${(c.cagrSummary.revenueCAGR * 100).toFixed(1)}%` }
  ];

  doc.setFont('helvetica', 'normal');
  ratioList.forEach(item => {
    y += 16;
    doc.setTextColor(75, 85, 99);
    doc.text(item.label, 35, y);

    let x = 170;
    companies.forEach(c => {
      doc.setTextColor(17, 24, 39);
      doc.text(item.key(c.latestFinancials.ratios, c), x, y);
      x += 75;
    });
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Financial Statement Comparison Tool • SEC EDGAR Data Services', 30, 800);

  const filename = `Financial_Report_${companies.map(c => c.ticker).join('_')}.pdf`;
  doc.save(filename);
}
