"""
AI Financial Analysis & Narrative Generator
Generates institutional-grade comparative evaluations between 2 to 5 public companies.
Analyzes profitability, liquidity, financial leverage, growth rates, risks, and investment profiles.
"""

from typing import List, Dict, Any

def generate_financial_explanation(companies: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Synthesizes deep financial comparative narrative for selected companies.
    """
    if not companies or len(companies) < 2:
        return {
            "title": "Insufficient Data for Comparison",
            "summary": "Please select at least two companies to generate a comparative financial analysis.",
            "sections": []
        }

    # Extract latest stats for each company
    stats = []
    for c in companies:
        ticker = c["ticker"]
        name = c["name"]
        latest = c.get("latestFinancials", {})
        ratios = latest.get("ratios", {})
        yoy = latest.get("yoy", {})
        cagr = c.get("cagrSummary", {})
        
        stats.append({
            "ticker": ticker,
            "name": name,
            "revenue": latest.get("revenue", 0),
            "netIncome": latest.get("netIncome", 0),
            "operatingIncome": latest.get("operatingIncome", 0),
            "profitMargin": ratios.get("profitMargin", 0.0),
            "operatingMargin": ratios.get("operatingMargin", 0.0),
            "roa": ratios.get("returnOnAssets", 0.0),
            "roe": ratios.get("returnOnEquity", 0.0),
            "currentRatio": ratios.get("currentRatio", 0.0),
            "quickRatio": ratios.get("quickRatio", 0.0),
            "debtToEquity": ratios.get("debtToEquity", 0.0),
            "debtRatio": ratios.get("debtRatio", 0.0),
            "revGrowth": yoy.get("revenueGrowth", 0.0),
            "niGrowth": yoy.get("netIncomeGrowth", 0.0),
            "revCAGR": cagr.get("revenueCAGR", 0.0),
            "year": latest.get("year", 2024)
        })

    # Sort helpers
    most_profitable = max(stats, key=lambda x: x["operatingMargin"])
    least_profitable = min(stats, key=lambda x: x["operatingMargin"])
    
    most_liquid = max(stats, key=lambda x: x["currentRatio"])
    least_liquid = min(stats, key=lambda x: x["currentRatio"])
    
    highest_leverage = max(stats, key=lambda x: x["debtToEquity"])
    lowest_leverage = min(stats, key=lambda x: x["debtToEquity"])
    
    highest_growth = max(stats, key=lambda x: x["revCAGR"])

    # High-level summary paragraph
    tickers_str = " vs ".join([s["ticker"] for s in stats])
    
    if len(stats) == 2:
        c1, c2 = stats[0], stats[1]
        summary_text = (
            f"{c1['name']} ({c1['ticker']}) and {c2['name']} ({c2['ticker']}) present contrasting financial structures. "
            f"{most_profitable['name']} demonstrates superior operational efficiency with an operating margin of "
            f"{most_profitable['operatingMargin']*100:.1f}%, compared to {least_profitable['operatingMargin']*100:.1f}% for {least_profitable['name']}. "
            f"On solvency, {highest_leverage['name']} operates with higher financial leverage (D/E: {highest_leverage['debtToEquity']:.2f}x), "
            f"whereas {lowest_leverage['name']} maintains a more conservative balance sheet (D/E: {lowest_leverage['debtToEquity']:.2f}x). "
            f"{most_liquid['name']} provides stronger short-term liquidity with a current ratio of {most_liquid['currentRatio']:.2f}."
        )
    else:
        summary_text = (
            f"Across the {len(stats)} evaluated companies ({', '.join([s['ticker'] for s in stats])}), "
            f"{most_profitable['name']} ({most_profitable['ticker']}) commands the highest operating margin at {most_profitable['operatingMargin']*100:.1f}%, "
            f"while {highest_growth['name']} leads in multi-year revenue expansion with a 5-year CAGR of {highest_growth['revCAGR']*100:.1f}%. "
            f"Balance sheet risk profiles diverge significantly: {lowest_leverage['ticker']} maintains the lowest debt ratio ({lowest_leverage['debtRatio']*100:.1f}%), "
            f"while {highest_leverage['ticker']} utilizes the most aggressive financial leverage ({highest_leverage['debtToEquity']:.2f}x Debt-to-Equity)."
        )

    # Section 1: Profitability Comparison
    prof_details = []
    for s in stats:
        prof_details.append(
            f"• **{s['ticker']} ({s['name']})**: Operating Margin of **{s['operatingMargin']*100:.1f}%**, "
            f"Net Profit Margin of **{s['profitMargin']*100:.1f}%**, ROA of **{s['roa']*100:.1f}%**, and ROE of **{s['roe']*100:.1f}%**."
        )
    prof_text = (
        f"{most_profitable['name']} ({most_profitable['ticker']}) generates the greatest operating earnings per dollar of sales. "
        f"A higher operating margin indicates resilient pricing power, scale efficiencies, and disciplined cost structures.\n\n"
        + "\n".join(prof_details)
    )

    # Section 2: Liquidity & Solvency Profile
    liq_details = []
    for s in stats:
        liq_status = "Robust" if s["currentRatio"] >= 1.5 else "Adequate" if s["currentRatio"] >= 1.0 else "Tight working capital"
        liq_details.append(
            f"• **{s['ticker']}**: Current Ratio **{s['currentRatio']:.2f}x**, Quick Ratio **{s['quickRatio']:.2f}x** ({liq_status})."
        )
    liq_text = (
        f"{most_liquid['name']} exhibits the most solid liquidity cushion with a current ratio of {most_liquid['currentRatio']:.2f}x, "
        f"implying ample short-term assets to satisfy near-term commitments without requiring debt issuance or asset liquidations.\n\n"
        + "\n".join(liq_details)
    )

    # Section 3: Leverage & Capital Structure
    lev_details = []
    for s in stats:
        lev_details.append(
            f"• **{s['ticker']}**: Debt-to-Equity **{s['debtToEquity']:.2f}x**, Debt Ratio **{s['debtRatio']*100:.1f}%** of total assets."
        )
    lev_text = (
        f"Financial leverage differences indicate distinct capital allocation philosophies. "
        f"{highest_leverage['name']} ({highest_leverage['ticker']}) carries more debt obligations relative to its equity base, "
        f"which amplifies returns on equity in favorable cycles but introduces higher sensitivity to interest rate environments. "
        f"Conversely, {lowest_leverage['name']} preserves greater financial flexibility.\n\n"
        + "\n".join(lev_details)
    )

    # Section 4: Revenue Growth & Multi-Year Momentum
    growth_details = []
    for s in stats:
        growth_details.append(
            f"• **{s['ticker']}**: 5-Year Revenue CAGR **{s['revCAGR']*100:.1f}%**, Most Recent YoY Revenue Growth **{s['revGrowth']*100:.1f}%**."
        )
    growth_text = (
        f"{highest_growth['name']} ({highest_growth['ticker']}) demonstrated the highest sustained compound top-line expansion. "
        f"Analyzing multi-year CAGR alongside recent single-year YoY growth reveals whether each business is accelerating, "
        f"maturing into a cash cow, or cycling through market demand shifts.\n\n"
        + "\n".join(growth_details)
    )

    # Section 5: Risk Implications & Investment Considerations
    considerations = [
        f"**Solvency & Interest Rate Sensitivity**: Firms like {highest_leverage['ticker']} with higher debt multiples require monitoring of interest coverage and debt rollover terms.",
        f"**Margin Sustainability**: {most_profitable['ticker']}'s high profit margin reflects strong competitive moat; check whether reinvestment or competitor pricing could pressure margins.",
        f"**Cash Generation & Capital Returns**: Companies exhibiting strong free cash flow conversion can reliably fund share buybacks, dividends, and strategic acquisitions even during macroeconomic downturns."
    ]

    return {
        "title": f"Comparative Financial Statement Analysis: {tickers_str}",
        "summary": summary_text,
        "sections": [
            {
                "id": "profitability",
                "title": "Profitability & Operating Efficiency",
                "content": prof_text,
                "winner": most_profitable["ticker"],
                "metric": f"{most_profitable['operatingMargin']*100:.1f}% Operating Margin"
            },
            {
                "id": "liquidity",
                "title": "Liquidity & Working Capital Health",
                "content": liq_text,
                "winner": most_liquid["ticker"],
                "metric": f"{most_liquid['currentRatio']:.2f}x Current Ratio"
            },
            {
                "id": "leverage",
                "title": "Capital Structure & Leverage Risk",
                "content": lev_text,
                "winner": lowest_leverage["ticker"],
                "metric": f"{lowest_leverage['debtToEquity']:.2f}x Debt-to-Equity"
            },
            {
                "id": "growth",
                "title": "Revenue Growth Trajectory (5-Year CAGR)",
                "content": growth_text,
                "winner": highest_growth["ticker"],
                "metric": f"{highest_growth['revCAGR']*100:.1f}% CAGR"
            },
            {
                "id": "considerations",
                "title": "Risk Implications & Analyst Takeaways",
                "content": "\n\n".join(considerations),
                "winner": None,
                "metric": None
            }
        ]
    }
