import {
  BarChart, Bar, AreaChart, Area, ComposedChart, Line,
  CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#6366f1';

const composicionData = [
  { modalidad: 'Comercial', valor: 287.4 },
  { modalidad: 'Consumo', valor: 182.3 },
  { modalidad: 'Hipotecario', valor: 95.0 },
  { modalidad: 'Microcrédito', valor: 14.2 },
];

const calidadData = [
  { modalidad: 'Hipotecario', actual: 3.2, anterior: 2.8 },
  { modalidad: 'Consumo', actual: 6.1, anterior: 5.2 },
  { modalidad: 'Comercial', actual: 4.2, anterior: 3.8 },
  { modalidad: 'Microcrédito', actual: 9.8, anterior: 8.4 },
];

const endeudamientoData = [
  { year: '2018', consumo: 8.4, hipotecario: 9.8 },
  { year: '2019', consumo: 8.9, hipotecario: 10.2 },
  { year: '2020', consumo: 9.1, hipotecario: 11.7 },
  { year: '2021', consumo: 9.8, hipotecario: 12.3 },
  { year: '2022', consumo: 9.4, hipotecario: 12.3 },
  { year: '2023', consumo: 9.1, hipotecario: 12.2 },
];

const consumoData = [
  { tipo: 'Libre Inversión', pct: 42 },
  { tipo: 'Tarjeta Crédito', pct: 23 },
  { tipo: 'Vehículos', pct: 15 },
  { tipo: 'Libranza', pct: 12 },
  { tipo: 'Otros', pct: 8 },
];

export default function EndeudamientoPage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Endeudamiento y Riesgo de Cartera' : 'Household Debt & Credit Risk — Colombia'}
      category={es ? 'Datos Financieros Colombia' : 'Colombia Financial Data'}
      description={es
        ? 'Análisis integral de la calidad de cartera del sistema financiero colombiano usando datos de la Superintendencia Financiera y el Banco de la República. Rastrea el endeudamiento de hogares como % del PIB, el indicador de calidad (IC) por modalidad de crédito, y la composición del crédito de consumo, con alertas sobre tendencias de morosidad 2022-2023.'
        : 'Comprehensive portfolio quality analysis of Colombia\'s financial system using Superfinanciera and BanRep data. Tracks household debt as % of GDP, quality indicators by credit modality, and consumer credit composition, with delinquency trend alerts for 2022-2023.'}
      source="Superintendencia Financiera de Colombia · Banco de la República · DANE"
      color={COLOR}
      badgeCls="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
      headerBg="bg-gradient-to-br from-indigo-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Deuda Hogares / PIB' : 'Household Debt / GDP', value: '21.3%', sub: es ? '↓ 0.4pp vs 2022' : '↓ 0.4pp vs 2022', positive: true },
        { label: es ? 'IC Crédito Consumo' : 'Consumer Credit IC', value: '6.1%', sub: es ? '↑ 0.9pp en 12 meses' : '↑ 0.9pp in 12 months', positive: false },
        { label: es ? 'Cartera Vencida Total' : 'Total Overdue Portfolio', value: '4.8%', sub: es ? 'Todas modalidades' : 'All modalities', positive: false },
        { label: es ? 'Cobertura (provisiones)' : 'Coverage (provisions)', value: '95.6%', sub: es ? 'Cartera vencida cubierta' : 'Overdue portfolio covered', positive: true },
      ]}
      tools={['Python', 'Pandas', 'Power BI', 'Superfinanciera API', 'Banco República', 'statsmodels']}
      insights={[
        { icon: '🏦', text: es ? 'El crédito de consumo lidera el deterioro con IC del 6.1%, el mayor entre modalidades. Libre inversión (42% del consumo) muestra la mayor concentración de riesgo.' : 'Consumer credit leads deterioration with 6.1% IC, the highest among modalities. Unsecured personal loans (42% of consumer) show the highest risk concentration.' },
        { icon: '📊', text: es ? 'El microcrédito tiene el IC más alto (9.8%) pero representa solo el 2.4% de la cartera total ($14.2B). Su impacto sistémico es limitado aunque señala vulnerabilidad en el sector informal.' : 'Microcredit has the highest IC (9.8%) but represents only 2.4% of total portfolio ($14.2B). Systemic impact is limited, though it signals vulnerability in the informal sector.' },
        { icon: '📈', text: es ? 'El endeudamiento de hogares alcanzó su pico en 2021 (22.1% del PIB) y ha disminuido gradualmente. La contracción del consumo privado (-0.8% en 2023) contribuye a la mejora.' : 'Household debt peaked in 2021 (22.1% of GDP) and has gradually declined. The contraction of private consumption (-0.8% in 2023) contributes to the improvement.' },
        { icon: '💳', text: es ? 'La tarjeta de crédito (23% del consumo) históricamente tiene mayor volatilidad en morosidad. Su normalización post-pandemia fue más lenta que libre inversión.' : 'Credit cards (23% of consumer) historically show higher delinquency volatility. Their post-pandemic normalization has been slower than unsecured personal loans.' },
        { icon: '🛡️', text: es ? 'La cobertura de provisiones al 95.6% es adecuada según estándares internacionales (recomendación: >80%). El sistema financiero colombiano muestra resiliencia ante el deterioro de cartera.' : 'Provision coverage at 95.6% meets international standards (recommended: >80%). Colombia\'s financial system shows resilience against portfolio deterioration.' },
        { icon: '⚠️', text: es ? 'El crédito hipotecario (12.2% del PIB) muestra la menor variación, sugiriendo que el ajuste en compras de vivienda se dio vía volumen (menos créditos) no vía incumplimiento.' : 'Mortgage credit (12.2% of GDP) shows the least variation, suggesting housing adjustment occurred via volume (fewer loans) rather than default.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Composición Cartera Total */}
        <ChartCard
          title={es ? 'Composición Cartera por Modalidad (billones COP, 2023)' : 'Portfolio by Credit Modality (COP billions, 2023)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={composicionData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }} barCategoryGap="35%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="modalidad" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} width={48} />
              <Tooltip {...tt} formatter={(v: number) => [`$${v}B COP`, es ? 'Cartera' : 'Portfolio']} />
              <Bar dataKey="valor" name={es ? 'Cartera ($B COP)' : 'Portfolio ($B COP)'}
                fill="#6366f1" radius={[6, 6, 0, 0]} opacity={0.88}
                label={{ position: 'top', fontSize: 12, fill: '#6366f1', fontWeight: 600, formatter: (v: number) => `$${v}B` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* IC por modalidad */}
        <ChartCard title={es ? 'Indicador de Calidad por Modalidad (% IC, >30 días)' : 'Quality Indicator by Modality (% IC, >30 days)'}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={calidadData} margin={{ top: 4, right: 12, left: 8, bottom: 4 }} barCategoryGap="25%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="modalidad" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[0, 12]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '14px' }} />
              <Bar dataKey="anterior" name={es ? 'Año Anterior' : 'Prior Year'} fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name={es ? 'Actual 2023' : 'Current 2023'} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Endeudamiento % PIB */}
        <ChartCard title={es ? 'Endeudamiento Hogares como % del PIB' : 'Household Debt as % of GDP'}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={endeudamientoData} margin={{ top: 12, right: 12, left: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="gradConsumo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradHipot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="year" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[7, 23]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '14px' }} />
              <Area type="monotone" dataKey="hipotecario" name="Hipotecario"
                fill="url(#gradHipot)" stroke="#a78bfa" strokeWidth={2} dot={false} stackId="1" />
              <Area type="monotone" dataKey="consumo" name="Consumo"
                fill="url(#gradConsumo)" stroke="#6366f1" strokeWidth={2.5} dot={false} stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Composición consumo — fixed horizontal bar */}
        <ChartCard
          title={es ? 'Crédito de Consumo por Modalidad (%, 2023)' : 'Consumer Credit by Type (%, 2023)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={consumoData} layout="vertical" margin={{ top: 8, right: 64, left: 8, bottom: 8 }} barCategoryGap="30%">
              <CartesianGrid {...gStyle} horizontal={false} />
              <XAxis type="number" tick={axStyle} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}%`} domain={[0, 50]} />
              <YAxis dataKey="tipo" type="category" tick={axStyle} axisLine={false} tickLine={false} width={104} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, es ? 'Participación' : 'Share']} />
              <Bar dataKey="pct" name={es ? 'Participación' : 'Share'}
                fill="#6366f1" radius={[0, 6, 6, 0]} opacity={0.85}
                label={{ position: 'right', fontSize: 12, fill: '#6366f1', fontWeight: 600, formatter: (v: number) => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
