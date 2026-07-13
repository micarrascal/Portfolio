import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#a855f7';

const segmentData = [
  { segment: 'Champions', customers: 11116, clv: 1240, pct: 23 },
  { segment: 'Loyal', customers: 14979, clv: 720, pct: 31 },
  { segment: 'Potential', customers: 8698, clv: 410, pct: 18 },
  { segment: 'At Risk', customers: 7730, clv: 280, pct: 16 },
  { segment: 'Lost', customers: 5797, clv: 90, pct: 12 },
];

const radarData = [
  { metric: 'Recency', Champions: 95, Loyal: 78, AtRisk: 32 },
  { metric: 'Frequency', Champions: 90, Loyal: 82, AtRisk: 28 },
  { metric: 'Monetary', Champions: 98, Loyal: 70, AtRisk: 25 },
  { metric: 'Engagement', Champions: 88, Loyal: 75, AtRisk: 20 },
  { metric: 'Tenure', Champions: 92, Loyal: 88, AtRisk: 45 },
];

const retentionData = [
  { month: 'M0', Champions: 100, Loyal: 100, Potential: 100 },
  { month: 'M1', Champions: 96, Loyal: 88, Potential: 72 },
  { month: 'M2', Champions: 93, Loyal: 82, Potential: 61 },
  { month: 'M3', Champions: 91, Loyal: 78, Potential: 53 },
  { month: 'M4', Champions: 89, Loyal: 74, Potential: 46 },
  { month: 'M5', Champions: 88, Loyal: 71, Potential: 41 },
  { month: 'M6', Champions: 86, Loyal: 68, Potential: 37 },
];

export default function CustomerRFMPage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Segmentación RFM de Clientes' : 'Customer RFM Segmentation'}
      category={es ? 'Analítica de Clientes' : 'Customer Analytics'}
      description={es
        ? 'Modelo de clustering en Python + BigQuery que segmenta 48.320 clientes por Recencia, Frecuencia y Valor Monetario. Incluye análisis de retención por cohorte y cálculo de CLV (valor de vida del cliente) por segmento para optimizar campañas de retención.'
        : 'Python + BigQuery clustering model segmenting 48,320 customers by Recency, Frequency, and Monetary value. Includes cohort retention curves and CLV calculation per segment to drive targeted retention campaigns.'}
      source="BigQuery · CRM Data Warehouse · Python (Scikit-learn, Pandas)"
      color={COLOR}
      badgeCls="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
      headerBg="bg-gradient-to-br from-purple-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Clientes Totales' : 'Total Customers', value: '48.3K', sub: es ? '5 segmentos identificados' : '5 segments identified', positive: true },
        { label: es ? 'LTV Promedio' : 'Avg CLV (24m)', value: '$485', sub: es ? 'Champions: $1.24K' : 'Champions: $1.24K', positive: true },
        { label: es ? 'Reducción Churn' : 'Churn Reduction', value: '−22%', sub: es ? 'Campañas de retención' : 'Post-campaign result', positive: true },
        { label: es ? 'Retención Champions' : 'Champions Retention', value: '86%', sub: es ? '6 meses cohorte' : '6-month cohort', positive: true },
      ]}
      tools={['Python', 'Scikit-learn', 'Pandas', 'BigQuery', 'Looker Studio', 'K-Means Clustering']}
      insights={[
        { icon: '🏆', text: es ? 'El segmento Champions (23%) genera el 48% de los ingresos totales. Son la prioridad #1 para retención y referidos.' : 'Champions (23% of customers) generate 48% of total revenue. Top priority for retention and referral programs.' },
        { icon: '⚠️', text: es ? '"At Risk" (16%) tiene CLV de $280 y baja recencia. Una campaña de reactivación con descuento del 15% puede recuperar el 40%.' : '"At Risk" (16%) has $280 CLV with low recency. A 15% discount reactivation campaign can recover ~40% of them.' },
        { icon: '📉', text: es ? 'El segmento "Lost" (12%) tiene CLV de solo $90 — el costo de adquisición supera el potencial de recuperación.' : '"Lost" segment (12%) has only $90 CLV — acquisition cost exceeds recovery potential. Focus elsewhere.' },
        { icon: '🎯', text: es ? 'Potential Loyalists (18%) son los de mayor potencial de upsell. Campaigns personalizadas pueden moverlos a Loyal en 3 meses.' : 'Potential Loyalists (18%) have the highest upsell potential. Personalized campaigns can convert them to Loyal in 90 days.' },
        { icon: '📊', text: es ? 'La retención de Champions cae solo 14pp a 6 meses vs 63pp en Potential — validando la estrategia de concentración en Champions.' : 'Champions retain 86% at month 6 vs only 37% for Potential — validating a Champions-first retention strategy.' },
        { icon: '💰', text: es ? 'Incrementar el segmento Loyal en 5pp a Champions generaría $3.6M adicionales en LTV total.' : 'Moving 5% of Loyal to Champions would generate $3.6M in additional total LTV.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Segment Distribution */}
        <ChartCard title={es ? 'Distribución de Segmentos RFM' : 'RFM Segment Distribution'} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={segmentData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="segment" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={44} />
              <YAxis yAxisId="right" orientation="right" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={48} />
              <Tooltip {...tt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Bar yAxisId="left" dataKey="customers" name={es ? 'Clientes' : 'Customers'} fill="#a855f7" radius={[6, 6, 0, 0]} opacity={0.85} />
              <Line yAxisId="right" type="monotone" dataKey="clv" name="CLV ($)" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: '#ec4899', r: 5, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar: RFM Scores */}
        <ChartCard title={es ? 'Perfil RFM por Segmento (score 0-100)' : 'RFM Profile by Segment (score 0-100)'}>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 16, right: 24, left: 24, bottom: 16 }}>
              <PolarGrid stroke="rgba(150,150,150,0.2)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Radar name="Champions" dataKey="Champions" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Loyal" dataKey="Loyal" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="At Risk" dataKey="AtRisk" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
              <Tooltip {...tt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cohort Retention */}
        <ChartCard title={es ? 'Retención por Cohorte 6 Meses (%)' : '6-Month Cohort Retention (%)'}>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={retentionData} margin={{ top: 12, right: 20, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="month" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Line type="monotone" dataKey="Champions" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 3, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="Loyal" stroke="#ec4899" strokeWidth={2} dot={{ fill: '#ec4899', r: 3, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="Potential" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
