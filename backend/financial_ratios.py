"""
Financial Ratio Analysis & Growth Math Engine
Calculates standard profitability, liquidity, leverage, and growth metrics.
"""

from typing import Dict, Any, List

def calculate_ratios_for_year(fin: Dict[str, Any]) -> Dict[str, float]:
    """Computes all key financial ratios for a given fiscal year."""
    rev = fin.get("revenue", 0)
    op_inc = fin.get("operatingIncome", 0)
    net_inc = fin.get("netIncome", 0)
    tot_assets = fin.get("totalAssets", 0)
    tot_liab = fin.get("totalLiabilities", 0)
    curr_assets = fin.get("currentAssets", 0)
    curr_liab = fin.get("currentLiabilities", 0)
    inventory = fin.get("inventory", 0)
    equity = fin.get("shareholdersEquity", 0)

    # 1. Profitability Ratios
    profit_margin = (net_inc / rev) if rev else 0.0
    operating_margin = (op_inc / rev) if rev else 0.0
    roa = (net_inc / tot_assets) if tot_assets else 0.0
    roe = (net_inc / equity) if equity else 0.0

    # 2. Liquidity Ratios
    current_ratio = (curr_assets / curr_liab) if curr_liab else 0.0
    quick_ratio = ((curr_assets - inventory) / curr_liab) if curr_liab else 0.0

    # 3. Leverage Ratios
    debt_to_equity = (tot_liab / equity) if equity else 0.0
    debt_ratio = (tot_liab / tot_assets) if tot_assets else 0.0

    return {
        "profitMargin": round(profit_margin, 4),
        "operatingMargin": round(operating_margin, 4),
        "returnOnAssets": round(roa, 4),
        "returnOnEquity": round(roe, 4),
        "currentRatio": round(current_ratio, 2),
        "quickRatio": round(quick_ratio, 2),
        "debtToEquity": round(debt_to_equity, 2),
        "debtRatio": round(debt_ratio, 4)
    }

def calculate_cagr(start_val: float, end_val: float, periods: int) -> float:
    """Calculates Compound Annual Growth Rate."""
    if start_val <= 0 or end_val <= 0 or periods <= 0:
        # Fallback to simple average growth if negative or zero base
        return round((end_val - start_val) / (abs(start_val) if start_val != 0 else 1.0) / max(periods, 1), 4)
    cagr = ((end_val / start_val) ** (1.0 / periods)) - 1.0
    return round(cagr, 4)

def enrich_company_financials(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enriches annual statements with computed ratios, YoY growth rates,
    and 5-year CAGR summaries.
    """
    financials = company_data.get("financials", [])
    enriched_financials = []
    
    for i, year_fin in enumerate(financials):
        year_copy = dict(year_fin)
        year_copy["ratios"] = calculate_ratios_for_year(year_fin)
        
        # Calculate YoY metrics if previous year exists
        if i > 0:
            prev = financials[i - 1]
            prev_rev = prev.get("revenue", 0)
            prev_ni = prev.get("netIncome", 0)
            prev_op = prev.get("operatingIncome", 0)
            prev_assets = prev.get("totalAssets", 0)
            prev_liab = prev.get("totalLiabilities", 0)
            prev_eq = prev.get("shareholdersEquity", 0)
            
            year_copy["yoy"] = {
                "revenueGrowth": round((year_fin["revenue"] - prev_rev) / prev_rev, 4) if prev_rev else 0.0,
                "netIncomeGrowth": round((year_fin["netIncome"] - prev_ni) / abs(prev_ni), 4) if prev_ni else 0.0,
                "operatingIncomeGrowth": round((year_fin["operatingIncome"] - prev_op) / abs(prev_op), 4) if prev_op else 0.0,
                "assetsGrowth": round((year_fin["totalAssets"] - prev_assets) / prev_assets, 4) if prev_assets else 0.0,
                "liabilitiesGrowth": round((year_fin["totalLiabilities"] - prev_liab) / prev_liab, 4) if prev_liab else 0.0,
                "equityGrowth": round((year_fin["shareholdersEquity"] - prev_eq) / abs(prev_eq), 4) if prev_eq else 0.0
            }
        else:
            year_copy["yoy"] = {
                "revenueGrowth": 0.0,
                "netIncomeGrowth": 0.0,
                "operatingIncomeGrowth": 0.0,
                "assetsGrowth": 0.0,
                "liabilitiesGrowth": 0.0,
                "equityGrowth": 0.0
            }
            
        enriched_financials.append(year_copy)

    # Calculate overall multi-year CAGRs
    cagr_summary = {}
    if len(financials) >= 2:
        n = len(financials) - 1
        first_yr = financials[0]
        last_yr = financials[-1]
        cagr_summary = {
            "periods": n,
            "startYear": first_yr["year"],
            "endYear": last_yr["year"],
            "revenueCAGR": calculate_cagr(first_yr.get("revenue", 1), last_yr.get("revenue", 1), n),
            "netIncomeCAGR": calculate_cagr(first_yr.get("netIncome", 1), last_yr.get("netIncome", 1), n),
            "operatingIncomeCAGR": calculate_cagr(first_yr.get("operatingIncome", 1), last_yr.get("operatingIncome", 1), n)
        }

    latest = enriched_financials[-1] if enriched_financials else {}
    previous = enriched_financials[-2] if len(enriched_financials) >= 2 else latest

    return {
        **company_data,
        "financials": enriched_financials,
        "latestYear": latest.get("year"),
        "latestFinancials": latest,
        "previousFinancials": previous,
        "cagrSummary": cagr_summary
    }
