import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

const COLOR = '#ec4899';

const revenueData = [
  { month: 'Jan', revenue: 185, target: 170, prevYear: 152 },
  { month: 'Feb', revenue: 212, target: 190, prevYear: 168 },
  { month: 'Mar', revenue: 198, target: 200, prevYear: 175 },
  { month: 'Apr', revenue: 245, target: 215, prevYear: 191 },
  { month: 'May', revenue: 278, target: 240, prevYear: 208 },
  { month: 'Jun', revenue: 312, target: 260, prevYear: 229 },
  { month: 'Jul', revenue: 289, target: 275, prevYear: 242 },
  { month: 'Aug', revenue: 334, target: 290, prevYear: 261 },
  { month: 'Sep', revenue: 358, target: 310, prevYear: 278 },
  { month: 'Oct', revenue: 390, target: 340, prevYear: 295 },
  { month: 'Nov', revenue: 445, target: 380, prevYear: 342 },
  { month: 'Dec', revenue: 498, target: 420, prevYear: 388 },
];

const categoryData = [
  { name: 'Electronics', revenue: 1245, margin: 22 },
  { name: 'Fashion', revenue: 892, margin: 48 },
  { name: 'Home', revenue: 634, margin: 35 },
  { name: 'Sports', revenue: 521, margin: 31 },
  { name: 'Beauty', revenue: 489, margin: 56 },
  { name: 'Toys', revenue: 312, margin: 28 },
];

const funnelData = [
  { stage: 'Visits', users: 485200 },
  { stage: 'View', users: 218400 },
  { stage: 'Cart', users: 89600 },
  { stage: 'Checkout', users: 38200 },
  { stage: 'Purchase', users: 18420 },
];

const channelData = [
  { channel: 'Organic', revenue: 892, spend: 0 },
  { channel: 'Google', revenue: 645, spend: 189 },
  { channel: 'Meta', revenue: 412, spend: 145 },
  { channel: 'Email', revenue: 387, spend: 12 },
  { channel: 'Affiliates', revenue: 234, spend: 58 },
];

export default function EcommerceRevenuePage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Analítica de Ingresos E-Commerce' : 'E-Commerce Revenue Analytics'}
      category={es ? 'Analítica E-Commerce' : 'E-Commerce Analytics'}
      description={es
        ? 'Dashboard end-to-end rastreando ingresos mensuales vs meta, rendimiento por categoría de producto, embudo de conversión y atribución multicanal con integración en tiempo real de Shopify.'
        : 'End-to-end dashboard tracking monthly revenue vs targets, product category performance, conversion funnel drop-offs, and multi-channel attribution across all acquisition sources.'}
      source="Shopify API · Google Analytics 4 · Meta Ads API · SQL Server"
      color={COLOR}
      badgeCls="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
      headerBg="bg-gradient-to-br from-pink-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Ingresos Totales' : 'Total Revenue', value: '$3.74M', sub: '↑ 28.3% YoY', positive: true },
        { label: es ? 'Tasa de Conversión' : 'Conversion Rate', value: '3.8%', sub: '↑ 0.6pp vs prev year', positive: true },
        { label: es ? 'Valor Promedio Pedido' : 'Avg Order Value', value: '$203', sub: '↑ 12.1% growth', positive: true },
        { label: es ? 'LTV Cliente (24m)' : 'Customer LTV (24m)', value: '$485', sub: es ? 'Champions: $1.24K' : 'Champions segment: $1.24K', positive: true },
      ]}
      tools={['Power BI', 'SQL Server', 'Python', 'DAX', 'Shopify API', 'Google Analytics 4', 'dbt']}
      insights={[
        { icon: '📈', text: es ? 'Q4 generó el 32% de ingresos anuales. Diciembre fue el mes pico ($498K), un 18.6% sobre la meta.' : 'Q4 generated 32% of annual revenue. December was the peak month at $498K, 18.6% above target.' },
        { icon: '💎', text: es ? 'Beauty tiene el mayor margen bruto (56%) aunque Electronics lidera en volumen ($1.24M). Oportunidad: aumentar mix de Beauty.' : 'Beauty has the highest gross margin (56%) though Electronics leads in volume ($1.24M). Opportunity: grow Beauty mix.' },
        { icon: '📧', text: es ? 'Email marketing tiene ROAS de 32x con solo $12K de inversión — el canal más eficiente del portfolio.' : 'Email marketing delivers 32× ROAS on just $12K spend — far the most efficient channel in the mix.' },
        { icon: '🛒', text: es ? 'El 57.4% de abandono entre "Add to Cart" y "Checkout" representa la mayor oportunidad de optimización.' : '57.4% abandonment between "Add to Cart" and "Checkout" is the single biggest optimization opportunity.' },
        { icon: '🎯', text: es ? 'Mejora de 0.6pp en conversión representó $180K en ingresos adicionales vs año anterior.' : 'A 0.6pp conversion rate improvement translated to $180K in incremental revenue vs prior year.' },
        { icon: '📦', text: es ? 'Organic search aporta $892K sin costo de adquisición — señal de fuerte posicionamiento SEO y brand equity.' : 'Organic search contributes $892K with zero acquisition cost — strong SEO positioning and brand equity signal.' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Main: Revenue vs Target */}
        <ChartCard
          title={es ? 'Ingresos Mensuales vs Meta (USD miles)' : 'Monthly Revenue vs Target (USD thousands)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="month" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} width={52} />
              <Tooltip {...tt} formatter={(v: number, n: string) => [`$${v}K`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Area type="monotone" dataKey="prevYear" name={es ? 'Año Anterior' : 'Prior Year'}
                fill="rgba(236,72,153,0.05)" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Area type="monotone" dataKey="revenue" name={es ? 'Ingresos' : 'Revenue'}
                fill="rgba(236,72,153,0.12)" stroke="#ec4899" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              <Bar dataKey="target" name="Target" fill="rgba(168,85,247,0.18)" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Categories */}
        <ChartCard title={es ? 'Ingresos y Margen por Categoría' : 'Revenue & Margin by Category'}>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={categoryData} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} horizontal={false} />
              <XAxis type="number" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} />
              <YAxis dataKey="name" type="category" tick={axStyle} axisLine={false} tickLine={false} width={72} />
              <Tooltip {...tt} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="revenue" name={es ? 'Ingresos ($K)' : 'Revenue ($K)'} fill="#ec4899" radius={[0, 4, 4, 0]} opacity={0.85} />
              <Line type="monotone" dataKey="margin" name={es ? 'Margen (%)' : 'Margin (%)'} stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Funnel */}
        <ChartCard title={es ? 'Embudo de Conversión' : 'Conversion Funnel'}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData} margin={{ top: 12, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="stage" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [v.toLocaleString(), es ? 'Usuarios' : 'Users']} />
              <Bar dataKey="users" name={es ? 'Usuarios' : 'Users'} fill="#ec4899" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Channel Performance */}
        <ChartCard
          title={es ? 'Ingresos vs Inversión por Canal (USD miles)' : 'Revenue vs Spend by Channel (USD thousands)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={channelData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }} barCategoryGap="35%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="channel" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`} width={52} />
              <Tooltip {...tt} formatter={(v: number, n: string) => [`$${v}K`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="revenue" name={es ? 'Ingresos' : 'Revenue'} fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" name={es ? 'Inversión' : 'Ad Spend'} fill="#a855f7" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
