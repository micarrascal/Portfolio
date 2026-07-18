import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ColombiaMap } from './ColombiaMap';

import inflacionData    from '../data/inflacion.json';
import carteraData      from '../data/cartera.json';

type Tab = 'map' | 'inflation' | 'credit';

const TABS: { id: Tab; label: string; labelEs: string }[] = [
  { id: 'map',       label: 'Financial Inclusion Map', labelEs: 'Mapa de Inclusión' },
  { id: 'inflation', label: 'Inflation History',        labelEs: 'Histórico Inflación' },
  { id: 'credit',    label: 'Credit Portfolio',         labelEs: 'Cartera de Crédito' },
];

export function ColombiaData() {
  const { theme, language } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('map');

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
              <ColombiaMap />
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
