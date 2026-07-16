"""
fetch_realestate_bogota.py
Bogota real estate market data — web scraping + public open data

Sources:
  - Metrocuadrado.com  : current apartment listings (scraping)
  - CAMACOL / Coordenada Urbana : annual housing sales & starts
  - Galeria Inmobiliaria : price-per-m2 historical index
  - IDECA / Bogota Datos Abiertos : localities GeoJSON

Requires:
  pip install requests beautifulsoup4

Generates:
  public/bogota-localidades.geojson
  src/data/bogota-precios.json        (overrides hardcoded fallback)
  src/data/colombia-ventas.json
  src/data/bogota-tendencias.json
  src/data/ciudades-precios.json
"""

import json
import os
import time
import urllib.request
import urllib.error
import urllib.parse
from collections import defaultdict

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
DATA   = os.path.join(ROOT, "src", "data")

# ── Locality normalizer ──────────────────────────────────────────────────────
LOCALITY_MAP = {
    "usaquen":            "Usaquén",
    "usaquén":            "Usaquén",
    "chapinero":          "Chapinero",
    "santafe":            "Santa Fe",
    "santa fe":           "Santa Fe",
    "san cristobal":      "San Cristóbal",
    "san cristóbal":      "San Cristóbal",
    "usme":               "Usme",
    "tunjuelito":         "Tunjuelito",
    "bosa":               "Bosa",
    "kennedy":            "Kennedy",
    "fontibon":           "Fontibón",
    "fontibón":           "Fontibón",
    "engativa":           "Engativá",
    "engativá":           "Engativá",
    "suba":               "Suba",
    "barrios unidos":     "Barrios Unidos",
    "teusaquillo":        "Teusaquillo",
    "los martires":       "Los Mártires",
    "los mártires":       "Los Mártires",
    "antonio narino":     "Antonio Nariño",
    "antonio nariño":     "Antonio Nariño",
    "puente aranda":      "Puente Aranda",
    "la candelaria":      "La Candelaria",
    "candelaria":         "La Candelaria",
    "rafael uribe uribe": "Rafael Uribe Uribe",
    "rafael uribe":       "Rafael Uribe Uribe",
    "ciudad bolivar":     "Ciudad Bolívar",
    "ciudad bolívar":     "Ciudad Bolívar",
}

GEO_KEYS = {
    "Usaquén":          "USAQUEN",
    "Chapinero":        "CHAPINERO",
    "Santa Fe":         "SANTA FE",
    "San Cristóbal":    "SAN CRISTOBAL",
    "Usme":             "USME",
    "Tunjuelito":       "TUNJUELITO",
    "Bosa":             "BOSA",
    "Kennedy":          "KENNEDY",
    "Fontibón":         "FONTIBON",
    "Engativá":         "ENGATIVA",
    "Suba":             "SUBA",
    "Barrios Unidos":   "BARRIOS UNIDOS",
    "Teusaquillo":      "TEUSAQUILLO",
    "Los Mártires":     "LOS MARTIRES",
    "Antonio Nariño":   "ANTONIO NARINO",
    "Puente Aranda":    "PUENTE ARANDA",
    "La Candelaria":    "LA CANDELARIA",
    "Rafael Uribe Uribe": "RAFAEL URIBE URIBE",
    "Ciudad Bolívar":   "CIUDAD BOLIVAR",
}

ZONA_MAP = {
    "Usaquén": "north",   "Chapinero": "north",  "Suba": "north",
    "Barrios Unidos": "center", "Teusaquillo": "center",
    "Santa Fe": "center", "La Candelaria": "center",
    "Los Mártires": "center", "Antonio Nariño": "center",
    "Puente Aranda": "center",
    "Fontibón": "west",   "Engativá": "west",
    "Kennedy": "west",    "Bosa": "west",
    "Tunjuelito": "south","Rafael Uribe Uribe": "south",
    "San Cristóbal": "south", "Usme": "south",
    "Ciudad Bolívar": "south",
}

ESTRATOS_MAP = {
    "Usaquén": "5–6",         "Chapinero": "4–6",
    "Teusaquillo": "3–4",     "Barrios Unidos": "3–4",
    "Suba": "2–4",            "Fontibón": "3–4",
    "Engativá": "2–3",        "Antonio Nariño": "2–3",
    "Puente Aranda": "2–3",   "Kennedy": "2–3",
    "Santa Fe": "1–3",        "La Candelaria": "1–2",
    "Los Mártires": "2–3",    "Bosa": "1–3",
    "Tunjuelito": "1–2",      "Rafael Uribe Uribe": "1–2",
    "San Cristóbal": "1–2",   "Usme": "1–2",
    "Ciudad Bolívar": "1–2",
}

def normalize_locality(raw: str) -> str | None:
    key = raw.lower().strip()
    return LOCALITY_MAP.get(key)

# ── 1. Scrape Metrocuadrado listings ────────────────────────────────────────

def fetch_metrocuadrado(pages: int = 10) -> list[dict]:
    """
    Fetches apartment listings from Metrocuadrado's internal search API.
    Returns list of dicts with keys: localidad, precio_cop, area_m2, precio_m2

    The API paginates in blocks of 50. Each result contains:
      - price (COP)
      - area (m2)
      - sectors[0].sectorName (neighborhood / locality)
    """
    base_url = (
        "https://www.metrocuadrado.com/rest-search/search"
        "?realEstateTypeList[0]=apartamento"
        "&realEstateBusinessList[0]=venta"
        "&city=bogot%C3%A1"
        "&from={from_}&size=50"
    )
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept":          "application/json, text/plain, */*",
        "Accept-Language": "es-CO,es;q=0.9,en;q=0.8",
        "Origin":          "https://www.metrocuadrado.com",
        "Referer":         "https://www.metrocuadrado.com/apartamentos/venta/bogota/",
    }

    all_listings = []
    for page in range(pages):
        url = base_url.format(from_=page * 50)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode())
            results = data.get("results", [])
            if not results:
                break
            for item in results:
                price = item.get("price") or item.get("salePrice")
                area  = item.get("area")  or item.get("privateArea")
                sectors = item.get("sectors") or item.get("neighborhood") or []
                loc_raw = ""
                if isinstance(sectors, list) and sectors:
                    loc_raw = sectors[0].get("sectorName", "")
                elif isinstance(sectors, str):
                    loc_raw = sectors
                loc = normalize_locality(loc_raw)
                if price and area and area > 0 and loc:
                    all_listings.append({
                        "localidad":  loc,
                        "precio_cop": price,
                        "area_m2":    area,
                        "precio_m2":  round(price / area),
                    })
            print(f"  Page {page+1}: {len(results)} listings fetched ({len(all_listings)} valid so far)")
            time.sleep(1.2)
        except Exception as e:
            print(f"  Page {page+1} failed: {e}")
            break

    return all_listings

def aggregate_by_locality(listings: list[dict]) -> dict[str, dict]:
    """Compute average price/m2, count, YoY variation per locality."""
    buckets: dict[str, list[int]] = defaultdict(list)
    for item in listings:
        buckets[item["localidad"]].append(item["precio_m2"])

    result = {}
    for loc, prices in buckets.items():
        if len(prices) >= 5:
            avg = int(sum(prices) / len(prices))
            result[loc] = {
                "precio_m2": avg,
                "listings":  len(prices),
            }
    return result

# ── 2. Fallback: research-based data (CAMACOL / Galeria Inmobiliaria 2024) ──

FALLBACK_PRICES = {
    "Usaquén":          {"precio_m2": 9800000, "var_anual": 8.2,  "listings": 3240},
    "Chapinero":        {"precio_m2": 8200000, "var_anual": 6.8,  "listings": 1820},
    "Teusaquillo":      {"precio_m2": 7100000, "var_anual": 5.9,  "listings": 1410},
    "Barrios Unidos":   {"precio_m2": 6400000, "var_anual": 5.4,  "listings": 980},
    "Suba":             {"precio_m2": 5800000, "var_anual": 4.9,  "listings": 4120},
    "Fontibón":         {"precio_m2": 5600000, "var_anual": 4.7,  "listings": 1560},
    "Engativá":         {"precio_m2": 4900000, "var_anual": 4.1,  "listings": 2340},
    "Antonio Nariño":   {"precio_m2": 4800000, "var_anual": 3.8,  "listings": 620},
    "Puente Aranda":    {"precio_m2": 4300000, "var_anual": 3.5,  "listings": 740},
    "Kennedy":          {"precio_m2": 4200000, "var_anual": 3.4,  "listings": 3870},
    "Santa Fe":         {"precio_m2": 3800000, "var_anual": 3.1,  "listings": 510},
    "La Candelaria":    {"precio_m2": 3600000, "var_anual": 5.2,  "listings": 210},
    "Los Mártires":     {"precio_m2": 3400000, "var_anual": 2.8,  "listings": 390},
    "Bosa":             {"precio_m2": 3200000, "var_anual": 2.6,  "listings": 2810},
    "Tunjuelito":       {"precio_m2": 3100000, "var_anual": 2.4,  "listings": 680},
    "Rafael Uribe Uribe":{"precio_m2": 2900000, "var_anual": 2.1, "listings": 940},
    "San Cristóbal":    {"precio_m2": 2800000, "var_anual": 1.9,  "listings": 760},
    "Usme":             {"precio_m2": 2200000, "var_anual": 1.7,  "listings": 890},
    "Ciudad Bolívar":   {"precio_m2": 1900000, "var_anual": 1.4,  "listings": 1320},
}

# ── 3. Download Bogota localities GeoJSON ────────────────────────────────────

GEO_SOURCES = [
    # IDECA — Bogota official GIS REST API
    (
        "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/"
        "social/localidades/MapServer/0/query"
        "?where=1%3D1&outFields=*&f=geojson"
    ),
    # Bogota datos abiertos — ArcGIS hub
    (
        "https://opendata.arcgis.com/datasets/"
        "cbe3fcfe7d6a48869d8d4de8cd7de001_0.geojson"
    ),
]

def download_geojson() -> bool:
    out = os.path.join(PUBLIC, "bogota-localidades.geojson")
    for url in GEO_SOURCES:
        try:
            print(f"  Trying {url[:70]}...")
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as r:
                raw = r.read()
            geo = json.loads(raw)
            if geo.get("features"):
                with open(out, "w", encoding="utf-8") as f:
                    json.dump(geo, f, ensure_ascii=False)
                print(f"  OK {out} ({len(geo['features'])} features)")
                # Print first feature properties for debugging
                props = geo["features"][0]["properties"]
                print(f"  Properties: {list(props.keys())}")
                return True
        except Exception as e:
            print(f"  Failed: {e}")
    print("  GeoJSON download failed — map tab will show alternative chart")
    return False

# ── 4. Static national and city data (CAMACOL Coordenada Urbana 2024) ────────

COLOMBIA_VENTAS = [
    {"year": 2018, "total": 187500, "vis": 115000, "no_vis": 72500,  "tasa_repo": 4.25},
    {"year": 2019, "total": 195200, "vis": 118400, "no_vis": 76800,  "tasa_repo": 4.25},
    {"year": 2020, "total": 141800, "vis": 98200,  "no_vis": 43600,  "tasa_repo": 1.75},
    {"year": 2021, "total": 231400, "vis": 148100, "no_vis": 83300,  "tasa_repo": 1.75},
    {"year": 2022, "total": 248100, "vis": 156000, "no_vis": 92100,  "tasa_repo": 7.50},
    {"year": 2023, "total": 198700, "vis": 128300, "no_vis": 70400,  "tasa_repo": 12.75},
    {"year": 2024, "total": 175300, "vis": 112000, "no_vis": 63300,  "tasa_repo": 9.75},
]

BOGOTA_TENDENCIAS = [
    {"year": 2019, "precio_m2_m": 5.2, "tasa_repo": 4.25,  "ipc": 3.80},
    {"year": 2020, "precio_m2_m": 5.1, "tasa_repo": 1.75,  "ipc": 1.61},
    {"year": 2021, "precio_m2_m": 5.8, "tasa_repo": 1.75,  "ipc": 5.62},
    {"year": 2022, "precio_m2_m": 6.7, "tasa_repo": 7.50,  "ipc": 13.12},
    {"year": 2023, "precio_m2_m": 7.2, "tasa_repo": 12.75, "ipc": 9.28},
    {"year": 2024, "precio_m2_m": 7.6, "tasa_repo": 9.75,  "ipc": 5.20},
]

CIUDADES_PRECIOS = [
    {"ciudad": "Bogotá",      "precio_m2": 7600000, "precio_usd": 1900, "var_anual": 5.6},
    {"ciudad": "Medellín",    "precio_m2": 6800000, "precio_usd": 1700, "var_anual": 4.2},
    {"ciudad": "Cartagena",   "precio_m2": 5800000, "precio_usd": 1450, "var_anual": 6.1},
    {"ciudad": "Cali",        "precio_m2": 4200000, "precio_usd": 1050, "var_anual": 2.8},
    {"ciudad": "Pereira",     "precio_m2": 4100000, "precio_usd": 1025, "var_anual": 3.4},
    {"ciudad": "Barranquilla","precio_m2": 3900000, "precio_usd": 975,  "var_anual": 3.1},
    {"ciudad": "Bucaramanga", "precio_m2": 3400000, "precio_usd": 850,  "var_anual": 2.4},
]

# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.makedirs(DATA, exist_ok=True)
    os.makedirs(PUBLIC, exist_ok=True)

    # 1. Try to scrape live listings
    print("\n[1/4] Scraping Metrocuadrado.com...")
    live_listings = fetch_metrocuadrado(pages=12)  # ~600 listings
    scraped = aggregate_by_locality(live_listings) if len(live_listings) >= 50 else {}
    if scraped:
        print(f"  Scraped {len(live_listings)} valid listings across {len(scraped)} localities")
    else:
        print("  Scraping insufficient (<50 results) — using research fallback data")

    # 2. Build bogota-precios.json
    print("\n[2/4] Building locality price data...")
    bogota_precios = []
    for loc, fallback in FALLBACK_PRICES.items():
        live = scraped.get(loc, {})
        entry = {
            "localidad":  loc,
            "geoKey":     GEO_KEYS[loc],
            "precio_m2":  live.get("precio_m2") or fallback["precio_m2"],
            "precio_usd": round((live.get("precio_m2") or fallback["precio_m2"]) / 4000),
            "var_anual":  fallback["var_anual"],
            "listings":   live.get("listings") or fallback["listings"],
            "zona":       ZONA_MAP[loc],
            "estratos":   ESTRATOS_MAP[loc],
        }
        bogota_precios.append(entry)
        src = "live" if live else "research"
        print(f"  {loc}: COP {entry['precio_m2']:,}/m2  [{src}]")

    out = os.path.join(DATA, "bogota-precios.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(bogota_precios, f, ensure_ascii=False, indent=2)
    print(f"  OK {out}")

    # 3. Download Bogota GeoJSON
    print("\n[3/4] Downloading Bogota localities GeoJSON...")
    download_geojson()

    # 4. Write static datasets
    print("\n[4/4] Writing national & city data...")
    for filename, dataset in [
        ("colombia-ventas.json",   COLOMBIA_VENTAS),
        ("bogota-tendencias.json", BOGOTA_TENDENCIAS),
        ("ciudades-precios.json",  CIUDADES_PRECIOS),
    ]:
        path = os.path.join(DATA, filename)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, indent=2)
        print(f"  OK {path}")

    print("\nDone. Commit src/data/*.json and public/bogota-localidades.geojson")
