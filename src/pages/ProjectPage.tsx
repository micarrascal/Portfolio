import { useEffect } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import type { ReactNode } from 'react';

export interface KPI {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}

export interface Insight {
  icon: string;
  text: string;
}

interface ProjectPageProps {
  title: string;
  category: string;
  description: string;
  source: string;
  color: string;
  badgeCls: string;
  headerBg: string;
  kpis: KPI[];
  tools: string[];
  insights: Insight[];
  children: ReactNode;
}

export function ProjectPage({
  title, category, description, source, color, badgeCls, headerBg,
  kpis, tools, insights, children,
}: ProjectPageProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, toggleLanguage } = useApp();

  useSEO(
    `${title} | Isabel Carrascal – BI Developer`,
    description.length > 160 ? description.slice(0, 157) + '…' : description,
    window.location.pathname
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── Nav ────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'es' ? 'Volver al Portfolio' : 'Back to Portfolio'}
          </button>
          <span className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">
            Isabel Carrascal
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={language === 'es' ? toggleLanguage : undefined}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >EN</button>
              <button
                onClick={language === 'en' ? toggleLanguage : undefined}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  language === 'es'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >ES</button>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Header ─────────────────────────────── */}
      <section className={`pt-44 pb-20 px-8 ${headerBg} border-b border-gray-100 dark:border-gray-800`}>
        <div className="max-w-6xl mx-auto">
          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-8 ${badgeCls}`}>
            {category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-8">
            {description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <span>📊</span>
            <span className="font-medium">
              {language === 'es' ? 'Fuente de datos:' : 'Data source:'}
            </span>
            <span>{source}</span>
          </div>
        </div>
      </section>

      {/* ── KPIs ───────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.map((kpi, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Colored left accent bar */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                  style={{ background: color }}
                />
                <div className="pl-3">
                  <div
                    className="text-3xl md:text-4xl font-bold mb-1.5 leading-none"
                    style={{ color }}
                  >
                    {kpi.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 leading-snug">
                    {kpi.label}
                  </div>
                  {kpi.sub && (
                    <div className={`text-xs font-medium ${
                      kpi.positive === false
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {kpi.sub}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charts ─────────────────────────────── */}
      <section className="py-16 px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </section>

      {/* ── Insights ───────────────────────────── */}
      <section className="py-16 px-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'es' ? 'Hallazgos Clave' : 'Key Insights'}
            </h2>
            <div className="w-16 h-1 rounded-full" style={{ background: color }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{insight.icon}</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stack ──────────────────────────────── */}
      <section className="py-10 px-8 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
              {language === 'es' ? 'Stack' : 'Stack'}
            </span>
            {tools.map((tool) => (
              <span
                key={tool}
                className="px-3.5 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back CTA ───────────────────────────── */}
      <section className="py-20 px-8 bg-white dark:bg-gray-900 text-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          {language === 'es' ? '¿Interesado en este análisis?' : 'Interested in this analysis?'}{' '}
          <button
            onClick={() => navigate('/#contact')}
            className="underline text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {language === 'es' ? 'Escríbeme' : 'Reach out'}
          </button>
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'es' ? 'Ver todos los proyectos' : 'View all projects'}
        </button>
      </section>

    </div>
  );
}

/* ─── ChartCard ─────────────────────────────────────────── */
export function ChartCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-8 pt-7 pb-2">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div className="px-4 pb-6">
        {children}
      </div>
    </div>
  );
}

/* ─── Shared recharts tooltip style ─────────────────────── */
export const tt = {
  contentStyle: {
    background: 'rgba(8,8,14,0.92)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '12px',
    padding: '8px 14px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  itemStyle: { color: '#eee', margin: '2px 0' },
  labelStyle: { color: '#aaa', marginBottom: '3px', fontWeight: 600 },
};

/* ─── Shared axis / grid styles ─────────────────────────── */
export const axStyle = { fontSize: 11, fill: '#9ca3af' };
export const gStyle = { strokeDasharray: '3 3', stroke: 'rgba(150,150,150,0.1)' };
