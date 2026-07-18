import { Link } from 'react-router-dom';
import { Database, TrendingUp, CheckCircle, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ColombiaMap } from './ColombiaMap';

import inflacionData from '../data/inflacion.json';
import carteraData   from '../data/cartera.json';
import bancarizacionRaw from '../data/bancarizacion.json';

const bancarizacionValues = Object.values(bancarizacionRaw);
const bancarizacionAvg = bancarizacionValues.reduce((s, v) => s + v, 0) / bancarizacionValues.length;
const bancarizacionMax = Math.max(...bancarizacionValues);
const bancarizacionMin = Math.min(...bancarizacionValues);
const carteraTotal = carteraData.reduce((s, c) => s + c.cartera, 0);
const carteraColors = ['#db2777', '#ec4899', '#f472b6', '#fbb6ce'];

export function CaseStudy() {
  const { t, theme, language } = useApp();
  const es = language === 'es';

  const chartColors = {
    text: theme === 'dark' ? '#d1d5db' : '#6b7280',
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
  };

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
  };

  return (
    <section
      className="py-24 px-6 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/20 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900"
      id="case-study"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Navigation ─────────────────────────── */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('case.back')}
          </button>
          <Link
            to="/colombia"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            {es ? 'Ver Análisis Completo' : 'View Full Analysis'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Section header ─────────────────────── */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('case.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full mb-6" />
          <h3 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
            {t('case.subtitle')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            {es
              ? 'Construido 100% sobre datos públicos reales: Banca de Oportunidades, DANE y Banco de la República — incluye un mapa interactivo por departamento.'
              : 'Built 100% on real public data: Banca de Oportunidades, DANE and Banco de la República — includes an interactive map by department.'}
          </p>
        </div>

        {/* ── Dashboard preview ──────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100 dark:border-gray-800">

          {/* Map — shown first, it's the most compelling real visual */}
          <div className="mb-10">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {es ? 'Inclusión Financiera por Departamento (real)' : 'Financial Inclusion by Department (real)'}
            </h4>
            <ColombiaMap mapWidth={420} mapHeight={480} legendMaxHeight={440} />
          </div>

          {/* KPI cards — gradient colored, real numbers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{es ? 'Bancarización Nacional Promedio' : 'National Avg. Bancarization'}</div>
              <div className="text-3xl font-bold">{bancarizacionAvg.toFixed(1)}%</div>
              <div className="text-sm mt-2 opacity-90">
                {es ? '33 departamentos' : '33 departments'}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{es ? 'Brecha Departamental' : 'Departmental Gap'}</div>
              <div className="text-3xl font-bold">{(bancarizacionMax / bancarizacionMin).toFixed(1)}×</div>
              <div className="text-sm mt-2 opacity-90">
                Bogotá {bancarizacionMax}% {es ? 'vs' : 'vs'} Guainía {bancarizacionMin}%
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-500 to-purple-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{es ? 'Pico de Inflación 2022' : '2022 Inflation Peak'}</div>
              <div className="text-3xl font-bold">13.12%</div>
              <div className="text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{es ? 'vs meta de 3%' : 'vs 3% target'}</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{es ? 'Cartera de Crédito Total' : 'Total Credit Portfolio'}</div>
              <div className="text-3xl font-bold">${carteraTotal.toFixed(0)}B</div>
              <div className="text-sm mt-2 opacity-90">
                {es ? 'billones COP · dic 2023' : 'COP trillions · Dec 2023'}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {es ? 'Inflación Anual Colombia (real)' : 'Colombia Annual Inflation (real)'}
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={inflacionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="year" stroke={chartColors.text} tick={{ fontSize: 11 }} />
                  <YAxis stroke={chartColors.text} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="ipc" stroke="#db2777" strokeWidth={3} dot={{ fill: '#db2777', r: 3 }} name={es ? 'IPC Real' : 'Actual CPI'} />
                  <Line type="monotone" dataKey="meta" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name={es ? 'Meta Banco República' : 'Central Bank Target'} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {es ? 'Cartera de Crédito por Modalidad (real)' : 'Credit Portfolio by Type (real)'}
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={carteraData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="modalidad" stroke={chartColors.text} tick={{ fontSize: 11 }} />
                  <YAxis stroke={chartColors.text} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v} billones`, es ? 'Cartera' : 'Portfolio']} />
                  <Bar dataKey="cartera" radius={[6, 6, 0, 0]} name={es ? 'Cartera' : 'Portfolio'}>
                    {carteraData.map((_, i) => <Cell key={i} fill={carteraColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        {/* ── Detail cards ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {es ? 'Fuentes de Datos Reales' : 'Real Data Sources'}
              </h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {es
                ? 'Bancarización por departamento (Banca de Oportunidades, RIF 2023), inflación anual 2015–2024 (DANE / Banco de la República), y cartera de crédito por modalidad (Superfinanciera de Colombia) — todo con fuente pública verificable.'
                : 'Financial inclusion by department (Banca de Oportunidades, RIF 2023), annual inflation 2015–2024 (DANE / Banco de la República), and credit portfolio by type (Superfinanciera de Colombia) — all with verifiable public sources.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {es ? 'Mapa Interactivo' : 'Interactive Map'}
              </h4>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {[
                es ? 'Choropleth por departamento con zoom, leyenda y hover cruzado' : 'Department-level choropleth with zoom, legend and cross-hover',
                es ? 'React + react-simple-maps + d3-geo' : 'React + react-simple-maps + d3-geo',
                es ? 'Bilingüe (ES/EN), modo oscuro' : 'Bilingual (ES/EN), dark mode',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {es ? 'Hallazgos Reales' : 'Real Findings'}
              </h4>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {[
                es ? `Bogotá (${bancarizacionMax}%) vs Guainía (${bancarizacionMin}%) — brecha de ${(bancarizacionMax/bancarizacionMin).toFixed(1)}× en inclusión financiera` : `Bogotá (${bancarizacionMax}%) vs Guainía (${bancarizacionMin}%) — a ${(bancarizacionMax/bancarizacionMin).toFixed(1)}× gap in financial inclusion`,
                es ? '2022 fue el año de inflación más alta en 23 años (13.12%)' : '2022 was the highest inflation year in 23 years (13.12%)',
                es ? `Cartera comercial (${carteraData[0].cartera}B) es la más grande, microcrédito (${carteraData[3].mora}% mora) el más riesgoso` : `Commercial credit (${carteraData[0].cartera}B) is the largest portfolio, microcredit (${carteraData[3].mora}% default) the riskiest`,
              ].map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {es ? 'Profundiza' : 'Go Deeper'}
                </h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {es
                  ? 'Explora el mapa interactivo de bancarización, el histórico completo de inflación y el detalle de cartera de crédito con mora por modalidad.'
                  : 'Explore the interactive bancarization map, the full inflation history, and the credit portfolio breakdown with default rates by type.'}
              </p>
            </div>
            <Link
              to="/colombia"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {es ? 'Ver Análisis Completo' : 'View Full Analysis'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
