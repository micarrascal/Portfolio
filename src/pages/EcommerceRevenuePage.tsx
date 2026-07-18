import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProjectPage, ChartCard, tt, axStyle, gStyle } from './ProjectPage';
import { useApp } from '../context/AppContext';

import monthlyData    from '../data/ecommerce-monthly.json';
import categoryData   from '../data/ecommerce-categories.json';
import countryData    from '../data/ecommerce-countries.json';
import funnelData     from '../data/ecommerce-funnel.json';
import brandData      from '../data/ecommerce-brands.json';
import summary        from '../data/ecommerce-summary.json';

const COLOR = '#ec4899';

const nonUkCountries = countryData.filter(c => c.country !== 'United Kingdom').slice(0, 8);
const topCategory = categoryData[0];
const otherCategory = categoryData.find(c => c.category === 'Other')!;
const totalCategorized = categoryData.reduce((s, c) => s + c.revenue, 0);
const peakMonth = [...monthlyData].sort((a, b) => b.revenue - a.revenue)[0];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export default function EcommerceRevenuePage() {
  const { language } = useApp();
  const es = language === 'es';

  return (
    <ProjectPage
      title={es ? 'Analítica de Ingresos E-Commerce' : 'E-Commerce Revenue Analytics'}
      category={es ? 'Analítica E-Commerce · Datos Reales' : 'E-Commerce Analytics · Real Data'}
      description={es
        ? 'Tendencia de ingresos, categorías de producto y un embudo de conversión real, construidos 100% sobre datasets públicos abiertos: transacciones reales de un retailer online del Reino Unido y clickstream real de una tienda de cosméticos.'
        : 'Revenue trend, product category performance, and a real conversion funnel — built entirely on open public datasets: real transactions from a UK online retailer and real clickstream events from a cosmetics store.'}
      source="UCI Online Retail II · REES46 Cosmetics Shop clickstream (open datasets)"
      color={COLOR}
      badgeCls="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300"
      headerBg="bg-gradient-to-br from-pink-100 via-white to-white dark:from-gray-900 dark:to-gray-900"
      kpis={[
        { label: es ? 'Ingresos Totales' : 'Total Revenue', value: `£${(summary.totalRevenue / 1e6).toFixed(1)}M`, sub: `${summary.dateStart} → ${summary.dateEnd}`, positive: true },
        { label: es ? 'Valor Promedio Pedido' : 'Avg Order Value', value: `£${summary.avgOrderValue.toFixed(0)}`, sub: es ? `${fmt(summary.uniqueCustomers)} clientes únicos` : `${fmt(summary.uniqueCustomers)} unique customers`, positive: true },
        { label: es ? 'Conversión Real (embudo)' : 'Real Funnel Conversion', value: `${summary.overallConversionRate}%`, sub: es ? `${fmt(summary.totalSessions)} sesiones · dic 2019` : `${fmt(summary.totalSessions)} sessions · Dec 2019`, positive: true },
        { label: es ? 'Tasa de Cancelación' : 'Cancellation Rate', value: `${summary.cancellationRate}%`, sub: es ? `${fmt(summary.cancelledInvoices)} facturas canceladas` : `${fmt(summary.cancelledInvoices)} cancelled invoices`, positive: false },
      ]}
      tools={['Python', 'pandas', 'openpyxl', 'Recharts', 'React']}
      insights={[
        { icon: '📉', text: es
          ? `El ${summary.cancellationRate}% de las facturas fueron canceladas (${fmt(summary.cancelledInvoices)} de ${fmt(summary.totalOrders + summary.cancelledInvoices)}) — una tasa alta que en un negocio real ameritaría investigar causas de raíz antes que optimizar adquisición.`
          : `${summary.cancellationRate}% of invoices were cancelled (${fmt(summary.cancelledInvoices)} of ${fmt(summary.totalOrders + summary.cancelledInvoices)}) — a high rate that in a real business would warrant investigating root causes before spending more on acquisition.` },
        { icon: '🇬🇧', text: es
          ? `El Reino Unido concentra el ${summary.ukRevenueShare}% de los ingresos. Irlanda, Países Bajos y Alemania son los mercados internacionales más fuertes — una señal real de dónde probar expansión.`
          : `The UK accounts for ${summary.ukRevenueShare}% of revenue. Ireland, the Netherlands and Germany are the strongest international markets — a real signal for where to test expansion.` },
        { icon: '🏠', text: es
          ? `"${topCategory.category}" es la categoría líder con £${(topCategory.revenue/1e6).toFixed(1)}M (${topCategory.products} productos distintos). Categorías inferidas por palabras clave en la descripción — el dataset no trae una columna de categoría nativa.`
          : `"${topCategory.category}" is the top category at £${(topCategory.revenue/1e6).toFixed(1)}M across ${topCategory.products} distinct products. Categories are keyword-inferred from product descriptions — the raw dataset has no native category column.` },
        { icon: '🛒', text: es
          ? `Embudo real de ${fmt(summary.totalSessions)} sesiones: ${summary.viewToCartRate}% de quienes ven un producto lo agregan al carrito, y ${summary.cartToPurchaseRate}% de esos completan la compra — ${summary.overallConversionRate}% de conversión total, por encima del punto de referencia típico de e-commerce (2–3%).`
          : `Real funnel across ${fmt(summary.totalSessions)} sessions: ${summary.viewToCartRate}% of product viewers add to cart, and ${summary.cartToPurchaseRate}% of those complete a purchase — ${summary.overallConversionRate}% overall conversion, above the typical e-commerce benchmark of 2–3%.` },
        { icon: '📅', text: es
          ? `${peakMonth.label} fue el mes de mayor ingreso registrado (£${(peakMonth.revenue/1e6).toFixed(2)}M), consistente con la temporada de compras de fin de año.`
          : `${peakMonth.label} was the highest-revenue month on record (£${(peakMonth.revenue/1e6).toFixed(2)}M), consistent with year-end holiday shopping season.` },
        { icon: '💄', text: es
          ? `El campo de marca solo está presente en el ${summary.brandKnownSharePct}% de los ingresos de compra en el dataset de cosméticos — típico de clickstream real. runail lidera entre las marcas identificadas.`
          : `Brand is only populated for ${summary.brandKnownSharePct}% of purchase revenue in the cosmetics clickstream dataset — typical of messy real-world tracking data. runail leads among identified brands.` },
      ]}
    >
      {/* Data sources & methodology */}
      <div className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40">
        <p className="font-bold text-gray-900 dark:text-white text-sm mb-2">
          {es ? '📊 Fuentes de datos y metodología' : '📊 Data sources & methodology'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
          {es
            ? <>Tendencia de ingresos, categorías y países vienen de <strong>UCI Online Retail II</strong> — transacciones reales de un retailer de regalos del Reino Unido, dic 2009–nov 2011 (~1M líneas de factura). El embudo de conversión y las marcas vienen de <strong>REES46</strong> — eventos reales de clickstream (view/cart/purchase) de una tienda de cosméticos, dic 2019 (3.5M eventos). Son dos datasets reales distintos — no existe un dataset público único que combine ingresos y funnel de un mismo negocio, así que se combinan de forma transparente para mostrar ambos tipos de análisis con datos genuinos.</>
            : <>Revenue trend, categories and countries come from <strong>UCI Online Retail II</strong> — real transactions from a UK-based gift retailer, Dec 2009–Nov 2011 (~1M invoice lines). The conversion funnel and brand data come from <strong>REES46</strong> — real clickstream events (view/cart/purchase) from a cosmetics store, Dec 2019 (3.5M events). These are two separate real datasets — no single open dataset combines revenue and funnel data for the same business, so they're transparently combined here to show both kinds of analysis with genuine data.</>}
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <a href="https://archive.ics.uci.edu/dataset/502/online+retail+ii" target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
            UCI Online Retail II ↗
          </a>
          <a href="https://rees46.com/en/datasets" target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
            REES46 Datasets ↗
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Main: Revenue trend */}
        <ChartCard
          title={es ? 'Ingresos Mensuales vs Año Anterior (GBP, miles)' : 'Monthly Revenue vs Prior Year (GBP, thousands)'}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} />
              <XAxis dataKey="label" tick={axStyle} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `£${(v/1000).toFixed(0)}K`} width={56} />
              <Tooltip {...tt} formatter={(v: number, n: string) => [`£${fmt(Math.round(v/1000))}K`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
              <Area type="monotone" dataKey="prevYear" name={es ? 'Año Anterior' : 'Prior Year'}
                fill="rgba(236,72,153,0.05)" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="4 4" dot={false} connectNulls />
              <Area type="monotone" dataKey="revenue" name={es ? 'Ingresos' : 'Revenue'}
                fill="rgba(236,72,153,0.12)" stroke="#ec4899" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="movingAvg3" name={es ? 'Media Móvil 3M' : '3-Month Moving Avg'} stroke="#a855f7" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 dark:text-gray-500 px-4 pb-2">
            {es ? 'Dataset real; sin dato de "meta" de negocio, así que se muestra la media móvil de 3 meses como línea de tendencia en vez de una meta inventada.' : 'Real dataset; no business "target" exists in the data, so a 3-month moving average is shown as the trend line instead of a fabricated target.'}
          </p>
        </ChartCard>

        {/* Categories */}
        <ChartCard title={es ? `Ingresos por Categoría (£${(totalCategorized/1e6).toFixed(1)}M total)` : `Revenue by Category (£${(totalCategorized/1e6).toFixed(1)}M total)`}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} horizontal={false} />
              <XAxis type="number" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `£${(v/1e6).toFixed(1)}M`} />
              <YAxis dataKey="category" type="category" tick={axStyle} axisLine={false} tickLine={false} width={110} />
              <Tooltip {...tt} formatter={(v: number) => [`£${fmt(v)}`, es ? 'Ingresos' : 'Revenue']} />
              <Bar dataKey="revenue" name={es ? 'Ingresos' : 'Revenue'} fill="#ec4899" radius={[0, 4, 4, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 dark:text-gray-500 px-4 pb-2">
            {es
              ? `"Other" (£${(otherCategory.revenue/1e6).toFixed(1)}M) son productos que no calzaron con las palabras clave de categorización — real, no oculto.`
              : `"Other" (£${(otherCategory.revenue/1e6).toFixed(1)}M) is products that didn't match any category keyword — real, not hidden.`}
          </p>
        </ChartCard>

        {/* Real conversion funnel */}
        <ChartCard title={es ? `Embudo de Conversión Real (${summary.sourceMonth})` : `Real Conversion Funnel (${summary.sourceMonth})`}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData} margin={{ top: 12, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="stage" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={44} />
              <Tooltip {...tt} formatter={(v: number) => [fmt(v), es ? 'Sesiones' : 'Sessions']} />
              <Bar dataKey="value" name={es ? 'Sesiones' : 'Sessions'} fill="#ec4899" radius={[6, 6, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 dark:text-gray-500 px-4 pb-2">
            {es ? 'Clickstream real de una tienda de cosméticos distinta (REES46) — no del mismo negocio que los ingresos de arriba.' : 'Real clickstream from a separate cosmetics store (REES46) — not the same business as the revenue data above.'}
          </p>
        </ChartCard>

        {/* Countries */}
        <ChartCard title={es ? `Mercados Internacionales (excl. Reino Unido, ${100-summary.ukRevenueShare}% de ingresos)` : `International Markets (excl. UK, ${100-summary.ukRevenueShare}% of revenue)`}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nonUkCountries} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 4 }}>
              <CartesianGrid {...gStyle} horizontal={false} />
              <XAxis type="number" tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `£${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="country" type="category" tick={axStyle} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...tt} formatter={(v: number) => [`£${fmt(v)}`, es ? 'Ingresos' : 'Revenue']} />
              <Bar dataKey="revenue" name={es ? 'Ingresos' : 'Revenue'} fill="#a855f7" radius={[0, 4, 4, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Brands */}
        <ChartCard
          title={es ? `Ingresos por Marca — datos de marca en el ${summary.brandKnownSharePct}% de compras` : `Revenue by Brand — brand known on ${summary.brandKnownSharePct}% of purchases`}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={brandData} margin={{ top: 12, right: 24, left: 8, bottom: 4 }} barCategoryGap="30%">
              <CartesianGrid {...gStyle} vertical={false} />
              <XAxis dataKey="brand" tick={axStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} width={52} />
              <Tooltip {...tt} formatter={(v: number, n: string, p: any) => [`$${fmt(v)} · ${fmt(p.payload.orders)} ${es ? 'pedidos' : 'orders'}`, n]} />
              <Bar dataKey="revenue" name={es ? 'Ingresos ($)' : 'Revenue ($)'} fill="#ec4899" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </ProjectPage>
  );
}
