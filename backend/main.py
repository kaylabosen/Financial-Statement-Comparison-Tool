"""
Financial Statement Comparison Tool - FastAPI Backend Server
Provides endpoints for company listings, financial statements, calculated ratios,
comparative charts, AI financial differences, and CSV/Excel exports.
"""

from fastapi import FastAPI, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import io
import csv

from sec_data import get_company_data, list_available_companies, fetch_sec_edgar_facts
from financial_ratios import enrich_company_financials
from ai_explainer import generate_financial_explanation

app = FastAPI(
    title="Financial Statement Comparison Tool API",
    description="REST API for analyzing and comparing public company financial statements.",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server and production clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Financial Statement Comparison Tool", "version": "1.0.0"}

@app.get("/api/companies")
def get_companies(search: Optional[str] = None):
    """Returns available companies with optional search filter."""
    companies = list_available_companies()
    if search:
        q = search.lower().strip()
        companies = [
            c for c in companies 
            if q in c["ticker"].lower() or q in c["name"].lower() or q in c["sector"].lower()
        ]
    return {"companies": companies}

@app.get("/api/compare")
def compare_companies(tickers: str = Query(..., description="Comma-separated tickers, e.g. MSFT,AAPL")):
    """
    Retrieves and enriches financial statements for 2 to 5 companies.
    Computes key ratios, YoY trends, and CAGRs.
    """
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    if len(ticker_list) < 1:
        raise HTTPException(status_code=400, detail="At least 1 company ticker must be provided.")
    if len(ticker_list) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 companies can be compared simultaneously.")

    results = []
    missing = []
    
    for ticker in ticker_list:
        raw_data = get_company_data(ticker)
        if raw_data:
            enriched = enrich_company_financials(raw_data)
            results.append(enriched)
        else:
            missing.append(ticker)

    if not results:
        raise HTTPException(
            status_code=404, 
            detail=f"None of the requested tickers were found: {', '.join(missing)}. Available sample tickers include MSFT, AAPL, GOOGL, AMZN, NVDA, TSLA, META, JPM."
        )

    return {
        "compared": results,
        "missing": missing,
        "count": len(results)
    }

@app.get("/api/explain-differences")
def explain_differences(tickers: str = Query(..., description="Comma-separated tickers")):
    """
    Generates AI comparative financial analysis across profitability,
    liquidity, leverage, growth, and risks.
    """
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    companies = []
    for ticker in ticker_list:
        raw_data = get_company_data(ticker)
        if raw_data:
            companies.append(enrich_company_financials(raw_data))

    if len(companies) < 2:
        raise HTTPException(status_code=400, detail="At least 2 valid companies required to explain differences.")

    narrative = generate_financial_explanation(companies)
    return narrative

@app.get("/api/export/csv")
def export_csv(tickers: str = Query(..., description="Comma-separated tickers")):
    """Generates a downloadable CSV containing all financial years and ratios."""
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    output = io.StringIO()
    writer = csv.writer(output)

    # Write CSV Header
    writer.writerow([
        "Ticker", "Company Name", "Fiscal Year", "Revenue ($M)", "Operating Income ($M)",
        "Net Income ($M)", "Total Assets ($M)", "Current Assets ($M)", "Inventory ($M)",
        "Total Liabilities ($M)", "Current Liabilities ($M)", "Shareholders Equity ($M)",
        "Free Cash Flow ($M)", "Profit Margin", "Operating Margin", "ROA", "ROE",
        "Current Ratio", "Quick Ratio", "Debt to Equity", "Debt Ratio",
        "YoY Revenue Growth", "YoY Net Income Growth"
    ])

    for ticker in ticker_list:
        raw_data = get_company_data(ticker)
        if raw_data:
            enriched = enrich_company_financials(raw_data)
            for fin in enriched.get("financials", []):
                ratios = fin.get("ratios", {})
                yoy = fin.get("yoy", {})
                writer.writerow([
                    enriched["ticker"],
                    enriched["name"],
                    fin.get("year"),
                    fin.get("revenue"),
                    fin.get("operatingIncome"),
                    fin.get("netIncome"),
                    fin.get("totalAssets"),
                    fin.get("currentAssets"),
                    fin.get("inventory"),
                    fin.get("totalLiabilities"),
                    fin.get("currentLiabilities"),
                    fin.get("shareholdersEquity"),
                    fin.get("freeCashFlow"),
                    f"{ratios.get('profitMargin', 0)*100:.2f}%",
                    f"{ratios.get('operatingMargin', 0)*100:.2f}%",
                    f"{ratios.get('returnOnAssets', 0)*100:.2f}%",
                    f"{ratios.get('returnOnEquity', 0)*100:.2f}%",
                    ratios.get("currentRatio"),
                    ratios.get("quickRatio"),
                    ratios.get("debtToEquity"),
                    f"{ratios.get('debtRatio', 0)*100:.2f}%",
                    f"{yoy.get('revenueGrowth', 0)*100:.2f}%",
                    f"{yoy.get('netIncomeGrowth', 0)*100:.2f}%"
                ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=financial_comparison_{'_'.join(ticker_list)}.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
