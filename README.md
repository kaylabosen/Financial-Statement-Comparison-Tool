# Financial Statement Analysis & Company Comparison Web Application
**Course:** FIN 471 – Financial Modeling & Analytics  
**Project:** Financial Statement Comparison Tool  
**Repository:** [https://github.com/kaylabosen/Financial-Statement-Comparison-Tool](https://github.com/kaylabosen/Financial-Statement-Comparison-Tool)  

---

## 1. Project Purpose & Main Functionality

### Purpose
The **Financial Statement Comparison Tool** is an institutional-grade financial analytics platform developed to empower investors, analysts, and students to quickly benchmark and compare publicly traded companies side-by-side. Rather than manually sifting through hundreds of pages in individual SEC Form 10-K annual filings, this tool automates statement ingestion, computes standardized financial ratios across reporting periods, and synthesizes analytical narratives explaining differences in profitability, liquidity, and leverage.

### Main Functionality
- **Multi-Company Benchmark Panel**: Compare between **2 to 5 public companies** simultaneously (preloaded sample: **Microsoft (MSFT)** vs. **Apple (AAPL)**, with instant additions such as NVDA, GOOGL, AMZN, META, TSLA, and JPM).
- **Financial Summary KPI Cards**: Instant comparison of core balance sheet and income statement line items (Revenue, Operating Income, Net Income, Total Assets, Total Liabilities, and Shareholders' Equity) featuring prior-period baselines and color-coded Year-over-Year (YoY) percentage changes (**Green** for improvement, **Red** for decline, and **Gray** for neutral).
- **Interactive Financial Visualizations**:
  - *5-Year Revenue Trend Chart*: Multi-line comparative trajectory with tooltips, legend toggling, and individual company line filters.
  - *Net Income & Earnings Trajectory*: Toggle between nominal dollar amounts ($M) and annual growth percentages.
  - *Key Ratio Comparison Matrix*: Grouped bar charts contrasting ROA, ROE, Current Ratio, and Debt-to-Equity across selected peers.
  - *Balance Sheet Capital Structure*: Stacked bar charts depicting the distribution of creditor claims (Liabilities) vs. shareholder claims (Equity) funding Total Assets.
- **Historical 5-Year Performance Table**: Multi-year tabular financials including calculated annual YoY growth rates and **Compound Annual Growth Rate (CAGR)** across 3-year and 5-year periods.
- **AI-Powered "Explain Differences" Engine**: Algorithmic financial diagnostic synthesis explaining operating efficiency, working capital resilience, debt sensitivity, risk implications, and investment considerations with clear leader badges.
- **Exporting Suite**: One-click client and server-side exports to **Excel (.xlsx)** with multiple formatted worksheets, **CSV**, and formatted **PDF Reports**.
- **Financial Terminal UX**: Terminal-inspired aesthetic with toggleable **Dark Mode** and **Light Mode**.

---

## 2. Installation & Running Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher) and **npm**
- **Python** (v3.10 to v3.14) and **pip**
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### Step 1: Clone the Repository
```bash
git clone https://github.com/kaylabosen/Financial-Statement-Comparison-Tool.git
cd Financial-Statement-Comparison-Tool
```

### Step 2: Backend Setup (FastAPI)
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install fastapi uvicorn requests httpx pydantic
   ```
3. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The backend will be running at `http://localhost:8000`. You can view interactive Swagger API documentation at `http://localhost:8000/docs`.*

### Step 3: Frontend Setup (React + TypeScript + Vite)
1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

*(Alternatively on Windows, you can double-click [`start.bat`](start.bat) in the root directory to launch both servers simultaneously).*

---

## 3. Data Sources & SEC EDGAR API Documentation

### SEC EDGAR Facts API Integration
The application retrieves raw XBRL company disclosures directly from the **U.S. Securities and Exchange Commission (SEC) EDGAR API**:
- **Endpoint Structure**: `https://data.sec.gov/api/xbrl/companyfacts/CIK{CIK_10_DIGITS}.json`
- **SEC Compliance**: In accordance with official SEC EDGAR Fair Access rules, requests transmit a declared `User-Agent` header (`FinancialStatementComparisonApp research@fincomparisontool.org`) adhering to the 10 request-per-second fair access policy.
- **CIK Resolution**: Company tickers are resolved to 10-digit Central Index Keys (e.g., `MSFT` $\rightarrow$ `0000789019`, `AAPL` $\rightarrow$ `0000320193`, `GOOGL` $\rightarrow$ `0001652044`, `NVDA` $\rightarrow$ `0001045810`).

### Statement Datasets
The application ingests standardized Form 10-K audited annual statements spanning 5 consecutive fiscal years (2020 – 2024):
- **Income Statement Concepts**: `Revenues` / `RevenueFromContractWithCustomerExcludingAssessedTax`, `OperatingIncomeLoss`, `NetIncomeLoss`.
- **Balance Sheet Concepts**: `Assets`, `AssetsCurrent`, `InventoryNet`, `Liabilities`, `LiabilitiesCurrent`, `StockholdersEquity`.
- **Cash Flow Statement Concepts**: `NetCashProvidedByUsedInOperatingActivities`, `PaymentsToAcquirePropertyPlantAndEquipment` (deriving **Free Cash Flow**).
- **Curated High-Fidelity Dataset**: To ensure zero network latency, immediate offline review, and resilience against external SEC rate limits, audited 10-K figures for major benchmark companies are also embedded in the internal data engine.

---

## 4. Financial Concepts & Ratio Analysis

The application automatically calculates and benchmarks eight essential financial ratios grouped into three primary categories, plus compound growth rates:

### A. Profitability Ratios
1. **Net Profit Margin**:
   $$\text{Profit Margin} = \frac{\text{Net Income}}{\text{Revenue}}$$
   *Measures the proportion of each dollar of revenue that translates into bottom-line net profit after accounting for all operating expenses, taxes, and interest.*
2. **Operating Margin**:
   $$\text{Operating Margin} = \frac{\text{Operating Income}}{\text{Revenue}}$$
   *Evaluates operational efficiency and core business profitability prior to non-operating items and capital structure financing costs.*
3. **Return on Assets (ROA)**:
   $$\text{ROA} = \frac{\text{Net Income}}{\text{Total Assets}}$$
   *Indicates how effectively corporate management utilizes the firm's asset base to generate earnings.*
4. **Return on Equity (ROE)**:
   $$\text{ROE} = \frac{\text{Net Income}}{\text{Shareholders' Equity}}$$
   *Measures the rate of return generated on the book value of capital contributed by equity shareholders.*

### B. Liquidity Ratios
5. **Current Ratio**:
   $$\text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}}$$
   *Tests the company's ability to satisfy short-term obligations maturing within 12 months using short-term liquid resources.*
6. **Quick Ratio (Acid-Test)**:
   $$\text{Quick Ratio} = \frac{\text{Current Assets} - \text{Inventory}}{\text{Current Liabilities}}$$
   *A stricter gauge of immediate solvency that excludes less-liquid inventory from current assets.*

### C. Leverage & Capital Structure Ratios
7. **Debt-to-Equity Ratio (D/E)**:
   $$\text{Debt-to-Equity} = \frac{\text{Total Liabilities}}{\text{Shareholders' Equity}}$$
   *Assesses financial leverage by comparing creditor claims to net equity capital. Higher ratios reflect greater financial risk and debt reliance.*
8. **Debt Ratio**:
   $$\text{Debt Ratio} = \frac{\text{Total Liabilities}}{\text{Total Assets}}$$
   *Quantifies the percentage of the firm's assets financed through creditors and debt obligations rather than equity.*

### D. Multi-Year Growth Metrics
- **Year-over-Year (YoY) Growth**: $\frac{\text{Value}_t - \text{Value}_{t-1}}{\text{Value}_{t-1}}$
- **Compound Annual Growth Rate (CAGR)**:
  $$\text{CAGR} = \left(\frac{\text{End Value}}{\text{Start Value}}\right)^{\frac{1}{n}} - 1$$
  *Smooths out annual fluctuations to calculate the geometric annualized growth rate across the 5-year observation period.*

---

## 5. Use of the Antigravity AI Coding Agent

This prototype was designed and constructed collaboratively using **Google Antigravity**, an agentic AI coding assistant developed by DeepMind. Antigravity was leveraged to accelerate full-stack development, execute system verification commands, and translate financial specifications into code:
- **Architectural Scaffolding**: Antigravity generated the dual-layer architecture consisting of a Python FastAPI backend for financial mathematics and XBRL parsing paired with a modern React 18, TypeScript, Tailwind CSS, and Recharts frontend.
- **Ratio & Growth Formulation**: The agent translated standard corporate finance formulas (ROA, ROE, Current Ratio, Quick Ratio, Debt-to-Equity, and multi-year CAGR) into TypeScript and Python mathematical routines with proper boundary and zero-division checks.
- **AI Narrative Synthesis**: Antigravity structured the algorithmic rules and narrative templates for the *"Explain Differences"* feature, ensuring the generated commentary accurately diagnoses operational efficiency, liquidity cushions, and balance sheet leverage risks.
- **Debugging & Toolchain Orchestration**: Antigravity handled local Node.js environment resolution, resolved Vite and Tailwind v4 compilation pipelines, and executed automated API endpoint and export tests.

---

## 6. Known Limitations & Future Improvements

While the application provides a robust comparative framework, several limitations exist:
1. **Fiscal Year Alignment Discrepancies**: Different companies operate under divergent fiscal year cycles (e.g., Apple's fiscal year concludes in late September, Microsoft's in June, and Alphabet's in December). While values correspond to identical reporting labels ("FY2024"), calendar quarter boundaries differ slightly.
2. **Off-Balance-Sheet & Operating Leases**: Standardized 10-K extraction relies on aggregate Total Liabilities; operating leases capitalized under ASC 842 are included in total liabilities but may differ from traditional funded debt metrics used in credit rating agency models.
3. **Coverage Scope**: Live automated SEC EDGAR parsing is currently optimized for U.S. domestic filers reporting under U.S. GAAP on Form 10-K, rather than foreign private issuers reporting under IFRS on Form 20-F.
4. **SEC Fair-Use Throttling**: Direct live requests to the SEC EDGAR API are restricted to a maximum of 10 requests per second per IP address; heavy concurrent batch requests require caching to avoid HTTP 429 rate-limiting responses.

---

## 7. Application Screenshots

### Screenshot 1: Financial Dashboard & Comparative KPI Overview
*The primary dashboard showcasing the Company Selection Panel, KPI summary cards with YoY growth indicators, and the 5-year Revenue Trend chart.*

![Financial Dashboard Overview](screenshots/Screenshot%202026-10-21%20140824.png)
*(File: `Screenshot 2026-10-21 140824.png`)*

---

### Screenshot 2: Financial Ratio Benchmarks & AI "Explain Differences" Modal
*Side-by-side grouped ratio charts (ROA, ROE, Current Ratio, Debt-to-Equity) and the AI Financial Differences analysis modal.*

![Financial Ratio Benchmarks & AI Explainer](screenshots/Screenshot%202026-10-21%20140905.png)
*(File: `Screenshot 2026-10-21 140905.png`)*

---

## 8. Authors & Academic Integrity

- **Course:** FIN 471 – Financial Modeling & Analytics
- **Author:** Kayla Bosen
- **Institution:** North Dakota State University (NDSU)
- **License:** MIT License – Open for educational and academic financial research.
