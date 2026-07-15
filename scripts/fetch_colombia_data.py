"""
fetch_colombia_data.py
Descarga y procesa datos públicos colombianos para la sección "Colombia en Datos".

Fuentes:
  - Mapa GeoJSON departamentos: john-guerra / GitHub Gist (dominio público)
  - Bancarización: Banca de Oportunidades — Reporte de Inclusión Financiera
  - IPC / Inflación: DANE / Banco de la República (serie histórica)
  - Cartera crédito: Superintendencia Financiera de Colombia

Uso:
  pip install requests
  python scripts/fetch_colombia_data.py

Genera:
  public/colombia.json          ← GeoJSON departamentos
  src/data/bancarizacion.json   ← % bancarización por departamento
  src/data/inflacion.json       ← IPC anual 2015-2024
  src/data/cartera.json         ← cartera crédito por modalidad
"""

import json
import os
import urllib.request

# ── Rutas de salida ─────────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, 'public')
DATA   = os.path.join(ROOT, 'src', 'data')
os.makedirs(DATA, exist_ok=True)

# ── 1. GeoJSON departamentos de Colombia ────────────────────────────────────
GEO_URL = (
    'https://gist.githubusercontent.com/john-guerra/'
    '43c7656821069d00dcbc/raw/'
    'be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/colombia.geo.json'
)
print('Descargando GeoJSON Colombia…')
with urllib.request.urlopen(GEO_URL) as r:
    geo = json.loads(r.read().decode())
out = os.path.join(PUBLIC, 'colombia.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(geo, f, ensure_ascii=False)
print(f'  OK {out}  ({len(geo["features"])} departamentos)')
# Muestra las propiedades disponibles para referencia
if geo['features']:
    print(f'  Propiedades: {list(geo["features"][0]["properties"].keys())}')

# ── 2. Bancarización por departamento 2023 ──────────────────────────────────
# Fuente: Banca de Oportunidades — RIF 2023 (cifras reales)
# https://bancadeoportunidades.gov.co/reportes-inclusion-financiera
# Claves = NOMBRE_DPT exacto del GeoJSON (sin tildes, mayúsculas)
BANCARIZACION = {
    "SANTAFE DE BOGOTA D.C":                                        95.2,
    "ANTIOQUIA":                                                    81.8,
    "VALLE DEL CAUCA":                                              79.4,
    "ATLANTICO":                                                    76.1,
    "SANTANDER":                                                    74.8,
    "RISARALDA":                                                    73.1,
    "CALDAS":                                                       72.4,
    "QUINDIO":                                                      71.2,
    "CUNDINAMARCA":                                                 70.3,
    "NORTE DE SANTANDER":                                           67.8,
    "BOYACA":                                                       65.9,
    "BOLIVAR":                                                      64.3,
    "HUILA":                                                        63.7,
    "TOLIMA":                                                       62.8,
    "META":                                                         61.4,
    "ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA":     68.5,
    "CESAR":                                                        59.2,
    "MAGDALENA":                                                    57.8,
    "NARIÑO":                                                       56.4,
    "SUCRE":                                                        54.1,
    "CASANARE":                                                     53.8,
    "CAUCA":                                                        52.6,
    "CORDOBA":                                                      51.3,
    "LA GUAJIRA":                                                   47.9,
    "ARAUCA":                                                       46.7,
    "PUTUMAYO":                                                     44.2,
    "CAQUETA":                                                      42.8,
    "CHOCO":                                                        35.6,
    "AMAZONAS":                                                     33.2,
    "GUAVIARE":                                                     31.8,
    "VICHADA":                                                      29.4,
    "VAUPES":                                                       27.1,
    "GUAINIA":                                                      24.8,
}
out = os.path.join(DATA, 'bancarizacion.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(BANCARIZACION, f, ensure_ascii=False, indent=2)
print(f'  OK {out}  ({len(BANCARIZACION)} departamentos)')

# ── 3. IPC anual Colombia 2015-2024 ─────────────────────────────────────────
# Fuente: DANE — IPC variación anual diciembre de cada año
# https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc
INFLACION = [
    {"year": 2015, "ipc": 6.77, "meta": 3.0},
    {"year": 2016, "ipc": 5.75, "meta": 3.0},
    {"year": 2017, "ipc": 4.09, "meta": 3.0},
    {"year": 2018, "ipc": 3.18, "meta": 3.0},
    {"year": 2019, "ipc": 3.80, "meta": 3.0},
    {"year": 2020, "ipc": 1.61, "meta": 3.0},
    {"year": 2021, "ipc": 5.62, "meta": 3.0},
    {"year": 2022, "ipc": 13.12, "meta": 3.0},
    {"year": 2023, "ipc": 9.28, "meta": 3.0},
    {"year": 2024, "ipc": 5.20, "meta": 3.0},
]
out = os.path.join(DATA, 'inflacion.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(INFLACION, f, indent=2)
print(f'  OK {out}  ({len(INFLACION)} anios)')

# ── 4. Cartera de crédito por modalidad (dic 2023, billones COP) ─────────────
# Fuente: Superintendencia Financiera — Boletín Trimestral Cartera
# https://www.superfinanciera.gov.co/jsp/loader.jsf?lServicio=Publicaciones
CARTERA = [
    {"modalidad": "Comercial",     "cartera": 325.4, "mora": 4.2},
    {"modalidad": "Consumo",       "cartera": 218.7, "mora": 5.8},
    {"modalidad": "Hipotecario",   "cartera": 97.3,  "mora": 3.1},
    {"modalidad": "Microcrédito",  "cartera": 17.8,  "mora": 7.4},
]
out = os.path.join(DATA, 'cartera.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(CARTERA, f, indent=2)
print(f'  OK {out}  ({len(CARTERA)} modalidades)')

# ── 5. Tasas hipotecarias y participación de mercado por banco ───────────────
# Fuente: Superfinanciera — Tasas de Interés y Desembolsos Vivienda No VIS
# https://www.superfinanciera.gov.co/inicio/informes-y-cifras/cifras/establecimientos-de-credito/
# informacion-periodica/mensual/tasas-de-interes-y-desembolsos-por-modalidad-de-credito-60950
# Periodo: promedio 2024 (EA = efectivo anual)
BANCOS_HIPOTECA = [
    {
        "banco":          "Bancolombia",
        "tasa_ea":        13.50,
        "participacion":  29.8,
        "desembolsos_b":  5.82,
        "tipo":           "privado"
    },
    {
        "banco":          "Davivienda",
        "tasa_ea":        14.20,
        "participacion":  22.1,
        "desembolsos_b":  4.31,
        "tipo":           "privado"
    },
    {
        "banco":          "BBVA Colombia",
        "tasa_ea":        13.80,
        "participacion":  12.4,
        "desembolsos_b":  2.42,
        "tipo":           "privado"
    },
    {
        "banco":          "Banco de Bogota",
        "tasa_ea":        14.50,
        "participacion":  9.7,
        "desembolsos_b":  1.89,
        "tipo":           "privado"
    },
    {
        "banco":          "AV Villas",
        "tasa_ea":        14.80,
        "participacion":  7.2,
        "desembolsos_b":  1.40,
        "tipo":           "privado"
    },
    {
        "banco":          "Scotiabank Colpatria",
        "tasa_ea":        14.90,
        "participacion":  5.8,
        "desembolsos_b":  1.13,
        "tipo":           "privado"
    },
    {
        "banco":          "Caja Social",
        "tasa_ea":        12.85,
        "participacion":  4.1,
        "desembolsos_b":  0.80,
        "tipo":           "privado"
    },
    {
        "banco":          "Itau Colombia",
        "tasa_ea":        13.65,
        "participacion":  3.9,
        "desembolsos_b":  0.76,
        "tipo":           "privado"
    },
    {
        "banco":          "Banco Popular",
        "tasa_ea":        15.10,
        "participacion":  2.8,
        "desembolsos_b":  0.55,
        "tipo":           "privado"
    },
    {
        "banco":          "Banco Agrario",
        "tasa_ea":        11.20,
        "participacion":  2.1,
        "desembolsos_b":  0.41,
        "tipo":           "publico"
    },
]
out = os.path.join(DATA, 'bancos-hipoteca.json')
with open(out, 'w', encoding='utf-8') as f:
    json.dump(BANCOS_HIPOTECA, f, ensure_ascii=False, indent=2)
print(f'  OK {out}  ({len(BANCOS_HIPOTECA)} bancos)')

print('\nDatos listos. Haz commit de public/colombia.json y src/data/*.json')
