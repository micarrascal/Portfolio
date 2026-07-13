import {
  BarChart, Bar, Cell, LineChart, Line, AreaChart, Area, ComposedChart,
  CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#0d9488';

const ipcGruposData = [
  { grupo: 'Educación', ipc: 12.01 },
  { grupo: 'Salud', ipc: 11.62 },
  { grupo: 'Restaurantes', ipc: 11.47 },
  { grupo: 'Recreación', ipc: 8.34 },
  { grupo: 'Transporte', ipc: 9.81 },
  { grupo: 'Vivienda', ipc: 9.23 },
  { grupo: 'Alimentos', ipc: 7.24 },
  { grupo: 'Vestuario', ipc: 3.82 },
  { grupo: 'Comun.', ipc: 3.12 },
];

const ipcSerieData = [
  { mes: 'Ene-22', ipc: 6.94 },
  { mes: 'Mar-22', ipc: 8.53 },
  { mes: 'May-22', ipc: 9.07 },
  { mes: 'Jul-22', ipc: 10.21 },
  { mes: 'Sep-22', ipc: 11.44 },
  { mes: 'Nov-22', ipc: 12.53 },
  { mes: 'Ene-23', ipc: 13.25 },
  { mes: 'Mar-23', ipc: 13.34 },
  { mes: 'May-23', ipc: 12.73 },
  { mes: 'Jul-23', ipc: 11.78 },
  { mes: 'Sep-23', ipc: 10.99 },
  { mes: 'Nov-23', ipc: 10.15 },
  { mes: 'Dic-23', ipc: 9.28 },
];

const consumoData = [
  { year: '2018', consumo: 3.5 },
  { year: '2019', consumo: 4.6 },
  { year: '2020', consumo: -6.2 },
  { year: '2021', consumo: 15.9 },
  { year: '2022', consumo: 6.4 },
  { year: '2023', consumo: -0.8 },
];

const canastaSalarioData = [
  { year: '2020', smmlv: 877.8, canasta: 860 },
  { year: '2021', smmlv: 908.5, canasta: 910 },
  { year: '2022', smmlv: 1000.0, canasta: 1050 },
  { year: '2023', smmlv: 1160.0, canasta: 1225 },
];

export default function ConsumoInflacionPage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Consumo Privado e Inflación en Colombia' : 'Private Consumption & Inflation — Colombia'}
      category={es ? 'Datos Abiertos Colombia' : 'Colombia Open Data'}
      description={es
        ? 'Dashboard macroeconómico que rastrea el IPC de Colombia por grupos de gasto (DANE), la serie mensual de inflación 2022-2023, las tendencias del consumo privado real y la brecha entre el salario mínimo y la canasta básica familiar. El análisis revela cómo el pico inflacionario de 13.34% en marzo 2023 erosionó el poder adquisitivo de los hogares colombianos.'
        : 'Macroeconomic dashboard tracking Colombia\'s CPI by spending group (DANE), the monthly 2022-2023 inflation series, real private consumption trends, and the gap between minimum wage and the basic household basket. The analysis shows how the 13.34% inflation peak in March 2023 eroded Colombian household purchasing power.'}
      source="DANE (CPI, National Accounts) · Banco de la República · MinComercio"
      color={COLOR}
      badgeCls="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
      headerBg="bg-gradient-to-br from-teal-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'IPC Pico (Mar 2023)' : 'IPC Peak (Mar 2023)', value: '13.34%', sub: es ? 'Máximo histórico reciente' : 'Recent historical peak', positive: false },
        { label: es ? 'IPC Dic 2023' : 'IPC Dec 2023', value: '9.28%', sub: es ? '↓ 4.06pp del pico' : '↓ 4.06pp from peak', positive: true },
        { label: es ? 'Consumo Real 2023' : 'Real Consumption 2023', value: '−0.8%', sub: es ? 'Contracción por tasas altas' : 'Contraction from high rates', positive: false },
        { label: es ? 'Brecha Canasta-SMMLV' : 'Basket-MinWage Gap', value: '−$65K', sub: es ? 'COP/mes deficit 2023' : 'COP/month deficit 2023', positive: false },
      ]}
      tools={['Python', 'Pandas', 'Recharts', 'DANE API', 'Banco República', 'statsmodels', 'Power BI']}
      insights={[
        { icon: '🔝', text: es ? 'El pico inflacionario de 13.34% (Mar 2023) es el mayor de Colombia en 24 años. Fue impulsado principalmente por Educación (12%), Salud (11.62%) y Restaurantes (11.47%).' : 'The 13.34% inflation peak (Mar 2023) is Colombia\'s highest in 24 years. Driven mainly by Education (12%), Health (11.62%), and Restaurants (11.47%).' },
        { icon: '🍎', text: es ? 'Los alimentos (7.24% en dic-2023) desaceleraron más rápido por el buen desempeño agrícola y la normalización de cadenas de suministro post-pandemia.' : 'Food inflation (7.24% in Dec 2023) decelerated fastest due to strong agricultural output and post-pandemic supply chain normalization.' },
        { icon: '📉', text: es ? 'El consumo privado cayó 0.8% en 2023, la primera contracción desde 2020. Las tasas de interés altas (BanRep: 13.25%) redujeron el crédito de consumo y la demanda.' : 'Private consumption fell 0.8% in 2023, the first contraction since 2020. High interest rates (BanRep: 13.25%) reduced consumer credit and demand.' },
        { icon: '💰', text: es ? 'El salario mínimo ($1.16M en 2023) quedó por debajo de la canasta básica familiar ($1.225M) por primera vez, creando un déficit de $65K/mes para familias de referencia.' : 'The minimum wage ($1.16M in 2023) fell below the basic household basket ($1.225M) for the first time, creating a $65K/month deficit for reference households.' },
        { icon: '↗️', text: es ? 'La tendencia bajista del IPC desde Mar-2023 (-4.06pp a Dic-2023) es la más rápida de la región, evidenciando la efectividad de la política monetaria contractiva del BanRep.' : 'The declining IPC trend from Mar-2023 (-4.06pp to Dec-2023) is the fastest in the region, evidencing BanRep\'s effective contractionary monetary policy.' },
        { icon: '🔄', text: es ? 'El rebote del consumo en 2021 (+15.9%) fue excepcional pero transitorio. La combinación inflación+tasas altas agotó ese impulso y generó la contracción de 2023.' : 'The 2021 consumption rebound (+15.9%) was exceptional but transitory. The combination of high inflation + high rates exhausted that momentum, causing the 2023 contraction.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* IPC por grupos */}
        <ChartCard
          title={es ? 'IPC por Grupos de Gasto — Dic 2023 (variación anual %)' : 'CPI by Spending Group — Dec 2023 (annual change %)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={[...ipcGruposData].sort((a, b) => b.ipc - a.ipc)}
              margin={{ top: 12, right: 32, left: 8, bottom: 4 }}
              barCategoryGap="30%"
            >
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="grupo" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[0, 14]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, es ? 'Variación anual' : 'Annual change']} />
              <ReferenceLine y={9.28} stroke="#0d9488" strokeDasharray="4 3"
                label={{ value: es ? 'IPC total 9.28%' : 'Total CPI 9.28%', position: 'insideRight', fontSize: 10, fill: '#0d9488' }} />
              <Bar dataKey="ipc" name={es ? 'Variación IPC (%)' : 'CPI Change (%)'} fill="#0d9488" radius={[6, 6, 0, 0]} opacity={0.88} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Serie IPC mensual */}
        <ChartCard title={es ? 'Serie IPC Mensual 2022–2023 (variación anual %)' : 'Monthly CPI Series 2022–2023 (annual change %)'}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ipcSerieData} margin={{ top: 12, right: 12, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="mes" tick={{ ...axStyle, fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[6, 14]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, 'IPC']} />
              <ReferenceLine x="Mar-23" stroke="rgba(13,148,136,0.5)"
                label={{ value: es ? 'Pico 13.34%' : 'Peak 13.34%', position: 'insideTopRight', fontSize: 10, fill: '#0d9488' }} />
              <Line type="monotone" dataKey="ipc" name="IPC %" stroke="#0d9488" strokeWidth={2.5}
                dot={{ fill: '#0d9488', r: 3, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Consumo privado real — negative bars in red */}
        <ChartCard title={es ? 'Consumo Privado Real — Variación Anual (%)' : 'Real Private Consumption — Annual Change (%)'}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={consumoData} margin={{ top: 12, right: 12, left: 8, bottom: 4 }} barCategoryGap="35%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="year" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, es ? 'Var. consumo' : 'Consumption']} />
              <ReferenceLine y={0} stroke="rgba(100,100,100,0.4)" />
              <Bar dataKey="consumo" name={es ? 'Consumo real (%)' : 'Real consumption (%)'}
                radius={[6, 6, 0, 0]}
                label={{ position: 'top', fontSize: 11, fill: '#9ca3af', formatter: (v: number) => `${v}%` }}
              >
                {consumoData.map((entry, index) => (
                  <Cell key={index} fill={entry.consumo < 0 ? '#ef4444' : '#0d9488'} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Canasta vs salario */}
        <ChartCard
          title={es ? 'Salario Mínimo vs Canasta Básica Familiar (miles COP/mes)' : 'Minimum Wage vs Basic Household Basket (COP thousands/month)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={canastaSalarioData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="year" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[800, 1300]} tickFormatter={(v) => `$${v}K`} width={52} />
              <Tooltip {...tt} formatter={(v: number) => [`$${v.toFixed(0)}K COP`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Area type="monotone" dataKey="canasta" name={es ? 'Canasta Básica' : 'Basic Basket'}
                fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="smmlv" name={es ? 'Salario Mínimo' : 'Min. Wage'}
                stroke="#0d9488" strokeWidth={2.5}
                dot={{ fill: '#0d9488', r: 5, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
