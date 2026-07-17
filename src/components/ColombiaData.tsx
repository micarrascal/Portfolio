import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';

import bancarizacionRaw from '../data/bancarizacion.json';
import inflacionData    from '../data/inflacion.json';
import carteraData      from '../data/cartera.json';

const GEO_URL = '/colombia.json';

const BANCARIZACION: Record<string, number> = bancarizacionRaw;

const sortedBancarizacion = Object.entries(BANCARIZACION).sort((a, b) => b[1] - a[1]);

// Nombres de display para el tooltip del mapa
const DISPLAY_NAMES: Record<string, string> = {
  'SANTAFE DE BOGOTA D.C':                                       'Bogotá D.C.',
  'ANTIOQUIA':                                                   'Antioquia',
  'VALLE DEL CAUCA':                                             'Valle del Cauca',
  'ATLANTICO':                                                   'Atlántico',
  'SANTANDER':                                                   'Santander',
  'RISARALDA':                                                   'Risaralda',
  'CALDAS':                                                      'Caldas',
  'QUINDIO':                                                     'Quindío',
  'CUNDINAMARCA':                                                'Cundinamarca',
  'NORTE DE SANTANDER':                                          'Norte de Santander',
  'BOYACA':                                                      'Boyacá',
  'BOLIVAR':                                                     'Bolívar',
  'HUILA':                                                       'Huila',
  'TOLIMA':                                                      'Tolima',
  'META':                                                        'Meta',
  'ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA':    'San Andrés',
  'CESAR':                                                       'Cesar',
  'MAGDALENA':                                                   'Magdalena',
  'NARIÑO':                                                      'Nariño',
  'SUCRE':                                                       'Sucre',
  'CASANARE':                                                    'Casanare',
  'CAUCA':                                                       'Cauca',
  'CORDOBA':                                                     'Córdoba',
  'LA GUAJIRA':                                                  'La Guajira',
  'ARAUCA':                                                      'Arauca',
  'PUTUMAYO':                                                    'Putumayo',
  'CAQUETA':                                                     'Caquetá',
  'CHOCO':                                                       'Chocó',
  'AMAZONAS':                                                    'Amazonas',
  'GUAVIARE':                                                    'Guaviare',
  'VICHADA':                                                     'Vichada',
  'VAUPES':                                                      'Vaupés',
  'GUAINIA':                                                     'Guainía',
};

// Interpolación de color: blanco rosado → rosa oscuro según % bancarización
function pinkScale(value: number): string {
  const min = 24, max = 96;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(252 - t * (252 - 157));
  const g = Math.round(231 - t * (231 - 23));
  const b = Math.round(243 - t * (243 - 77));
  return `rgb(${r},${g},${b})`;
}

type Tab = 'map' | 'inflation' | 'credit';

const TABS: { id: Tab; label: string; labelEs: string }[] = [
  { id: 'map',       label: 'Financial Inclusion Map', labelEs: 'Mapa de Inclusión' },
  { id: 'inflation', label: 'Inflation History',        labelEs: 'Histórico Inflación' },
  { id: 'credit',    label: 'Credit Portfolio',         labelEs: 'Cartera de Crédito' },
];

export function ColombiaData() {
  const { theme, language } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const dark = theme === 'dark';
  const axisColor  = dark ? '#9ca3af' : '#6b7280';
  const gridColor  = dark ? '#374151' : '#e5e7eb';
  const tooltipStyle = {
    backgroundColor: dark ? '#1f2937' : '#ffffff',
    border: `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '10px',
    fontSize: '12px',
    color: dark ? '#f3f4f6' : '#111827',
  };

  const carteraColors = ['#db2777', '#ec4899', '#f472b6', '#fbb6ce'];

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950" id="colombia-data">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────── */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-5">
            {language === 'es' ? 'Datos Abiertos' : 'Open Data'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'es' ? 'Colombia en Datos' : 'Colombia in Data'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'es'
              ? 'Visualizaciones interactivas con datos reales del sistema financiero colombiano.'
              : 'Interactive visualizations built on real Colombian financial system data.'}
          </p>
        </div>

        {/* ── Tabs ───────────────────────────────── */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
              }`}
            >
              {language === 'es' ? tab.labelEs : tab.label}
            </button>
          ))}
        </div>

        {/* ── Content card ───────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-8">

          {/* TAB 1: Mapa bancarización */}
          {activeTab === 'map' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? 'Inclusión financiera por departamento (2023)' : 'Financial inclusion by department (2023)'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'es'
                    ? '% de adultos con al menos un producto financiero. Fuente: Banca de Oportunidades — RIF 2023'
                    : '% of adults with at least one financial product. Source: Banca de Oportunidades — RIF 2023'}
                </p>
              </div>

              {/* Leyenda degradado + hint de zoom */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-400">25%</span>
                <div
                  className="h-3 flex-1 rounded-full max-w-xs"
                  style={{ background: 'linear-gradient(to right, rgb(252,231,243), rgb(157,23,77))' }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">95%</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  {language === 'es'
                    ? 'bancarización · scroll, arrastra o usa los botones para hacer zoom'
                    : 'financial inclusion · scroll, drag or use the buttons to zoom'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
                {/* Map */}
                <div className="relative mx-auto" style={{ maxWidth: 480, width: '100%' }}>
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ center: [-74, 4], scale: 1400 }}
                    width={480}
                    height={560}
                  >
                    <ZoomableGroup
                      center={[-74, 4]}
                      zoom={mapZoom}
                      minZoom={1}
                      maxZoom={8}
                      onMoveEnd={({ zoom }) => setMapZoom(zoom)}
                    >
                      <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                          geographies.map(geo => {
                            const name  = geo.properties.NOMBRE_DPT as string;
                            const value = BANCARIZACION[name] ?? 40;
                            const isHovered = hoveredDept === name;
                            const isDimmed = !!hoveredDept && !isHovered;
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={pinkScale(value)}
                                stroke={isHovered ? (dark ? '#f9a8d4' : '#831843') : (dark ? '#1f2937' : '#ffffff')}
                                strokeWidth={isHovered ? 2 / mapZoom : 0.8 / mapZoom}
                                style={{
                                  default:  { outline: 'none', opacity: isDimmed ? 0.35 : 1, transition: 'opacity 150ms ease' },
                                  hover:    { outline: 'none', opacity: 0.82, cursor: 'pointer' },
                                  pressed:  { outline: 'none' },
                                }}
                                onMouseEnter={(e) => {
                                  setTooltip({
                                    name: DISPLAY_NAMES[name] ?? name,
                                    value,
                                    x: e.clientX,
                                    y: e.clientY,
                                  });
                                  setHoveredDept(name);
                                }}
                                onMouseMove={(e) => {
                                  setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                                }}
                                onMouseLeave={() => {
                                  setTooltip(null);
                                  setHoveredDept(null);
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>

                  {/* Tooltip flotante */}
                  {tooltip && (
                    <div
                      className="fixed z-50 pointer-events-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 shadow-xl text-sm"
                      style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
                    >
                      <p className="font-bold text-gray-900 dark:text-white">{tooltip.name}</p>
                      <p className="text-pink-600 dark:text-pink-400 font-semibold">{tooltip.value}% bancarizado</p>
                    </div>
                  )}

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
                    {language === 'es' ? 'Departamentos · hover para resaltar' : 'Departments · hover to highlight'}
                  </p>
                  <div className="space-y-0.5 max-h-[520px] overflow-y-auto pr-1">
                    {sortedBancarizacion.map(([name, value]) => (
                      <button
                        key={name}
                        type="button"
                        onMouseEnter={() => setHoveredDept(name)}
                        onMouseLeave={() => setHoveredDept(null)}
                        className={`w-full flex items-center justify-between gap-2 text-xs px-2 py-1.5 rounded-lg transition-colors text-left ${
                          hoveredDept === name ? 'bg-pink-50 dark:bg-pink-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: pinkScale(value) }} />
                          <span className="truncate text-gray-700 dark:text-gray-300">{DISPLAY_NAMES[name] ?? name}</span>
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 font-medium flex-shrink-0">{value}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Inflación */}
          {activeTab === 'inflation' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? 'Inflación anual Colombia 2015–2024 (IPC)' : 'Colombia Annual Inflation 2015–2024 (CPI)'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'es'
                    ? 'Variación % anual diciembre. Fuente: DANE / Banco de la República'
                    : 'Annual % change December. Source: DANE / Banco de la República'}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={inflacionData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={44} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                  <Line
                    type="monotone" dataKey="ipc" stroke="#db2777" strokeWidth={3}
                    dot={{ fill: '#db2777', r: 4 }} activeDot={{ r: 6 }}
                    name={language === 'es' ? 'IPC Real' : 'Actual CPI'}
                  />
                  <Line
                    type="monotone" dataKey="meta" stroke="#a855f7" strokeWidth={1.5}
                    strokeDasharray="5 5" dot={false}
                    name={language === 'es' ? 'Meta Banco República (3%)' : 'Central Bank Target (3%)'}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/20">
                <p className="text-sm text-pink-700 dark:text-pink-300 font-semibold">
                  {language === 'es'
                    ? '⚡ 2022 marcó el pico histórico reciente: 13.12%, la inflación más alta en 23 años.'
                    : '⚡ 2022 marked a recent historic peak: 13.12%, the highest inflation in 23 years.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Cartera crédito */}
          {activeTab === 'credit' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? 'Cartera de crédito por modalidad (dic 2023)' : 'Credit portfolio by type (Dec 2023)'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'es'
                    ? 'Saldo en billones COP e índice de mora (%). Fuente: Superfinanciera de Colombia'
                    : 'Balance in COP trillions & default rate (%). Source: Superfinanciera de Colombia'}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cartera total */}
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                    {language === 'es' ? 'Saldo total (billones COP)' : 'Total balance (COP trillions)'}
                  </p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={carteraData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="modalidad" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} width={48} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v} billones`, '']} />
                      <Bar dataKey="cartera" radius={[6, 6, 0, 0]} name={language === 'es' ? 'Cartera' : 'Portfolio'}>
                        {carteraData.map((_, i) => <Cell key={i} fill={carteraColors[i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Índice de mora */}
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                    {language === 'es' ? 'Índice de mora (%)' : 'Default rate (%)'}
                  </p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={carteraData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="modalidad" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={36} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                      <Bar dataKey="mora" radius={[6, 6, 0, 0]} name={language === 'es' ? 'Mora' : 'Default'}>
                        {carteraData.map((_, i) => <Cell key={i} fill={carteraColors[i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPIs summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {carteraData.map((item, i) => (
                  <div key={item.modalidad} className="p-4 rounded-xl bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/20">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.modalidad}</p>
                    <p className="text-xl font-bold" style={{ color: carteraColors[i] }}>${item.cartera}B</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">mora: {item.mora}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Fuentes */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          {language === 'es'
            ? 'Fuentes: Banca de Oportunidades · DANE · Banco de la República · Superfinanciera de Colombia'
            : 'Sources: Banca de Oportunidades · DANE · Banco de la República · Superfinanciera de Colombia'}
        </p>
      </div>
    </section>
  );
}
