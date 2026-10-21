# Financial Statement Comparison Tool

A modern, institutional-grade web application for analyzing and comparing the financial performance of publicly traded companies using 5-year SEC Form 10-K financial statement data.

## Features

- **Company Selection Panel**: Search and compare 2 to 5 public companies (Preloaded: Microsoft `MSFT` vs Apple `AAPL`).
- **Financial Summary Cards**: Key metrics (Revenue, Operating Income, Net Income, Total Assets, Total Liabilities, Shareholders' Equity) with prior period baseline, YoY percentage change, and green/red color badges.
- **Financial Ratio Analysis Engine**:
  - *Profitability*: Net Profit Margin, Operating Margin, Return on Assets (ROA), Return on Equity (ROE)
  - *Liquidity*: Current Ratio, Quick Ratio
  - *Leverage*: Debt-to-Equity Ratio, Debt Ratio
- **Historical 5-Year Performance Table**: Multi-year metrics, annual YoY growth rates, and Compound Annual Growth Rate (CAGR).
- **Interactive Visualizations (Recharts)**:
  - 5-Year Revenue Trend Multi-line Chart with company toggles & tooltips
  - Net Income & YoY Growth Trajectory Chart
  - Grouped Ratio Benchmark Bar Chart
  - Balance Sheet Capital Structure (Stacked Liabilities + Equity)
- **AI Financial Differences Explainer**:
  - Automatically synthesizes comparative performance
  - Identifies which firm is more profitable, more liquid, and more leveraged
  - Evaluates revenue growth differences, risk implications, and investment considerations
- **Exporting Suite**:
  - One-click Excel (.xlsx) workbook generation with multiple tabs
  - Downloadable CSV data export
  - Printable/downloadable PDF report
- **Institutional UX**: Bloomberg/Morningstar-inspired theme with seamless Light & Dark Mode.

## Quick Start

### 1. Backend (FastAPI)
```powershell
cd backend
python -m pip install fastapi uvicorn requests httpx pydantic
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

### 2. Frontend (React + TypeScript + Vite)
```powershell
cd frontend
npm run dev
```
Open your browser to: `http://localhost:5173`

## Directory Structure
```
financial-comparison-tool/
├── backend/
│   ├── main.py               # FastAPI application & REST endpoints
│   ├── sec_data.py           # SEC EDGAR data integration & CIK mapping
│   ├── financial_ratios.py   # Ratio math & CAGR computation engine
│   └── ai_explainer.py       # AI comparative differences synthesis
├── frontend/
│   ├── src/
│   │   ├── components/       # KPI cards, charts, selector, AI modal
│   │   ├── services/api.ts   # Backend API client with offline fallback
│   │   ├── utils/exportUtils # Excel, PDF, and CSV exporters
│   │   ├── types.ts          # TypeScript schemas
│   │   └── App.tsx           # Dashboard layout & state management
│   └── package.json
└── README.md
```
