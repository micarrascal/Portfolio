import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#3b82f6';

const tasasData = [
  { year: '2018', vis: 11.2, noVis: 12.8 },
  { year: '2019', vis: 10.8, noVis: 12.2 },
  { year: '2020', vis: 10.5, noVis: 11.9 },
  { year: '2021', vis: 11.1, noVis: 13.1 },
  { year: '2022', vis: 14.8, noVis: 16.5 },
  { year: '2023', vis: 12.5, noVis: 14.2 },
];

const carteraData = [
  { tipo: 'No VIS', valor: 43.7 },
  { tipo: 'VIS', valor: 38.2 },
  { tipo: 'Leasing Hab.', valor: 13.1 },
];

const desembolsosData = [
  { q: 'Q1-22', valor: 4.2 },
  { q: 'Q2-22', valor: 5.1 },
  { q: 'Q3-22', valor: 4.8 },
  { q: 'Q4-22', valor: 3.9 },
  { q: 'Q1-23', valor: 3.1 },
  { q: 'Q2-23', valor: 3.8 },
  { q: 'Q3-23', valor: 4.2 },
  { q: 'Q4-23', valor: 4.5 },
];

const imivData = [
  { year: '2018', imiv: 100, ipc: 100 },
  { year: '2019', imiv: 107, ipc: 103.8 },
  { year: '2020', imiv: 108, ipc: 105.5 },
  { year: '2021', imiv: 121, ipc: 111.4 },
  { year: '2022', imiv: 139, ipc: 125.8 },
  { year: '2023', imiv: 148, ipc: 137.5 },
];

export default function CreditoHipotecarioPage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Crédito Hipotecario en Colombia' : 'Mortgage Credit Analysis — Colombia'}
      category={es ? 'Datos Financieros Colombia' : 'Colombia Financial Data'}
      description={es
        ? 'Análisis del mercado hipotecario colombiano usando datos de la Superintendencia Financiera y el Banco de la República. Rastrea la evolución de tasas de interés VIS vs No-VIS, el índice de precios de vivienda nueva (IMIV), nuevos desembolsos trimestrales y composición de la cartera hipotecaria total de $95 billones COP.'
        : 'Analysis of Colombia\'s mortgage market using Superfinanciera and BanRep data. Tracks VIS vs non-VIS interest rate evolution, the housing price index (IMIV), quarterly new disbursements, and the composition of the $95B COP total mortgage portfolio.'}
      source="Superintendencia Financiera de Colombia · Banco de la República · DANE"
      color={COLOR}
      badgeCls="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
      headerBg="bg-gradient-to-br from-blue-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Cartera Hipotecaria Total' : 'Total Mortgage Portfolio', value: '$95B', sub: es ? 'COP · Dic 2023' : 'COP · Dec 2023', positive: true },
        { label: es ? 'Tasa Promedio 2023' : 'Avg Rate 2023', value: '13.3%', sub: es ? 'Pico: 16.5% (2022 No-VIS)' : 'Peak: 16.5% (2022 Non-VIS)', positive: true },
        { label: es ? 'Morosidad Hipotecaria' : 'Mortgage Delinquency', value: '3.2%', sub: es ? 'IC > 30 días · Dic 2023' : '>30 days · Dec 2023', positive: true },
        { label: es ? 'IMIV Cambio Anual' : 'IMIV Annual Change', value: '+6.5%', sub: es ? 'Vivienda nueva 2023' : 'New housing 2023', positive: true },
      ]}
      tools={['Python', 'Pandas', 'Plotly', 'Superfinanciera API', 'Power BI', 'GeoPandas']}
      insights={[
        { icon: '📈', text: es ? 'Las tasas hipotecarias escalaron 6pp en 2022 por los aumentos del Banco de la República (desde 1.75% hasta 13.25% en tasa de política). Las VIS subieron de 10.5% a 14.8%, afectando severamente el acceso a vivienda para hogares de menor ingreso.' : 'Mortgage rates surged 6pp in 2022 driven by BanRep\'s policy rate hike from 1.75% to 13.25%. VIS rates climbed from 10.5% to 14.8%, severely impacting housing access for lower-income households.' },
        { icon: '🏠', text: es ? 'El IMIV creció 48 puntos entre 2018-2023 (+48%), superando la inflación acumulada (+37.5%). La vivienda nueva se encareció en términos reales, comprimiendo la asequibilidad.' : 'IMIV grew 48 points between 2018-2023 (+48%), outpacing cumulative inflation (+37.5%). New housing became more expensive in real terms, compressing affordability.' },
        { icon: '📉', text: es ? 'Los desembolsos cayeron a $3.1B COP en Q1-2023 (mínimo del periodo analizado), una caída del 39% vs Q2-2022. La recuperación gradual en 2023 H2 coincide con la corrección de tasas.' : 'Disbursements fell to $3.1B COP in Q1-2023 (period low), a 39% drop vs Q2-2022. The gradual 2023 H2 recovery coincides with rate correction.' },
        { icon: '🏛️', text: es ? 'El leasing habitacional (14% de la cartera) es el segmento con menor morosidad. Su estructura de pagos fijos lo hace más resiliente a shocks de tasas.' : 'Leasing habitacional (14% of portfolio) has the lowest delinquency rate. Its fixed payment structure makes it more resilient to rate shocks.' },
        { icon: '⚖️', text: es ? 'La cartera No-VIS ($43.7B) supera a VIS ($38.2B) en volumen, pero el subsidio gubernamental VIS es clave para sostener el acceso de hogares con ingresos < 4 SMMLV.' : 'Non-VIS portfolio ($43.7B) exceeds VIS ($38.2B) in volume, but government VIS subsidies are key to sustaining access for households earning < 4 minimum wages.' },
        { icon: '🔍', text: es ? 'La morosidad hipotecaria (3.2%) es la más baja entre todas las modalidades de crédito, consistente con el patrón histórico de Colombia donde el hipotecario es el más seguro por el colateral.' : 'Mortgage delinquency (3.2%) is the lowest across all credit modalities, consistent with Colombia\'s historical pattern where mortgages are safest due to collateral.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Tasas VIS vs No-VIS */}
        <ChartCard
          title={es ? 'Tasas de Interés Hipotecarias VIS vs No-VIS (%)' : 'Mortgage Interest Rates VIS vs Non-VIS (%)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={tasasData} margin={{ top: 12, right: 32, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="year" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[9, 18]} tickFormatter={(v) => `${v}%`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <ReferenceLine y={13.25} stroke="rgba(239,68,68,0.4)" strokeDasharray="5 3"
                label={{ value: es ? 'Tasa BanRep pico' : 'BanRep rate peak', position: 'insideRight', fontSize: 10, fill: '#ef4444' }} />
              <Line type="monotone" dataKey="vis" name="VIS" stroke="#3b82f6" strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="noVis" name="No-VIS" stroke="#60a5fa" strokeWidth={2.5}
                strokeDasharray="5 3" dot={{ fill: '#60a5fa', r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Composición cartera — fixed horizontal bar */}
        <ChartCard title={es ? 'Composición Cartera Hipotecaria (billones COP, 2023)' : 'Mortgage Portfolio Composition (COP billions, 2023)'}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={carteraData} layout="vertical" margin={{ top: 8, right: 56, left: 8, bottom: 8 }}>
              <CartesianGrid {...gStyle} horizontal={false} />
              <XAxis type="number" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} />
              <YAxis dataKey="tipo" type="category" tick={axStyle} axisLine={false} tickLine={false} width={88} />
              <Tooltip {...tt} formatter={(v: number) => [`$${v}B COP`, es ? 'Cartera' : 'Portfolio']} />
              <Bar dataKey="valor" name={es ? 'Cartera ($B COP)' : 'Portfolio ($B COP)'}
                fill="#3b82f6" radius={[0, 6, 6, 0]} opacity={0.88}
                label={{ position: 'right', fontSize: 12, fill: '#3b82f6', fontWeight: 600, formatter: (v: number) => `$${v}B` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Desembolsos trimestrales */}
        <ChartCard title={es ? 'Nuevos Desembolsos por Trimestre (billones COP)' : 'New Mortgage Disbursements by Quarter (COP billions)'}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={desembolsosData} margin={{ top: 12, right: 12, left: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="q" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[2.5, 5.5]} tickFormatter={(v) => `$${v}B`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [`$${v}B COP`, es ? 'Desembolsos' : 'Disbursements']} />
              <ReferenceLine x="Q1-23" stroke="rgba(239,68,68,0.5)" label={{ value: es ? 'Mínimo' : 'Low', fontSize: 10, fill: '#ef4444' }} />
              <Area type="monotone" dataKey="valor" name={es ? 'Desembolsos ($B)' : 'Disbursements ($B)'}
                stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradBlue)"
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* IMIV vs IPC */}
        <ChartCard
          title={es ? 'IMIV (Precios Vivienda) vs IPC Acumulado (base 2018=100)' : 'IMIV (Housing Prices) vs Cumulative CPI (base 2018=100)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={imivData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="year" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[95, 155]} width={40} />
              <Tooltip {...tt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Area type="monotone" dataKey="imiv" name="IMIV (Vivienda Nueva)"
                fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="ipc" name="IPC Acumulado"
                stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3"
                dot={{ fill: '#f59e0b', r: 3, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
