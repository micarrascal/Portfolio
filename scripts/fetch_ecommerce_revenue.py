"""
fetch_ecommerce_revenue.py
E-commerce revenue & funnel analytics — built entirely from real open datasets.

Sources:
  - UCI "Online Retail II"      : real invoice-level transactions from a UK-based
                                   online gift retailer, Dec 2009 - Dec 2011.
                                   https://archive.ics.uci.edu/dataset/502/online+retail+ii
  - REES46 Marketing Platform   : real anonymized clickstream events (view / cart /
    "cosmetics shop" dataset      remove_from_cart / purchase) from an online
                                   cosmetics store, Dec 2019.
                                   https://rees46.com/en/datasets

Requires:
  pip install pandas openpyxl

Generates (src/data/):
  ecommerce-monthly.json    monthly revenue, prior-year revenue, 3-month moving avg
  ecommerce-categories.json revenue by product category (Online Retail II, keyword-derived)
  ecommerce-countries.json  revenue by country (Online Retail II)
  ecommerce-funnel.json     real session funnel: view -> cart -> purchase (REES46)
  ecommerce-brands.json     revenue by brand (REES46)
  ecommerce-summary.json    headline KPIs used by the dashboard + homepage case study
"""

import io
import json
import os
import re
import urllib.request
import zipfile
from collections import defaultdict

import pandas as pd

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA   = os.path.join(ROOT, "src", "data")
os.makedirs(DATA, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

RETAIL_URL   = "https://archive.ics.uci.edu/static/public/502/online+retail+ii.zip"
COSMETICS_URL = "https://data.rees46.com/datasets/cosmetics/2019-Dec.csv.gz"


def log(msg: str) -> None:
    print(f"[fetch_ecommerce_revenue] {msg}")


# ── 1. Download & load Online Retail II ─────────────────────────────────────

def load_online_retail() -> pd.DataFrame:
    log("Downloading UCI Online Retail II ...")
    req = urllib.request.Request(RETAIL_URL, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read()
    log(f"  {len(raw)/1e6:.1f} MB downloaded, extracting ...")

    zf = zipfile.ZipFile(io.BytesIO(raw))
    xlsx_name = next(n for n in zf.namelist() if n.lower().endswith(".xlsx"))
    with zf.open(xlsx_name) as f:
        xlsx_bytes = io.BytesIO(f.read())

    sheets = pd.read_excel(xlsx_bytes, sheet_name=None, engine="openpyxl")
    frames = []
    for name, df in sheets.items():
        df = df.rename(columns={
            "Invoice": "InvoiceNo", "Price": "UnitPrice", "Customer ID": "CustomerID",
        })
        frames.append(df)
    combined = pd.concat(frames, ignore_index=True)
    log(f"  {len(combined):,} rows loaded across {len(sheets)} sheet(s)")
    return combined


# Non-product line items (shipping, manual adjustments, marketplace fees) —
# real charges in the ledger, but not product sales, so excluded from
# category/product analysis to keep those figures meaningful.
NON_PRODUCT_CODES = {"POST", "DOT", "M", "BANK CHARGES", "AMAZONFEE", "C2", "PADS", "ADJUST", "ADJUST2", "TEST001", "TEST002", "S", "B", "gift_0001_10", "gift_0001_20", "gift_0001_30", "gift_0001_40", "gift_0001_50"}


def clean_retail(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["InvoiceNo"] = df["InvoiceNo"].astype(str)
    df["StockCode"] = df["StockCode"].astype(str)
    df["is_cancelled"] = df["InvoiceNo"].str.startswith("C")
    df["is_product"] = ~df["StockCode"].isin(NON_PRODUCT_CODES)
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
    df["Revenue"] = df["Quantity"] * df["UnitPrice"]
    return df


CATEGORY_KEYWORDS = [
    ("Christmas & Seasonal", ["christmas", "xmas", "advent", "santa", "snowman", "reindeer", "halloween", "easter"]),
    ("Bags & Accessories",   ["bag", "purse", "wallet", "umbrella", "shopper"]),
    ("Home Decor",           ["frame", "sign", "hanging", "decoration", "ornament", "mirror", "vase", "wreath",
                               "heart", "wicker", "memoboard", "chalkboard", "doormat", "clock", "cabinet",
                               "storage cube", "trinket box", "hottie", "blackboard"]),
    ("Kitchen & Dining",     ["mug", "cup", "plate", "bowl", "kitchen", "teapot", "cutlery", "tin", "jar", "bottle",
                               "cake stand", "baking", "snack box", "tea set", "tea glass", "picnic"]),
    ("Lighting & Candles",   ["candle", "light", "lantern", "holder", "lamp"]),
    ("Stationery & Cards",   ["card", "notebook", "pen", "pencil", "paper", "gift wrap", "ribbon", "sticker"]),
    ("Jewelry & Fashion",    ["necklace", "bracelet", "earring", "ring", "hat", "scarf", "silk fan"]),
    ("Toys & Games",         ["toy", "game", "doll", "puzzle", "playing cards", "building block", "alphabet block", "harmonica"]),
    ("Garden",               ["garden", "plant pot", "watering", "parasol"]),
]


def categorize(desc: str) -> str:
    if not isinstance(desc, str):
        return "Other"
    d = desc.lower()
    for label, keywords in CATEGORY_KEYWORDS:
        if any(k in d for k in keywords):
            return label
    return "Other"


def build_monthly(df: pd.DataFrame) -> list[dict]:
    sales = df[(~df["is_cancelled"]) & (df["Quantity"] > 0) & (df["UnitPrice"] > 0)].copy()
    sales["ym"] = sales["InvoiceDate"].dt.to_period("M")
    monthly = sales.groupby("ym")["Revenue"].sum().sort_index()

    out = []
    values = monthly.to_dict()
    periods = sorted(values.keys())

    # The dataset cuts off mid-month (Dec 9, 2011) — drop that partial month
    # so the chart doesn't show a fake year-end "collapse".
    last_day = sales["InvoiceDate"].max().day
    if last_day < 25 and periods:
        periods = periods[:-1]
    for p in periods:
        prev_year_period = p - 12
        rolling = [values[q] for q in periods if periods.index(q) <= periods.index(p) and periods.index(q) > periods.index(p) - 3]
        out.append({
            "month": str(p),
            "label": p.strftime("%b %Y"),
            "revenue": round(values[p]),
            "prevYear": round(values[prev_year_period]) if prev_year_period in values else None,
            "movingAvg3": round(sum(rolling) / len(rolling)),
        })
    return out


def build_categories(df: pd.DataFrame) -> list[dict]:
    sales = df[(~df["is_cancelled"]) & (df["Quantity"] > 0) & (df["UnitPrice"] > 0) & df["is_product"]].copy()
    sales["category"] = sales["Description"].apply(categorize)
    grouped = sales.groupby("category").agg(
        revenue=("Revenue", "sum"),
        units=("Quantity", "sum"),
        products=("StockCode", "nunique"),
    ).reset_index()
    grouped = grouped.sort_values("revenue", ascending=False)
    return [
        {
            "category": row["category"],
            "revenue": round(row["revenue"]),
            "units": int(row["units"]),
            "products": int(row["products"]),
        }
        for _, row in grouped.iterrows()
    ]


def build_countries(df: pd.DataFrame) -> list[dict]:
    sales = df[(~df["is_cancelled"]) & (df["Quantity"] > 0) & (df["UnitPrice"] > 0)].copy()
    grouped = sales.groupby("Country").agg(
        revenue=("Revenue", "sum"),
        orders=("InvoiceNo", "nunique"),
    ).reset_index().sort_values("revenue", ascending=False)
    return [
        {"country": row["Country"], "revenue": round(row["revenue"]), "orders": int(row["orders"])}
        for _, row in grouped.iterrows()
    ]


def build_retail_summary(df: pd.DataFrame) -> dict:
    sales = df[(~df["is_cancelled"]) & (df["Quantity"] > 0) & (df["UnitPrice"] > 0)]
    cancelled = df[df["is_cancelled"]]
    total_revenue = sales["Revenue"].sum()
    total_orders = sales["InvoiceNo"].nunique()
    unique_customers = sales["CustomerID"].dropna().nunique()
    uk_revenue = sales.loc[sales["Country"] == "United Kingdom", "Revenue"].sum()
    return {
        "totalRevenue": round(total_revenue),
        "totalOrders": int(total_orders),
        "uniqueCustomers": int(unique_customers),
        "avgOrderValue": round(total_revenue / total_orders, 2),
        "ukRevenueShare": round(100 * uk_revenue / total_revenue, 1),
        "cancelledInvoices": int(cancelled["InvoiceNo"].nunique()),
        "cancellationRate": round(100 * cancelled["InvoiceNo"].nunique() / (sales["InvoiceNo"].nunique() + cancelled["InvoiceNo"].nunique()), 1),
        "dateStart": str(df["InvoiceDate"].min().date()),
        "dateEnd": str(df["InvoiceDate"].max().date()),
    }


# ── 2. Download & load REES46 cosmetics clickstream ─────────────────────────

def load_cosmetics_events() -> pd.DataFrame:
    log("Downloading REES46 cosmetics shop events (Dec 2019) ...")
    req = urllib.request.Request(COSMETICS_URL, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw = resp.read()
    log(f"  {len(raw)/1e6:.1f} MB downloaded, parsing ...")
    df = pd.read_csv(
        io.BytesIO(raw), compression="gzip",
        usecols=["event_type", "product_id", "category_code", "brand", "price", "user_session"],
        dtype={"event_type": "category", "category_code": "category", "brand": "category"},
    )
    log(f"  {len(df):,} events loaded")
    return df


def build_funnel(df: pd.DataFrame) -> list[dict]:
    sessions_all      = df["user_session"].nunique()
    sessions_view      = df.loc[df["event_type"] == "view", "user_session"].nunique()
    sessions_cart       = df.loc[df["event_type"] == "cart", "user_session"].nunique()
    sessions_purchase   = df.loc[df["event_type"] == "purchase", "user_session"].nunique()
    return [
        {"stage": "Sessions",        "value": int(sessions_all)},
        {"stage": "Viewed Product",  "value": int(sessions_view)},
        {"stage": "Added to Cart",   "value": int(sessions_cart)},
        {"stage": "Purchased",       "value": int(sessions_purchase)},
    ]


# Note: REES46's `category_code` field is >98% null for this dataset (verified),
# so a "revenue by category" chart from it would be misleading — not used.
# `brand` is populated for ~57% of purchases (~59% of revenue), which is
# usable as long as that coverage is disclosed alongside the chart.

def build_brands(df: pd.DataFrame, top_n: int = 10) -> list[dict]:
    purchases = df[df["event_type"] == "purchase"]
    known = purchases[purchases["brand"].notna()]
    grouped = known.groupby("brand", observed=True).agg(
        revenue=("price", "sum"),
        orders=("price", "count"),
    ).reset_index().sort_values("revenue", ascending=False).head(top_n)
    return [
        {"brand": row["brand"], "revenue": round(row["revenue"]), "orders": int(row["orders"])}
        for _, row in grouped.iterrows()
    ]


def build_funnel_summary(df: pd.DataFrame) -> dict:
    funnel = build_funnel(df)
    sessions, views, carts, purchases = (s["value"] for s in funnel)
    purchases_df = df[df["event_type"] == "purchase"]
    known_brand_revenue = purchases_df.loc[purchases_df["brand"].notna(), "price"].sum()
    total_revenue = purchases_df["price"].sum()
    return {
        "sourceMonth": "December 2019",
        "totalEvents": int(len(df)),
        "totalSessions": sessions,
        "viewToCartRate": round(100 * carts / views, 1) if views else None,
        "cartToPurchaseRate": round(100 * purchases / carts, 1) if carts else None,
        "overallConversionRate": round(100 * purchases / sessions, 2),
        "cosmeticsRevenue": round(total_revenue),
        "cosmeticsOrders": int(len(purchases_df)),
        "brandKnownSharePct": round(100 * known_brand_revenue / total_revenue, 1),
    }


# ── 3. Run pipeline ──────────────────────────────────────────────────────────

def write_json(name: str, data) -> None:
    path = os.path.join(DATA, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    log(f"  wrote {name}")


def main() -> None:
    retail_raw = load_online_retail()
    retail = clean_retail(retail_raw)

    log("Aggregating Online Retail II ...")
    monthly    = build_monthly(retail)
    categories = build_categories(retail)
    countries  = build_countries(retail)
    retail_summary = build_retail_summary(retail)

    write_json("ecommerce-monthly.json", monthly)
    write_json("ecommerce-categories.json", categories)
    write_json("ecommerce-countries.json", countries)

    cosmetics = load_cosmetics_events()
    log("Aggregating REES46 cosmetics events ...")
    funnel = build_funnel(cosmetics)
    brands = build_brands(cosmetics)
    funnel_summary = build_funnel_summary(cosmetics)

    write_json("ecommerce-funnel.json", funnel)
    write_json("ecommerce-brands.json", brands)

    summary = {**retail_summary, **funnel_summary}
    write_json("ecommerce-summary.json", summary)

    log("Done.")


if __name__ == "__main__":
    main()
