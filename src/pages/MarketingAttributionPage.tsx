import {
  BarChart, Bar, ScatterChart, Scatter, ComposedChart, Line,
  CartesianGrid, XAxis, YAxis, ZAxis,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#f43f5e';

const roasData = [
  { channel: 'Email', roas: 32.2, spend: 12, revenue: 387 },
  { channel: 'Affiliates', roas: 4.0, spend: 58, revenue: 234 },
  { channel: 'Google', roas: 3.4, spend: 189, revenue: 645 },
  { channel: 'Meta', roas: 2.8, spend: 145, revenue: 412 },
  { channel: 'Display', roas: 1.4, spend: 74, revenue: 104 },
];

const attributionData = [
  { channel: 'Organic', lastClick: 892, linear: 740, datadriven: 810 },
  { channel: 'Google', lastClick: 645, linear: 580, datadriven: 620 },
  { channel: 'Meta', lastClick: 412, linear: 490, datadriven: 460 },
  { channel: 'Email', lastClick: 387, linear: 420, datadriven: 395 },
  { channel: 'Affiliates', lastClick: 234, linear: 290, datadriven: 255 },
];

const weeklyData = [
  { week: 'W1', spend: 108, revenue: 345, roas: 3.2 },
  { week: 'W2', spend: 125, revenue: 389, roas: 3.1 },
  { week: 'W3', spend: 142, revenue: 462, roas: 3.3 },
  { week: 'W4', spend: 138, revenue: 498, roas: 3.6 },
  { week: 'W5', spend: 155, revenue: 521, roas: 3.4 },
  { week: 'W6', spend: 167, revenue: 589, roas: 3.5 },
  { week: 'W7', spend: 178, revenue: 634, roas: 3.6 },
  { week: 'W8', spend: 189, revenue: 698, roas: 3.7 },
];

const scatterData = [
  { name: 'Email', x: 12, y: 387, z: 32.2 },
  { name: 'Affiliates', x: 58, y: 234, z: 4.0 },
  { name: 'Google', x: 189, y: 645, z: 3.4 },
  { name: 'Meta', x: 145, y: 412, z: 2.8 },
  { name: 'Display', x: 74, y: 104, z: 1.4 },
];

export default function MarketingAttributionPage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Atribución de Marketing & ROAS' : 'Marketing Attribution & ROAS Tracker'}
      category={es ? 'Analítica de Marketing' : 'Marketing Analytics'}
      description={es
        ? 'Dashboard en tiempo real conectando Google Ads y Meta APIs para medir atribución multi-touch y ROAS en todos los canales de pago. Compara modelos de atribución (último clic, lineal y data-driven) para optimizar la inversión publicitaria de $2.1M.'
        : 'Real-time dashboard connecting Google Ads and Meta APIs to measure multi-touch attribution and ROAS across all paid channels. Compares last-click, linear, and data-driven attribution models to optimize $2.1M in annual ad spend.'}
      source="Google Ads API · Meta Marketing API · BigQuery · Tableau"
      color={COLOR}
      badgeCls="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
      headerBg="bg-gradient-to-br from-rose-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Inversión Total' : 'Total Ad Spend', value: '$2.1M', sub: es ? 'Todos los canales' : 'All paid channels', positive: true },
        { label: es ? 'ROAS Promedio' : 'Blended ROAS', value: '3.4×', sub: '↑ 40% vs prior period', positive: true },
        { label: es ? 'Costo por Adquisición' : 'Cost per Acquisition', value: '$42', sub: '↓ 18% optimization', positive: true },
        { label: es ? 'Ingresos Atribuidos' : 'Revenue Attributed', value: '$7.1M', sub: es ? 'Multi-touch lineal' : 'Linear multi-touch', positive: true },
      ]}
      tools={['Tableau', 'Google Ads API', 'Meta Marketing API', 'BigQuery', 'Python', 'dbt']}
      insights={[
        { icon: '📧', text: es ? 'Email marketing tiene ROAS de 32x — 9x más eficiente que el siguiente canal. El budget de email es subóptimo vs su ROI.' : 'Email delivers 32× ROAS — 9× more efficient than the next best channel. Email budget is sub-optimal relative to ROI.' },
        { icon: '🔄', text: es ? 'El modelo data-driven redistribuye 12% de crédito de Google hacia Meta vs último-clic, revelando subestimación de Meta en el funnel.' : 'Data-driven model redistributes 12% of credit from Google to Meta vs last-click, revealing Meta\'s funnel contribution is undervalued.' },
        { icon: '📊', text: es ? 'ROAS creció de 3.1x a 3.7x en 8 semanas — resultado de pausar campañas Display de bajo rendimiento (ROAS 1.4x).' : 'ROAS improved from 3.1× to 3.7× over 8 weeks — driven by pausing low-performing Display campaigns (1.4× ROAS).' },
        { icon: '🎯', text: es ? 'Google Ads genera el mayor volumen ($645K) pero Affiliates tiene mejor ROAS (4x) con menor riesgo de escala.' : 'Google Ads drives the highest volume ($645K) but Affiliates has better ROAS (4×) with lower scaling risk.' },
        { icon: '💡', text: es ? 'Redirigir $50K de Display a Email y Affiliates proyecta +$85K en ingresos manteniendo el mismo presupuesto total.' : 'Redirecting $50K from Display to Email and Affiliates projects +$85K in revenue at the same total budget.' },
        { icon: '⚡', text: es ? 'El CPA mejoró 18% mediante exclusión de audiencias ya convertidas y optimización de franjas horarias de máximo ROI.' : 'CPA improved 18% by excluding already-converted audiences and optimizing peak ROI time windows.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ROAS por canal */}
        <ChartCard title={es ? 'ROAS por Canal de Marketing' : 'ROAS by Marketing Channel'} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roasData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }} barCategoryGap="35%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="channel" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}×`} width={40} />
              <Tooltip {...tt} formatter={(v: number) => [`${v}×`, 'ROAS']} />
              <ReferenceLine y={1} stroke="#f43f5e" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: 'Break-even', position: 'insideRight', fontSize: 10, fill: '#f43f5e' }} />
              <Bar dataKey="roas" name="ROAS" fill="#f43f5e" radius={[6, 6, 0, 0]} opacity={0.88} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Attribution Models Comparison */}
        <ChartCard title={es ? 'Comparación Modelos de Atribución (miles USD)' : 'Attribution Models Comparison (USD thousands)'}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={attributionData} margin={{ top: 4, right: 12, left: 8, bottom: 4 }} barCategoryGap="25%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="channel" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [`$${v}K`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '14px' }} />
              <Bar dataKey="lastClick" name={es ? 'Último Clic' : 'Last Click'} fill="#f43f5e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="linear" name="Linear" fill="#fb923c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="datadriven" name="Data-Driven" fill="#a855f7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly ROAS trend */}
        <ChartCard title={es ? 'Tendencia Semanal: Inversión vs Revenue vs ROAS' : 'Weekly Trend: Spend vs Revenue vs ROAS'}>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={weeklyData} margin={{ top: 12, right: 36, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="week" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} width={44} />
              <YAxis yAxisId="right" orientation="right" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}×`} domain={[2.5, 4]} width={36} />
              <Tooltip {...tt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Bar yAxisId="left" dataKey="spend" name={es ? 'Inversión ($K)' : 'Spend ($K)'} fill="#f43f5e" radius={[3, 3, 0, 0]} opacity={0.5} />
              <Bar yAxisId="left" dataKey="revenue" name={es ? 'Revenue ($K)' : 'Revenue ($K)'} fill="#a855f7" radius={[3, 3, 0, 0]} opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="roas" name="ROAS (×)" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 4, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Spend vs Revenue Scatter */}
        <ChartCard title={es ? 'Eficiencia: Inversión vs Ingresos por Canal' : 'Efficiency: Spend vs Revenue by Channel'} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 12, right: 32, left: 8, bottom: 24 }}>
              <CartesianGrid {...gStyle} />
              <XAxis
                type="number" dataKey="x" name={es ? 'Inversión ($K)' : 'Spend ($K)'}
                tick={axStyle} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${v}K`}
                label={{ value: es ? 'Inversión (USD miles)' : 'Spend (USD thousands)', position: 'insideBottom', offset: -12, fontSize: 11, fill: '#9ca3af' }}
              />
              <YAxis
                type="number" dataKey="y" name={es ? 'Ingresos ($K)' : 'Revenue ($K)'}
                tick={axStyle} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${v}K`} width={52}
              />
              <ZAxis type="number" dataKey="z" range={[80, 800]} />
              <Tooltip
                {...tt}
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = scatterData.find(s => s.x === payload[0]?.payload?.x);
                  return (
                    <div style={{ ...tt.contentStyle }}>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</p>
                      <p>Spend: ${d?.x}K</p>
                      <p>Revenue: ${d?.y}K</p>
                      <p>ROAS: {d?.z}×</p>
                    </div>
                  );
                }}
              />
              <Scatter data={scatterData} fill="#f43f5e" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
