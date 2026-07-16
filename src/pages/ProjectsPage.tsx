import { ArrowRight, BarChart2, Building2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const PROJECTS = [
  {
    id: 1, slug: 'ecommerce-revenue',
    titleKey: 'project1.title', descKey: 'project1.desc',
    impactKey: 'project1.impact', categoryKey: 'project1.category',
    tags: ['Power BI', 'SQL', 'Revenue Analytics'],
  },
  {
    id: 2, slug: 'customer-rfm',
    titleKey: 'project2.title', descKey: 'project2.desc',
    impactKey: 'project2.impact', categoryKey: 'project2.category',
    tags: ['Python', 'BigQuery', 'Segmentation'],
  },
  {
    id: 3, slug: 'marketing-attribution',
    titleKey: 'project3.title', descKey: 'project3.desc',
    impactKey: 'project3.impact', categoryKey: 'project3.category',
    tags: ['Tableau', 'Google Ads API', 'Attribution'],
  },
  {
    id: 4, slug: 'credito-hipotecario',
    titleKey: 'project4.title', descKey: 'project4.desc',
    impactKey: 'project4.impact', categoryKey: 'project4.category',
    tags: ['Python', 'Power BI', 'Financial Analytics'],
  },
  {
    id: 5, slug: 'endeudamiento',
    titleKey: 'project5.title', descKey: 'project5.desc',
    impactKey: 'project5.impact', categoryKey: 'project5.category',
    tags: ['Python', 'Power BI', 'Macroeconomics'],
  },
  {
    id: 6, slug: 'consumo-inflacion',
    titleKey: 'project6.title', descKey: 'project6.desc',
    impactKey: 'project6.impact', categoryKey: 'project6.category',
    tags: ['Python', 'DANE', 'Inflation Analysis'],
  },
];

export default function ProjectsPage() {
  const { t, language } = useApp();

  useSEO(
    'Projects | Isabel Carrascal – BI Developer',
    'Explore Isabel Carrascal\'s data and analytics projects: Power BI dashboards, Python models, and interactive Colombia data visualizations.',
    '/projects'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ─────────────────────────────── */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('projects.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </div>

          {/* ── Grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* 6 project cards */}
            {PROJECTS.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-600"
              >
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold mb-4">
                  {t(project.categoryKey)}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {t(project.titleKey)}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {t(project.descKey)}
                </p>

                <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30">
                  <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                    {t(project.impactKey)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                  {t('projects.view')}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}

            {/* Bogota Real Estate card */}
            <Link
              to="/real-estate"
              className="group bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600"
            >
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-semibold mb-4">
                Real Estate · Web Scraping
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Bogotá Real Estate
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {language === 'es'
                  ? 'Precio promedio por m² por localidad en Bogotá, evolución nacional de ventas de vivienda y comparativa entre ciudades colombianas. Web scraping sobre Metrocuadrado.com.'
                  : 'Average price per m² by Bogotá locality, national housing sales trends, and Colombian city comparison. Built with web scraping on Metrocuadrado.com.'}
              </p>

              <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-rose-100 dark:border-rose-800/30">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {language === 'es'
                    ? '5.2× brecha de precio entre Usaquén y Ciudad Bolívar'
                    : '5.2× price gap between Usaquén and Ciudad Bolívar'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['Python', 'BeautifulSoup', 'Recharts', 'react-simple-maps'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium text-sm group-hover:gap-3 transition-all">
                {language === 'es' ? 'Explorar análisis' : 'Explore analysis'}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Bancos e Hipotecas card */}
            <Link
              to="/bancos"
              className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600"
            >
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold mb-4">
                {language === 'es' ? 'Analisis Financiero' : 'Financial Analysis'}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {language === 'es' ? 'Bancos e Hipotecas' : 'Banks & Mortgages'}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {language === 'es'
                  ? 'Analisis interactivo de tasas hipotecarias y participacion de mercado de los principales bancos colombianos. Relacion inversa entre cuota y tasa de interes.'
                  : 'Interactive analysis of mortgage interest rates and market share of major Colombian banks. Inverse relationship between market share and interest rate.'}
              </p>

              <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-purple-100 dark:border-purple-800/30">
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {language === 'es'
                    ? 'Datos reales — Superfinanciera · Promedio 2024'
                    : 'Real data — Superfinanciera · 2024 average'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['Recharts', 'Superfinanciera', 'Mortgage Analysis', 'Open Data'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium text-sm group-hover:gap-3 transition-all">
                {language === 'es' ? 'Ver analisis' : 'View analysis'}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Colombia en Datos card */}
            <Link
              to="/colombia"
              className="group bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600"
            >
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold mb-4">
                {language === 'es' ? 'Visualización Interactiva' : 'Interactive Data Viz'}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  {language === 'es' ? 'Colombia en Datos' : 'Colombia in Data'}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {language === 'es'
                  ? 'Visualizaciones interactivas del sistema financiero colombiano: mapa de inclusión por departamento, histórico de inflación IPC y cartera de crédito por modalidad.'
                  : 'Interactive visualizations of the Colombian financial system: inclusion map by department, CPI inflation history, and credit portfolio breakdown.'}
              </p>

              <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/50 rounded-lg border border-pink-100 dark:border-pink-800/30">
                <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                  {language === 'es'
                    ? 'Datos reales — Banca de Oportunidades · DANE · Superfinanciera'
                    : 'Real data — Banca de Oportunidades · DANE · Superfinanciera'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {['D3.js', 'react-simple-maps', 'Recharts', 'Open Data'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                {language === 'es' ? 'Explorar visualizaciones' : 'Explore visualizations'}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
