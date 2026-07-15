import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import bancosData from '../data/bancos-hipoteca.json';

type Tab = 'tasas' | 'mercado' | 'analisis';

const COLORS_PIE = [
  '#db2777', '#9333ea', '#ec4899', '#a855f7',
  '#f472b6', '#c084fc', '#fbcfe8', '#e9d5ff',
  '#f9a8d4', '#d8b4fe',
];

const sortedByRate = [...bancosData].sort((a, b) => b.tasa_ea - a.tasa_ea);
const sortedByMarket = [...bancosData].sort((a, b) => b.participacion - a.participacion);

const avgRate = (bancosData.reduce((s, b) => s + b.tasa_ea, 0) / bancosData.length).toFixed(2);
const topBank = sortedByMarket[0];
const cheapestBank = sortedByRate[sortedByRate.length - 1];
const mostExpensive = sortedByRate[0];

const CustomTooltipRate = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
      <p className="text-pink-600 dark:text-pink-400">Tasa EA: <span className="font-bold">{payload[0].value}%</span></p>
    </div>
  );
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-bold text-gray-900 dark:text-white mb-1">{d.banco}</p>
      <p className="text-purple-600 dark:text-purple-400">Participacion: <span className="font-bold">{d.participacion}%</span></p>
      <p className="text-gray-500 dark:text-gray-400">Desembolsos: <span className="font-semibold">${d.desembolsos_b}B COP</span></p>
    </div>
  );
};

export default function BancosPage() {
  const [tab, setTab] = useState<Tab>('tasas');

  useSEO(
    'Bancos e Hipotecas Colombia | Isabel Carrascal',
    'Analisis interactivo de tasas de interes hipotecarias y participacion de mercado de los principales bancos colombianos. Datos Superfinanciera 2024.',
    '/bancos'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold mb-4">
              Analisis Financiero
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bancos e{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Hipotecas
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tasas de interes hipotecario y participacion de mercado de los principales establecimientos
              de credito en Colombia. Fuente: Superfinanciera, promedio 2024.
            </p>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Tasa promedio EA', value: `${avgRate}%`, sub: 'vivienda no VIS', gradient: 'from-pink-500 to-rose-500' },
              { label: 'Mayor participacion', value: topBank.banco, sub: `${topBank.participacion}% del mercado`, gradient: 'from-purple-500 to-pink-500' },
              { label: 'Tasa mas baja', value: `${cheapestBank.tasa_ea}%`, sub: cheapestBank.banco, gradient: 'from-rose-500 to-purple-500' },
              { label: 'Tasa mas alta', value: `${mostExpensive.tasa_ea}%`, sub: mostExpensive.banco, gradient: 'from-pink-600 to-purple-600' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className={`w-8 h-1 bg-gradient-to-r ${kpi.gradient} rounded-full mb-3`} />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{kpi.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{kpi.value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            {([
              { id: 'tasas', label: 'Tasas por Banco' },
              { id: 'mercado', label: 'Participacion de Mercado' },
              { id: 'analisis', label: 'Analisis' },
            ] as { id: Tab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Tasas */}
          {tab === 'tasas' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Tasa Efectiva Anual — Credito Hipotecario (No VIS)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                Promedio 2024 · Superfinanciera · ordenado de mayor a menor
              </p>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart
                  data={sortedByRate}
                  layout="vertical"
                  margin={{ top: 0, right: 40, left: 120, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    type="number"
                    domain={[10, 16]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="banco"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    width={118}
                  />
                  <Tooltip content={<CustomTooltipRate />} />
                  <Bar dataKey="tasa_ea" radius={[0, 6, 6, 0]}>
                    {sortedByRate.map((entry, i) => (
                      <Cell
                        key={entry.banco}
                        fill={
                          entry.tipo === 'publico'
                            ? '#9333ea'
                            : `hsl(${330 - i * 8}, 80%, ${55 + i * 2}%)`
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                * Banco Agrario (publico) — tasa subsidiada para vivienda social
              </p>
            </div>
          )}

          {/* Tab: Mercado */}
          {tab === 'mercado' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Participacion de Mercado
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  % cartera hipotecaria total · 2024
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sortedByMarket}
                      dataKey="participacion"
                      nameKey="banco"
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={55}
                    >
                      {sortedByMarket.map((entry, i) => (
                        <Cell key={entry.banco} fill={COLORS_PIE[i % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Desembolsos bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Desembolsos Hipotecarios
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Billones COP · 2024
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={sortedByMarket}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 120, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `$${v}B`}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="banco"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      width={118}
                    />
                    <Tooltip
                      formatter={(v: number) => [`$${v}B COP`, 'Desembolsos']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e9d5ff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="desembolsos_b" radius={[0, 6, 6, 0]}>
                      {sortedByMarket.map((entry, i) => (
                        <Cell key={entry.banco} fill={COLORS_PIE[i % COLORS_PIE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab: Analisis */}
          {tab === 'analisis' && (
            <div className="space-y-6">
              {/* Scatter-style table: rate vs share */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Tasa vs Participacion de Mercado
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  Relacion inversa: los bancos con mayor cuota ofrecen tasas mas competitivas
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-gray-500 dark:text-gray-400 font-semibold">Banco</th>
                        <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-semibold">Tasa EA</th>
                        <th className="text-right py-2 text-gray-500 dark:text-gray-400 font-semibold">Participacion</th>
                        <th className="py-2 pl-4 text-gray-500 dark:text-gray-400 font-semibold">Cuota relativa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedByMarket.map((b) => (
                        <tr key={b.banco} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-pink-50/30 dark:hover:bg-pink-900/10 transition-colors">
                          <td className="py-3 font-medium text-gray-900 dark:text-white">
                            {b.banco}
                            {b.tipo === 'publico' && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">publico</span>
                            )}
                          </td>
                          <td className="py-3 text-right text-pink-600 dark:text-pink-400 font-bold">{b.tasa_ea}%</td>
                          <td className="py-3 text-right text-purple-600 dark:text-purple-400 font-bold">{b.participacion}%</td>
                          <td className="py-3 pl-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                                  style={{ width: `${(b.participacion / topBank.participacion) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Concentracion del mercado',
                    body: 'Bancolombia y Davivienda concentran el 51.9% de la cartera hipotecaria, lo que refleja las economias de escala del sistema financiero colombiano.',
                    gradient: 'from-pink-500 to-rose-500',
                  },
                  {
                    title: 'Relacion tasa–cuota',
                    body: 'Los bancos con mayor participacion ofrecen tasas mas competitivas. Bancolombia (29.8%) cobra 13.5% EA frente a 15.1% EA de Banco Popular (2.8%), una brecha de 160 pb.',
                    gradient: 'from-purple-500 to-pink-500',
                  },
                  {
                    title: 'Rol del sector publico',
                    body: 'Banco Agrario opera con tasa subsidiada (11.2% EA), la mas baja del mercado, dirigida a vivienda social rural. Representa el 2.1% del mercado hipotecario formal.',
                    gradient: 'from-rose-500 to-purple-500',
                  },
                ].map((ins) => (
                  <div key={ins.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className={`w-8 h-1 bg-gradient-to-r ${ins.gradient} rounded-full mb-3`} />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{ins.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{ins.body}</p>
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                Fuente: Superfinanciera — Tasas de Interes y Desembolsos por Modalidad de Credito · Promedio 2024
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
