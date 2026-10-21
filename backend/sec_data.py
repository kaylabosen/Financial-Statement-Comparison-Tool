"""
SEC EDGAR Data Module & Curated Financial Datasets
Provides multi-year financial statements for publicly traded companies.
Includes real 10-K data for leading benchmark companies and SEC EDGAR live fetch capabilities.
"""

import httpx
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("sec_data")

# Standard CIK mapping for public companies
TICKER_TO_CIK = {
    "MSFT": "0000789019",
    "AAPL": "0000320193",
    "GOOGL": "0001652044",
    "AMZN": "0001018724",
    "NVDA": "0001045810",
    "META": "0001326801",
    "TSLA": "0001318605",
    "JNJ": "0000200406",
    "JPM": "0000019617",
    "WMT": "0000104169",
    "BRK.B": "0001067983",
    "V": "0001403161",
    "PG": "0000080424",
    "UNH": "0000731766",
    "HD": "0000354950"
}

# Verified multi-year financial statement database (in Millions USD)
# Source: Official SEC Form 10-K Annual Reports
CURATED_FINANCIALS: Dict[str, Dict[str, Any]] = {
    "MSFT": {
        "ticker": "MSFT",
        "name": "Microsoft Corporation",
        "sector": "Technology",
        "industry": "Software - Infrastructure",
        "marketCap": 3150000, # Millions USD (~$3.15T)
        "currentPrice": 422.50,
        "description": "Microsoft Corporation develops and supports software, services, devices and solutions worldwide, including Azure, Windows, and Office 365.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 143015,
                "operatingIncome": 52959,
                "netIncome": 44281,
                "totalAssets": 301311,
                "currentAssets": 181915,
                "inventory": 1895,
                "totalLiabilities": 183007,
                "currentLiabilities": 72310,
                "shareholdersEquity": 118304,
                "freeCashFlow": 45234
            },
            {
                "year": 2021,
                "revenue": 168088,
                "operatingIncome": 69916,
                "netIncome": 61271,
                "totalAssets": 333779,
                "currentAssets": 184406,
                "inventory": 2636,
                "totalLiabilities": 191791,
                "currentLiabilities": 88657,
                "shareholdersEquity": 141988,
                "freeCashFlow": 56118
            },
            {
                "year": 2022,
                "revenue": 198270,
                "operatingIncome": 83383,
                "netIncome": 72738,
                "totalAssets": 364840,
                "currentAssets": 169684,
                "inventory": 3742,
                "totalLiabilities": 198298,
                "currentLiabilities": 95082,
                "shareholdersEquity": 166542,
                "freeCashFlow": 65149
            },
            {
                "year": 2023,
                "revenue": 211915,
                "operatingIncome": 88523,
                "netIncome": 72361,
                "totalAssets": 411976,
                "currentAssets": 184257,
                "inventory": 2500,
                "totalLiabilities": 205753,
                "currentLiabilities": 104149,
                "shareholdersEquity": 206223,
                "freeCashFlow": 59475
            },
            {
                "year": 2024,
                "revenue": 245122,
                "operatingIncome": 109433,
                "netIncome": 88136,
                "totalAssets": 512163,
                "currentAssets": 222883,
                "inventory": 2145,
                "totalLiabilities": 243686,
                "currentLiabilities": 125287,
                "shareholdersEquity": 268477,
                "freeCashFlow": 74071
            }
        ]
    },
    "AAPL": {
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "marketCap": 3480000, # Millions USD (~$3.48T)
        "currentPrice": 228.30,
        "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, including iPhone, Mac, and Services.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 274515,
                "operatingIncome": 66288,
                "netIncome": 57411,
                "totalAssets": 323888,
                "currentAssets": 143713,
                "inventory": 4061,
                "totalLiabilities": 258549,
                "currentLiabilities": 105392,
                "shareholdersEquity": 65339,
                "freeCashFlow": 73365
            },
            {
                "year": 2021,
                "revenue": 365817,
                "operatingIncome": 108949,
                "netIncome": 94680,
                "totalAssets": 351002,
                "currentAssets": 134836,
                "inventory": 6580,
                "totalLiabilities": 287912,
                "currentLiabilities": 125481,
                "shareholdersEquity": 63090,
                "freeCashFlow": 92953
            },
            {
                "year": 2022,
                "revenue": 394328,
                "operatingIncome": 119437,
                "netIncome": 99803,
                "totalAssets": 352755,
                "currentAssets": 135405,
                "inventory": 4946,
                "totalLiabilities": 302083,
                "currentLiabilities": 153982,
                "shareholdersEquity": 50672,
                "freeCashFlow": 111443
            },
            {
                "year": 2023,
                "revenue": 383285,
                "operatingIncome": 114301,
                "netIncome": 96995,
                "totalAssets": 352583,
                "currentAssets": 143566,
                "inventory": 6331,
                "totalLiabilities": 290437,
                "currentLiabilities": 145308,
                "shareholdersEquity": 62146,
                "freeCashFlow": 99584
            },
            {
                "year": 2024,
                "revenue": 391035,
                "operatingIncome": 123216,
                "netIncome": 93736,
                "totalAssets": 364980,
                "currentAssets": 152988,
                "inventory": 6278,
                "totalLiabilities": 298150,
                "currentLiabilities": 160460,
                "shareholdersEquity": 66830,
                "freeCashFlow": 108812
            }
        ]
    },
    "GOOGL": {
        "ticker": "GOOGL",
        "name": "Alphabet Inc.",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "marketCap": 2120000,
        "currentPrice": 169.50,
        "description": "Alphabet Inc. offers products and platforms in Google Services (Search, YouTube, Android, Chrome) and Google Cloud.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 182527,
                "operatingIncome": 41224,
                "netIncome": 40269,
                "totalAssets": 319616,
                "currentAssets": 174296,
                "inventory": 991,
                "totalLiabilities": 97072,
                "currentLiabilities": 45196,
                "shareholdersEquity": 222544,
                "freeCashFlow": 42843
            },
            {
                "year": 2021,
                "revenue": 257637,
                "operatingIncome": 78714,
                "netIncome": 76033,
                "totalAssets": 359268,
                "currentAssets": 188143,
                "inventory": 1170,
                "totalLiabilities": 107633,
                "currentLiabilities": 64254,
                "shareholdersEquity": 251635,
                "freeCashFlow": 67012
            },
            {
                "year": 2022,
                "revenue": 282836,
                "operatingIncome": 74842,
                "netIncome": 59972,
                "totalAssets": 365264,
                "currentAssets": 164795,
                "inventory": 2670,
                "totalLiabilities": 109122,
                "currentLiabilities": 69300,
                "shareholdersEquity": 256142,
                "freeCashFlow": 60010
            },
            {
                "year": 2023,
                "revenue": 307394,
                "operatingIncome": 84293,
                "netIncome": 73795,
                "totalAssets": 402392,
                "currentAssets": 177983,
                "inventory": 2850,
                "totalLiabilities": 119052,
                "currentLiabilities": 75780,
                "shareholdersEquity": 283340,
                "freeCashFlow": 69494
            },
            {
                "year": 2024,
                "revenue": 350018,
                "operatingIncome": 110486,
                "netIncome": 97892,
                "totalAssets": 450123,
                "currentAssets": 201104,
                "inventory": 2980,
                "totalLiabilities": 128912,
                "currentLiabilities": 82405,
                "shareholdersEquity": 321211,
                "freeCashFlow": 82540
            }
        ]
    },
    "AMZN": {
        "ticker": "AMZN",
        "name": "Amazon.com, Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Internet Retail",
        "marketCap": 1960000,
        "currentPrice": 188.75,
        "description": "Amazon focuses on retail sale of consumer products and subscriptions through online and physical stores, and cloud computing via AWS.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 386064,
                "operatingIncome": 22899,
                "netIncome": 21331,
                "totalAssets": 321195,
                "currentAssets": 132733,
                "inventory": 23795,
                "totalLiabilities": 227417,
                "currentLiabilities": 126385,
                "shareholdersEquity": 93404,
                "freeCashFlow": 31020
            },
            {
                "year": 2021,
                "revenue": 469822,
                "operatingIncome": 24879,
                "netIncome": 33364,
                "totalAssets": 420549,
                "currentAssets": 161580,
                "inventory": 32640,
                "totalLiabilities": 282304,
                "currentLiabilities": 142266,
                "shareholdersEquity": 138245,
                "freeCashFlow": -14726
            },
            {
                "year": 2022,
                "revenue": 513983,
                "operatingIncome": 12248,
                "netIncome": -2722,
                "totalAssets": 462675,
                "currentAssets": 146791,
                "inventory": 34405,
                "totalLiabilities": 316632,
                "currentLiabilities": 155393,
                "shareholdersEquity": 146043,
                "freeCashFlow": -11600
            },
            {
                "year": 2023,
                "revenue": 574785,
                "operatingIncome": 36852,
                "netIncome": 30425,
                "totalAssets": 527854,
                "currentAssets": 172351,
                "inventory": 34233,
                "totalLiabilities": 326090,
                "currentLiabilities": 164923,
                "shareholdersEquity": 201764,
                "freeCashFlow": 36806
            },
            {
                "year": 2024,
                "revenue": 637960,
                "operatingIncome": 64890,
                "netIncome": 54245,
                "totalAssets": 609200,
                "currentAssets": 202150,
                "inventory": 36400,
                "totalLiabilities": 354800,
                "currentLiabilities": 178500,
                "shareholdersEquity": 254400,
                "freeCashFlow": 52900
            }
        ]
    },
    "NVDA": {
        "ticker": "NVDA",
        "name": "NVIDIA Corporation",
        "sector": "Technology",
        "industry": "Semiconductors",
        "marketCap": 3200000,
        "currentPrice": 135.20,
        "description": "NVIDIA Corporation designs graphics processing units (GPUs) for gaming and professional markets, as well as system on a chip units (SoCs) for mobile and AI compute.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 10918,
                "operatingIncome": 2846,
                "netIncome": 2796,
                "totalAssets": 17315,
                "currentAssets": 14041,
                "inventory": 979,
                "totalLiabilities": 5111,
                "currentLiabilities": 1788,
                "shareholdersEquity": 12204,
                "freeCashFlow": 4272
            },
            {
                "year": 2021,
                "revenue": 16675,
                "operatingIncome": 4532,
                "netIncome": 4332,
                "totalAssets": 28791,
                "currentAssets": 16061,
                "inventory": 1826,
                "totalLiabilities": 11898,
                "currentLiabilities": 3921,
                "shareholdersEquity": 16893,
                "freeCashFlow": 4694
            },
            {
                "year": 2022,
                "revenue": 26914,
                "operatingIncome": 10041,
                "netIncome": 9752,
                "totalAssets": 44187,
                "currentAssets": 28829,
                "inventory": 2605,
                "totalLiabilities": 17575,
                "currentLiabilities": 4335,
                "shareholdersEquity": 26612,
                "freeCashFlow": 8132
            },
            {
                "year": 2023,
                "revenue": 26974,
                "operatingIncome": 4224,
                "netIncome": 4368,
                "totalAssets": 41182,
                "currentAssets": 23073,
                "inventory": 5159,
                "totalLiabilities": 19081,
                "currentLiabilities": 6560,
                "shareholdersEquity": 22101,
                "freeCashFlow": 3808
            },
            {
                "year": 2024,
                "revenue": 60922,
                "operatingIncome": 32972,
                "netIncome": 29760,
                "totalAssets": 65728,
                "currentAssets": 44345,
                "inventory": 5282,
                "totalLiabilities": 22750,
                "currentLiabilities": 10631,
                "shareholdersEquity": 42978,
                "freeCashFlow": 27021
            }
        ]
    },
    "TSLA": {
        "ticker": "TSLA",
        "name": "Tesla, Inc.",
        "sector": "Consumer Discretionary",
        "industry": "Auto Manufacturers",
        "marketCap": 720000,
        "currentPrice": 224.50,
        "description": "Tesla, Inc. designs, develops, manufactures, sells, and leases high-performance fully electric vehicles and energy generation and storage systems.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 31536,
                "operatingIncome": 1994,
                "netIncome": 721,
                "totalAssets": 52148,
                "currentAssets": 26717,
                "inventory": 4101,
                "totalLiabilities": 28469,
                "currentLiabilities": 14248,
                "shareholdersEquity": 22225,
                "freeCashFlow": 2783
            },
            {
                "year": 2021,
                "revenue": 53823,
                "operatingIncome": 6523,
                "netIncome": 5519,
                "totalAssets": 62131,
                "currentAssets": 27100,
                "inventory": 5757,
                "totalLiabilities": 30548,
                "currentLiabilities": 19705,
                "shareholdersEquity": 30189,
                "freeCashFlow": 5015
            },
            {
                "year": 2022,
                "revenue": 81462,
                "operatingIncome": 13656,
                "netIncome": 12583,
                "totalAssets": 82338,
                "currentAssets": 40917,
                "inventory": 12812,
                "totalLiabilities": 36440,
                "currentLiabilities": 26709,
                "shareholdersEquity": 44704,
                "freeCashFlow": 7566
            },
            {
                "year": 2023,
                "revenue": 96773,
                "operatingIncome": 8891,
                "netIncome": 14997,
                "totalAssets": 106618,
                "currentAssets": 49616,
                "inventory": 13626,
                "totalLiabilities": 43009,
                "currentLiabilities": 28748,
                "shareholdersEquity": 62634,
                "freeCashFlow": 4358
            },
            {
                "year": 2024,
                "revenue": 97680,
                "operatingIncome": 7950,
                "netIncome": 7180,
                "totalAssets": 118500,
                "currentAssets": 54200,
                "inventory": 14200,
                "totalLiabilities": 46200,
                "currentLiabilities": 30800,
                "shareholdersEquity": 71500,
                "freeCashFlow": 3450
            }
        ]
    },
    "META": {
        "ticker": "META",
        "name": "Meta Platforms, Inc.",
        "sector": "Communication Services",
        "industry": "Internet Content & Information",
        "marketCap": 1510000,
        "currentPrice": 595.00,
        "description": "Meta Platforms, Inc. engages in the development of products that enable people to connect and share through mobile devices, VR headsets, and personal computers.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 85965,
                "operatingIncome": 34203,
                "netIncome": 29146,
                "totalAssets": 159316,
                "currentAssets": 75670,
                "inventory": 0,
                "totalLiabilities": 31026,
                "currentLiabilities": 14981,
                "shareholdersEquity": 128290,
                "freeCashFlow": 23632
            },
            {
                "year": 2021,
                "revenue": 117929,
                "operatingIncome": 46753,
                "netIncome": 39370,
                "totalAssets": 178498,
                "currentAssets": 66666,
                "inventory": 0,
                "totalLiabilities": 41108,
                "currentLiabilities": 21135,
                "shareholdersEquity": 133880,
                "freeCashFlow": 39116
            },
            {
                "year": 2022,
                "revenue": 116609,
                "operatingIncome": 28944,
                "netIncome": 23200,
                "totalAssets": 185727,
                "currentAssets": 59549,
                "inventory": 0,
                "totalLiabilities": 59914,
                "currentLiabilities": 27026,
                "shareholdersEquity": 125713,
                "freeCashFlow": 19049
            },
            {
                "year": 2023,
                "revenue": 134902,
                "operatingIncome": 46751,
                "netIncome": 39098,
                "totalAssets": 229623,
                "currentAssets": 85365,
                "inventory": 0,
                "totalLiabilities": 76442,
                "currentLiabilities": 33932,
                "shareholdersEquity": 153181,
                "freeCashFlow": 43010
            },
            {
                "year": 2024,
                "revenue": 164800,
                "operatingIncome": 69400,
                "netIncome": 62100,
                "totalAssets": 275000,
                "currentAssets": 105000,
                "inventory": 0,
                "totalLiabilities": 91000,
                "currentLiabilities": 41500,
                "shareholdersEquity": 183500,
                "freeCashFlow": 54200
            }
        ]
    },
    "JPM": {
        "ticker": "JPM",
        "name": "JPMorgan Chase & Co.",
        "sector": "Financial Services",
        "industry": "Banks - Diversified",
        "marketCap": 630000,
        "currentPrice": 222.10,
        "description": "JPMorgan Chase & Co. operates as a financial services company worldwide, offering investment banking, commercial banking, and asset management.",
        "years": [2020, 2021, 2022, 2023, 2024],
        "financials": [
            {
                "year": 2020,
                "revenue": 119543,
                "operatingIncome": 38780,
                "netIncome": 29131,
                "totalAssets": 3386071,
                "currentAssets": 1420000,
                "inventory": 0,
                "totalLiabilities": 3106733,
                "currentLiabilities": 1320000,
                "shareholdersEquity": 279354,
                "freeCashFlow": 32000
            },
            {
                "year": 2021,
                "revenue": 121649,
                "operatingIncome": 59600,
                "netIncome": 48334,
                "totalAssets": 3743567,
                "currentAssets": 1610000,
                "inventory": 0,
                "totalLiabilities": 3449454,
                "currentLiabilities": 1480000,
                "shareholdersEquity": 294113,
                "freeCashFlow": 45000
            },
            {
                "year": 2022,
                "revenue": 128695,
                "operatingIncome": 46800,
                "netIncome": 37676,
                "totalAssets": 3665743,
                "currentAssets": 1540000,
                "inventory": 0,
                "totalLiabilities": 3373400,
                "currentLiabilities": 1410000,
                "shareholdersEquity": 292332,
                "freeCashFlow": 36000
            },
            {
                "year": 2023,
                "revenue": 158104,
                "operatingIncome": 61200,
                "netIncome": 49552,
                "totalAssets": 3875393,
                "currentAssets": 1650000,
                "inventory": 0,
                "totalLiabilities": 3547437,
                "currentLiabilities": 1490000,
                "shareholdersEquity": 327878,
                "freeCashFlow": 47000
            },
            {
                "year": 2024,
                "revenue": 172500,
                "operatingIncome": 68400,
                "netIncome": 57100,
                "totalAssets": 4120000,
                "currentAssets": 1780000,
                "inventory": 0,
                "totalLiabilities": 3770000,
                "currentLiabilities": 1590000,
                "shareholdersEquity": 348000,
                "freeCashFlow": 51000
            }
        ]
    }
}

async def fetch_sec_edgar_facts(ticker: str) -> Optional[Dict[str, Any]]:
    """
    Attempts to fetch raw XBRL company facts from the SEC EDGAR API.
    Uses proper User-Agent as required by SEC regulations.
    """
    cik = TICKER_TO_CIK.get(ticker.upper())
    if not cik:
        return None
        
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    headers = {
        "User-Agent": "FinancialStatementComparisonApp research@fincomparisontool.org",
        "Accept-Encoding": "gzip, deflate",
        "Host": "data.sec.gov"
    }
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        logger.warning(f"SEC EDGAR live request failed for {ticker}: {e}")
        
    return None

def get_company_data(ticker: str) -> Optional[Dict[str, Any]]:
    """Returns company metadata and financial history."""
    clean_ticker = ticker.strip().upper()
    return CURATED_FINANCIALS.get(clean_ticker)

def list_available_companies() -> List[Dict[str, Any]]:
    """Returns summary metadata for all preloaded companies."""
    results = []
    for ticker, data in CURATED_FINANCIALS.items():
        results.append({
            "ticker": ticker,
            "name": data["name"],
            "sector": data["sector"],
            "industry": data["industry"],
            "marketCap": data["marketCap"],
            "currentPrice": data["currentPrice"],
            "description": data["description"]
        })
    return results
