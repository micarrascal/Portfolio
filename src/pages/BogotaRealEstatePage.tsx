import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Line, Cell, Legend,
  LineChart,
} from 'recharts';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoMercator } from 'd3-geo';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import bogotaPrecios from '../data/bogota-precios.json';
import colombiaVentas from '../data/colombia-ventas.json';
import bogotaTendencias from '../data/bogota-tendencias.json';
import ciudadesPrecios from '../data/ciudades-precios.json';

type Tab = 'localities' | 'national' | 'cities' | 'map';
type Entry = typeof bogotaPrecios[number];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const ZONE_COLOR: Record<string, string> = {
  north:  '#db2777',
  center: '#9333ea',
  west:   '#f59e0b',
  south:  '#64748b',
};

const ZONE_LABEL: Record<string, string> = {
  north: 'North', center: 'Center', west: 'West', south: 'South',
};

const MIN_P = 1_900_000;
const MAX_P = 9_800_000;

const MAP_WIDTH = 800;
const MAP_HEIGHT = 520;

/**
 * react-simple-maps' default geoMercator string projection uses d3-geo's
 * antimeridian preclip, which produces a spurious huge coordinate for some
 * of the concave Bogotá locality rings (verified: the rendered path `d`
 * contains a ~98,000px outlier point, even far from lon ±180°). Building
 * the projection manually and disabling preclip fixes it — our rings are
 * nowhere near the antimeridian, so no real clipping is lost.
 */
function makeBogotaProjection() {
  const projection = geoMercator()
    .center([-74.1, 4.55])
    .scale(22000)
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
  projection.preclip((stream) => stream);
  return projection;
}

function priceColor(v: number) {
  const t = Math.min(1, Math.max(0, (v - MIN_P) / (MAX_P - MIN_P)));
  return `rgb(${Math.round(252+(157-252)*t)},${Math.round(231+(23-231)*t)},${Math.round(243+(77-243)*t)})`;
}

function geoLocName(props: Record<string, unknown>): string {
  const raw = (props.LocNombre ?? props.LOCNOMBRE ?? props.NOMBRE ?? props.LOCALIDAD ?? props.nombre ?? props.localidad ?? '') as string;
  return raw.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function findByGeo(name: string): Entry | undefined {
  return bogotaPrecios.find(d => name === d.geoKey || name.includes(d.geoKey) || d.geoKey.includes(name));
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

const sortedByPrice = [...bogotaPrecios].sort((a, b) => b.precio_m2 - a.precio_m2);
const avgPrice = Math.round(bogotaPrecios.reduce((s, d) => s + d.precio_m2, 0) / bogotaPrecios.length);
const latestYear = colombiaVentas[colombiaVentas.length - 1];
const peakYear   = colombiaVentas.reduce((a, b) => a.total > b.total ? a : b);
const totalListings = bogotaPrecios.reduce((s, d) => s + d.listings, 0);
const minListingsEntry = bogotaPrecios.reduce((a, b) => a.listings < b.listings ? a : b);
const maxListingsEntry = bogotaPrecios.reduce((a, b) => a.listings > b.listings ? a : b);

const KEY_FINDINGS = [
  {
    n: '01',
    title: 'The North–South Price Divide',
    body: `Usaquén (COP ${(sortedByPrice[0].precio_m2/1e6).toFixed(1)}M/m²) is ${(sortedByPrice[0].precio_m2 / sortedByPrice[sortedByPrice.length-1].precio_m2).toFixed(1)}× more expensive than Ciudad Bolívar (COP ${(sortedByPrice[sortedByPrice.length-1].precio_m2/1e6).toFixed(1)}M/m²). This gap directly mirrors Bogotá's socioeconomic stratification system and reflects decades of unequal urban investment.`,
    g: 'from-pink-500 to-rose-500',
  },
  {
    n: '02',
    title: 'Rate Shock Crushed Demand',
    body: `The Banco de la República hiked its repo rate from 1.75% (2021) to 13% (2023) to fight 13.1% CPI. The result: national unit sales fell 29% — from ${fmt(peakYear.total)} in ${peakYear.year} to ${fmt(latestYear.total)} in 2024. VIS (affordable) housing fell less, showing that lower-income demand is more structural.`,
    g: 'from-purple-500 to-pink-500',
  },
  {
    n: '03',
    title: 'Prices Defied the Slowdown',
    body: `Despite cratering sales volume, Bogotá's average price per m² rose 49% from COP 5.1M (2020) to COP 7.6M (2024). The driver: construction cost inflation (steel, cement, labor) was passed through to buyers, and supply remained constrained by slow permitting.`,
    g: 'from-rose-500 to-purple-500',
  },
  {
    n: '04',
    title: 'Bogotá Commands a Capital Premium',
    body: `At COP 7.6M/m², Bogotá is 11.8% above Medellín, 81% above Cali, and 124% above Bucaramanga. Cartagena's 6.1% YoY growth is the fastest nationally — driven by international second-home buyers and a tourism real estate boom.`,
    g: 'from-pink-600 to-purple-600',
  },
];

const TABS: { id: Tab; label: string }[] = [
  { id: 'map',        label: 'Map' },
  { id: 'localities', label: 'By Locality' },
  { id: 'national',   label: 'National Market' },
  { id: 'cities',     label: 'City Comparison' },
];

const DATA_SOURCES = [
  {
    name: 'Metrocuadrado',
    role: 'Live apartment listings (web scraping)',
    desc: "Python scraper queries Metrocuadrado's internal search API for apartments for sale in Bogotá — price, area and locality per listing.",
    url: 'https://www.metrocuadrado.com/apartamentos/venta/bogota/',
    g: 'from-pink-500 to-rose-500',
  },
  {
    name: 'CAMACOL — Coordenada Urbana',
    role: 'National housing sales (VIS / No-VIS)',
    desc: 'Annual units sold and housing starts for Colombia, 2018–2024.',
    url: 'https://coordenadaurbana.camacol.co/',
    g: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Galería Inmobiliaria',
    role: 'Price-per-m² index (research fallback)',
    desc: "Published 2024 price index used to fill locality coverage when live scraping is blocked or incomplete.",
    url: 'https://www.galeriainmobiliaria.com.co/',
    g: 'from-rose-500 to-purple-500',
  },
  {
    name: 'DANE',
    role: 'National statistics (CPI / inflation)',
    desc: 'Consumer price index used to contextualize real price growth vs. inflation.',
    url: 'https://www.dane.gov.co/',
    g: 'from-pink-600 to-purple-600',
  },
  {
    name: 'Banco de la República',
    role: 'Monetary policy (repo rate)',
    desc: 'Historical repo interest rate, used to explain the 2022–2023 demand shock.',
    url: 'https://www.banrep.gov.co/',
    g: 'from-purple-600 to-pink-600',
  },
  {
    name: 'IDECA / Catastro Bogotá',
    role: 'Locality boundaries (GeoJSON)',
    desc: "Official polygons for Bogotá's 20 localities, pulled from Catastro's ArcGIS REST service for the choropleth map.",
    url: 'https://www.ideca.gov.co/',
    g: 'from-rose-500 to-pink-500',
  },
];

const PROCESSING_STEPS = [
  {
    title: 'Scrape listings',
    body: "A Python script (requests) pages through Metrocuadrado's search API in blocks of 50, extracting price, area, and locality for each apartment listed for sale.",
  },
  {
    title: 'Fallback on block',
    body: 'If scraping is blocked or returns too few results (e.g. 401 Unauthorized), the script substitutes a research-based dataset from Galería Inmobiliaria\'s 2024 index — guaranteeing full 20-locality coverage either way.',
  },
  {
    title: 'Normalize & aggregate',
    body: 'Locality names are lowercased, accent-stripped and mapped to a canonical geoKey; prices are averaged per locality. National and city series are compiled directly from CAMACOL, DANE and Banco de la República figures.',
  },
  {
    title: 'Join to geometry',
    body: "Bogotá's official locality boundaries are downloaded as GeoJSON from Catastro's ArcGIS service and matched to price records by locality name to drive the choropleth map.",
  },
  {
    title: 'Ship as static JSON',
    body: 'All outputs are written to src/data/ and public/ as static JSON — the dashboard below renders entirely client-side with Recharts and react-simple-maps, no backend required.',
  },
];

/* ── Custom tooltip for bar charts ───────────────────────────────────────── */

function LocalityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = bogotaPrecios.find(e => e.localidad === label);
  return (
    <div className="bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-3 shadow-xl text-sm max-w-xs">
      <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
      <p style={{ color: ZONE_COLOR[d?.zona ?? 'north'] }} className="font-semibold">
        COP {fmt(payload[0].value)}/m²
      </p>
      {d && (
        <>
          <p className="text-gray-500 dark:text-gray-400">${fmt(d.precio_usd)} USD/m²</p>
          <p className="text-gray-500 dark:text-gray-400">YoY +{d.var_anual}%  ·  {fmt(d.listings)} listings</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Zone: {ZONE_LABEL[d.zona]}  ·  Estrato {d.estratos}</p>
        </>
      )}
    </div>
  );
}

function CityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = ciudadesPrecios.find(e => e.ciudad === label);
  return (
    <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
      <p className="text-purple-600 dark:text-purple-400 font-bold">COP {fmt(payload[0].value)}/m²</p>
      {d && (
        <>
          <p className="text-gray-500 dark:text-gray-400">${fmt(d.precio_usd)} USD/m²</p>
          <p className="text-gray-500 dark:text-gray-400">YoY +{d.var_anual}%</p>
        </>
      )}
    </div>
  );
}

/* ── Map tooltip ─────────────────────────────────────────────────────────── */

interface MapTip { visible: boolean; x: number; y: number; entry?: Entry; name?: string }

/* ── Component ───────────────────────────────────────────────────────────── */

export default function BogotaRealEstatePage() {
  const [tab, setTab] = useState<Tab>('map');
  const [mapTip, setMapTip] = useState<MapTip>({ visible: false, x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [openFindings, setOpenFindings] = useState<Set<string>>(new Set());

  const toggleFinding = (n: string) => setOpenFindings(prev => {
    const next = new Set(prev);
    if (next.has(n)) next.delete(n); else next.add(n);
    return next;
  });
  const bogotaProjection = useMemo(makeBogotaProjection, []);

  useSEO(
    'Bogotá Real Estate Analysis | Isabel Carrascal',
    'Interactive analysis of apartment prices per m² by locality in Bogotá, Colombia national housing market trends, and city-level comparisons. Built with Recharts and react-simple-maps.',
    '/real-estate'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold mb-4">
              Real Estate · Web Scraping · Python
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bogotá{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Real Estate
              </span>{' '}
              Market
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6" />
          </div>

          {/* ── About / Context ───────────────────────────────────────── */}
          <section className="mb-14 max-w-3xl mx-auto text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400 mb-3">About This Project</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              This dashboard analyzes apartment prices across Bogotá's 20 localities, tracks Colombia's national
              housing sales cycle, and benchmarks Bogotá against other major Colombian cities. The goal is to
              surface how urban stratification, interest-rate policy, and construction-cost inflation shape the
              housing market — combining live web scraping with public economic data.
            </p>
          </section>

          {/* ── Data Sources ──────────────────────────────────────────── */}
          <section className="mb-14">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data Sources</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATA_SOURCES.map(s => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800 hover:shadow-xl transition-all"
                >
                  <div className={`w-8 h-1 bg-gradient-to-r ${s.g} rounded-full mb-3`} />
                  <p className="font-bold text-gray-900 dark:text-white mb-1">{s.name}</p>
                  <p className="text-xs text-pink-600 dark:text-pink-400 font-medium mb-2">{s.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </a>
              ))}
            </div>

            {/* Methodology / precision disclaimer */}
            <div className="mt-6 max-w-3xl mx-auto bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 flex gap-3">
              <span className="text-amber-500 text-lg leading-none flex-shrink-0">⚠</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">A note on precision</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  The price per m² shown for each locality is an <strong>average</strong>, not an exact appraisal —
                  built from Galería Inmobiliaria's 2024 index (research-based) rather than a live scrape at this
                  snapshot, since Metrocuadrado blocks non-browser requests (see Data Processing, step 2 below).
                  It represents roughly <strong>{fmt(totalListings)} listings</strong> across the 19 localities,
                  ranging from ~{fmt(minListingsEntry.listings)} in {minListingsEntry.localidad} to{' '}
                  ~{fmt(maxListingsEntry.listings)} in {maxListingsEntry.localidad} — smaller localities carry a
                  smaller sample, so their averages are noisier. Actual asking prices for a specific unit can vary
                  meaningfully based on floor, view, amenities, building age, and exact sub-neighborhood. Treat
                  these figures as directional and comparative, not a precise appraisal for any single property.
                </p>
              </div>
            </div>
          </section>

          {/* ── Data Processing ───────────────────────────────────────── */}
          <section className="mb-14">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data Processing</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Hover (or tap) a step to see what happens at that stage of the pipeline.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Timeline track */}
              <div className="relative flex justify-between items-center px-5 mb-3">
                <div className="absolute left-5 right-5 top-1/2 h-1 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div
                  className="absolute left-5 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `calc((100% - 2.5rem) * ${activeStep / (PROCESSING_STEPS.length - 1)})` }}
                />
                {PROCESSING_STEPS.map((step, i) => (
                  <button
                    key={step.title}
                    type="button"
                    onMouseEnter={() => setActiveStep(i)}
                    onFocus={() => setActiveStep(i)}
                    onClick={() => setActiveStep(i)}
                    aria-label={step.title}
                    aria-pressed={i === activeStep}
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-200 ${
                      i === activeStep
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-white dark:border-gray-900 scale-110 shadow-lg shadow-pink-500/30'
                        : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Step labels */}
              <div className="flex justify-between px-1 mb-8">
                {PROCESSING_STEPS.map((step, i) => (
                  <span
                    key={step.title}
                    className={`text-[11px] sm:text-xs font-medium w-16 sm:w-20 text-center leading-tight transition-colors ${
                      i === activeStep ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>

              {/* Description panel */}
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center min-h-[130px] flex flex-col items-center justify-center">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  Step {activeStep + 1} of {PROCESSING_STEPS.length} — {PROCESSING_STEPS[activeStep].title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                  {PROCESSING_STEPS[activeStep].body}
                </p>
              </div>
            </div>
          </section>

          {/* ── Dashboard ──────────────────────────────────────────────── */}
          <section className="mb-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Explore the processed data across four views below.</p>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10 max-w-4xl mx-auto">
              {[
                { label: 'Avg price per m²',  value: `COP ${(avgPrice/1e6).toFixed(1)}M`,  sub: `~$${Math.round(avgPrice/4000).toLocaleString()} USD`,   g: 'from-pink-500 to-rose-500' },
                { label: 'Most expensive',     value: sortedByPrice[0].localidad,            sub: `COP ${(sortedByPrice[0].precio_m2/1e6).toFixed(1)}M/m²`, g: 'from-purple-500 to-pink-500' },
                { label: 'Most affordable',    value: sortedByPrice[sortedByPrice.length-1].localidad, sub: `COP ${(sortedByPrice[sortedByPrice.length-1].precio_m2/1e6).toFixed(1)}M/m²`, g: 'from-rose-500 to-purple-500' },
                { label: 'Units sold 2024',    value: fmt(latestYear.total),                 sub: `↓ from ${fmt(peakYear.total)} peak (${peakYear.year})`, g: 'from-pink-600 to-purple-600' },
              ].map(k => (
                <div key={k.label} className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className={`w-8 h-1 bg-gradient-to-r ${k.g} rounded-full mb-3`} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">{k.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{k.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{k.sub}</p>
                </div>
              ))}
            </div>

          {/* ── Tabs ───────────────────────────────────────────────────── */}
          <div className="flex gap-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit flex-wrap">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Map ───────────────────────────────────────────────── */}
          {tab === 'map' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bogotá — Price per m² by Locality</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choropleth map · GeoJSON from Catastro Bogotá / IDECA · Scroll, drag or use the buttons to zoom · Hover for details
                  </p>
                </div>
                {/* Scale */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>COP 1.9M</span>
                  <div className="w-28 h-3 rounded" style={{ background: 'linear-gradient(to right, rgb(252,231,243), rgb(157,23,77))' }} />
                  <span>COP 9.8M</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
                {/* Map */}
                <div className="relative" style={{ height: 520 }}>
                  {mapTip.visible && mapTip.entry && (
                    <div
                      className="fixed z-50 pointer-events-none bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-700 rounded-xl px-4 py-3 shadow-xl text-sm"
                      style={{ left: mapTip.x + 14, top: mapTip.y - 10 }}
                    >
                      <p className="font-bold text-gray-900 dark:text-white">{mapTip.entry.localidad}</p>
                      <p className="text-pink-600 dark:text-pink-400 font-semibold">
                        COP {fmt(mapTip.entry.precio_m2)}/m²
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">${fmt(mapTip.entry.precio_usd)} USD/m²</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        YoY +{mapTip.entry.var_anual}% · Estrato {mapTip.entry.estratos}
                      </p>
                    </div>
                  )}

                  <ComposableMap
                    projection={bogotaProjection}
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ZoomableGroup
                      center={[-74.1, 4.55]}
                      zoom={mapZoom}
                      minZoom={1}
                      maxZoom={8}
                      onMoveEnd={({ zoom }) => setMapZoom(zoom)}
                    >
                      <Geographies geography="/bogota-localidades.geojson">
                        {({ geographies }) => {
                          if (geographies.length === 0) {
                            return null;
                          }
                          return geographies.map(geo => {
                            const name = geoLocName(geo.properties as Record<string, unknown>);
                            const entry = findByGeo(name);
                            const isHovered = !!entry && hoveredKey === entry.geoKey;
                            const isDimmed = !!hoveredKey && !isHovered;
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={entry ? priceColor(entry.precio_m2) : '#e5e7eb'}
                                stroke={isHovered ? '#1f2937' : '#ffffff'}
                                strokeWidth={isHovered ? 2 / mapZoom : 0.8 / mapZoom}
                                style={{
                                  default: { outline: 'none', opacity: isDimmed ? 0.35 : 1, transition: 'opacity 150ms ease' },
                                  hover:   { outline: 'none', opacity: 0.85 },
                                  pressed: { outline: 'none' },
                                }}
                                onMouseEnter={evt => {
                                  setMapTip({ visible: true, x: evt.clientX, y: evt.clientY, entry, name });
                                  if (entry) setHoveredKey(entry.geoKey);
                                }}
                                onMouseMove={evt => setMapTip(t => ({ ...t, x: evt.clientX, y: evt.clientY }))}
                                onMouseLeave={() => {
                                  setMapTip(t => ({ ...t, visible: false }));
                                  setHoveredKey(null);
                                }}
                              />
                            );
                          });
                        }}
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>

                  {/* Zoom controls */}
                  <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setMapZoom(z => Math.min(8, Number((z + 1).toFixed(2))))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold leading-none"
                      aria-label="Zoom in"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapZoom(z => Math.max(1, Number((z - 1).toFixed(2))))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold leading-none"
                      aria-label="Zoom out"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapZoom(1)}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-[10px] font-semibold leading-none"
                      aria-label="Reset zoom"
                    >
                      RESET
                    </button>
                  </div>
                </div>

                {/* Legend list */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Localities · hover to highlight
                  </p>
                  <div className="space-y-0.5 max-h-[480px] overflow-y-auto pr-1">
                    {sortedByPrice.map(d => (
                      <button
                        key={d.localidad}
                        type="button"
                        onMouseEnter={() => setHoveredKey(d.geoKey)}
                        onMouseLeave={() => setHoveredKey(null)}
                        className={`w-full flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors text-left ${
                          hoveredKey === d.geoKey ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: priceColor(d.precio_m2) }} />
                          <span className="truncate text-gray-700 dark:text-gray-300">{d.localidad}</span>
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">{(d.precio_m2 / 1e6).toFixed(1)}M</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Localities ────────────────────────────────────────── */}
          {tab === 'localities' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Price per m² by Locality</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">19 Bogotá localities · 2024 average · COP</p>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {Object.entries(ZONE_LABEL).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <span className="w-3 h-3 rounded-sm" style={{ background: ZONE_COLOR[k] }} />
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={480}>
                  <BarChart data={sortedByPrice} layout="vertical" margin={{ top: 0, right: 60, left: 130, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={v => `$${(v/1e6).toFixed(1)}M`}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis type="category" dataKey="localidad" tick={{ fontSize: 11, fill: '#6b7280' }} width={128} />
                    <Tooltip content={<LocalityTooltip />} />
                    <Bar dataKey="precio_m2" radius={[0, 6, 6, 0]}>
                      {sortedByPrice.map(e => (
                        <Cell key={e.localidad} fill={ZONE_COLOR[e.zona]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Price gap insight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Price gap (top vs bottom)', value: `${(sortedByPrice[0].precio_m2 / sortedByPrice[sortedByPrice.length-1].precio_m2).toFixed(1)}×`, desc: `${sortedByPrice[0].localidad} vs ${sortedByPrice[sortedByPrice.length-1].localidad}` },
                  { label: 'North zone avg price/m²',   value: `COP ${(bogotaPrecios.filter(d=>d.zona==='north').reduce((s,d)=>s+d.precio_m2,0)/bogotaPrecios.filter(d=>d.zona==='north').length/1e6).toFixed(1)}M`, desc: 'Usaquén, Chapinero, Suba' },
                  { label: 'South zone avg price/m²',   value: `COP ${(bogotaPrecios.filter(d=>d.zona==='south').reduce((s,d)=>s+d.precio_m2,0)/bogotaPrecios.filter(d=>d.zona==='south').length/1e6).toFixed(1)}M`, desc: 'Kennedy → Ciudad Bolívar corridor' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{s.value}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: National Market ───────────────────────────────────── */}
          {tab === 'national' && (
            <div className="space-y-6">
              {/* Sales + rate */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Colombia — Annual Housing Sales</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  Units sold (VIS + No-VIS) vs Banco de la República repo rate · 2018–2024 · Source: CAMACOL
                </p>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={colombiaVentas} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis yAxisId="left" tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9333ea' }} />
                    <Tooltip
                      formatter={(v: number, name: string) =>
                        name === 'tasa_repo' ? [`${v}%`, 'Repo Rate'] :
                        name === 'vis'       ? [fmt(v), 'VIS Units'] :
                                               [fmt(v), 'No-VIS Units']
                      }
                      contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e9d5ff' }}
                    />
                    <Legend formatter={v => v === 'tasa_repo' ? 'Repo Rate' : v === 'vis' ? 'VIS' : 'No-VIS'} />
                    <Bar yAxisId="left" dataKey="vis"    stackId="a" fill="#db2777" radius={[0,0,0,0]} />
                    <Bar yAxisId="left" dataKey="no_vis" stackId="a" fill="#9333ea" radius={[4,4,0,0]} />
                    <Line yAxisId="right" dataKey="tasa_repo" type="monotone" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                  The 2022–2023 rate hike cycle (1.75% → 13%) caused a 29% drop in sales from the 2022 peak
                </p>
              </div>

              {/* Bogota price trend */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Bogotá — Price per m² Trend</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  COP millions/m² vs annual CPI · 2019–2024 · Source: Galería Inmobiliaria / DANE
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={bogotaTendencias} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis yAxisId="left" tickFormatter={v => `$${v}M`} tick={{ fontSize: 11, fill: '#db2777' }} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#9333ea' }} />
                    <Tooltip
                      formatter={(v: number, name: string) =>
                        name === 'precio_m2_m' ? [`COP ${v}M/m²`, 'Price/m²'] :
                        name === 'ipc'         ? [`${v}%`, 'CPI'] :
                                                 [`${v}%`, 'Repo Rate']
                      }
                      contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #fce7f3' }}
                    />
                    <Legend formatter={v => v === 'precio_m2_m' ? 'Price/m² (COP M)' : v === 'ipc' ? 'CPI %' : 'Repo Rate %'} />
                    <Line yAxisId="left"  dataKey="precio_m2_m" type="monotone" stroke="#db2777" strokeWidth={3} dot={{ r: 5, fill: '#db2777' }} />
                    <Line yAxisId="right" dataKey="ipc"          type="monotone" stroke="#9333ea" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                  Despite demand cooling, prices grew +49% from 2020–2024 — driven by inflation pass-through and constrained supply
                </p>
              </div>
            </div>
          )}

          {/* ── Tab: City Comparison ───────────────────────────────────── */}
          {tab === 'cities' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Price per m² — Major Colombian Cities</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                2024 average apartment price · COP · Source: CAMACOL / Coordenada Urbana
              </p>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={ciudadesPrecios}
                  layout="vertical"
                  margin={{ top: 0, right: 80, left: 100, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis type="category" dataKey="ciudad" tick={{ fontSize: 12, fill: '#6b7280' }} width={98} />
                  <Tooltip content={<CityTooltip />} />
                  <Bar dataKey="precio_m2" radius={[0, 6, 6, 0]}>
                    {ciudadesPrecios.map((e, i) => (
                      <Cell key={e.ciudad} fill={i === 0 ? '#db2777' : '#c084fc'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Bogotá premium vs Medellín',     value: `+${(((7600000/6800000)-1)*100).toFixed(1)}%`, desc: 'COP 800k/m² gap · capital effect' },
                  { label: 'Bogotá vs Cali',                  value: `+${(((7600000/4200000)-1)*100).toFixed(1)}%`, desc: 'COP 3.4M/m² difference' },
                  { label: 'Cartagena YoY growth (2024)',     value: '+6.1%',                                        desc: 'Highest appreciation among major cities' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{s.value}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          </section>

          {/* ── Insights (always visible) ──────────────────────────────── */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Key Findings</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Click a finding to expand it.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KEY_FINDINGS.map(ins => {
                const isOpen = openFindings.has(ins.n);
                return (
                  <div key={ins.n} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${ins.g}`} />
                    <button
                      type="button"
                      onClick={() => toggleFinding(ins.n)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-3 px-6 py-5 text-left"
                    >
                      <span className={`text-2xl font-black bg-gradient-to-r ${ins.g} bg-clip-text text-transparent leading-none flex-shrink-0`}>{ins.n}</span>
                      <h3 className="font-bold text-gray-900 dark:text-white flex-1">{ins.title}</h3>
                      <span className={`text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ⌄
                      </span>
                    </button>
                    {isOpen && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-6 pb-6">{ins.body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-10">
            2024 data · Full source list above
          </p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
