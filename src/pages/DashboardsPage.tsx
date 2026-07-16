import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

/* ── Brand SVG logos ───────────────────────────────────────────────────────── */

function PowerBILogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <rect x="4" y="24" width="8" height="20" rx="2" fill="#F2C811" />
      <rect x="16" y="16" width="8" height="28" rx="2" fill="#F2C811" opacity="0.85" />
      <rect x="28" y="8" width="8" height="36" rx="2" fill="#F2C811" opacity="0.7" />
      <rect x="40" y="4" width="4" height="40" rx="2" fill="#F2C811" opacity="0.5" />
    </svg>
  );
}

function TableauLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      {/* center cross */}
      <rect x="21" y="6" width="6" height="36" rx="1.5" fill="#E8762D" />
      <rect x="6" y="21" width="36" height="6" rx="1.5" fill="#E8762D" />
      {/* diagonal dots */}
      <circle cx="10" cy="10" r="3.5" fill="#4E79A7" />
      <circle cx="38" cy="10" r="3.5" fill="#4E79A7" />
      <circle cx="10" cy="38" r="3.5" fill="#4E79A7" />
      <circle cx="38" cy="38" r="3.5" fill="#4E79A7" />
      {/* mid dots */}
      <circle cx="24" cy="4" r="2.5" fill="#F28E2B" />
      <circle cx="24" cy="44" r="2.5" fill="#F28E2B" />
      <circle cx="4" cy="24" r="2.5" fill="#F28E2B" />
      <circle cx="44" cy="24" r="2.5" fill="#F28E2B" />
    </svg>
  );
}

function LookerLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      {/* Looker "eye" / gem shape */}
      <circle cx="24" cy="20" r="13" fill="#34A853" opacity="0.15" />
      <circle cx="24" cy="20" r="9" fill="#34A853" opacity="0.3" />
      <circle cx="24" cy="20" r="5.5" fill="#34A853" />
      {/* stem */}
      <rect x="21.5" y="30" width="5" height="12" rx="2.5" fill="#1A73E8" />
      {/* top arc highlight */}
      <path d="M13 20 Q24 8 35 20" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ── Tool data ─────────────────────────────────────────────────────────────── */

const TOOLS = [
  {
    id: 'powerbi',
    name: 'Power BI',
    tagline: { es: 'Microsoft Business Intelligence', en: 'Microsoft Business Intelligence' },
    desc: {
      es: 'Creación de reportes interactivos y dashboards ejecutivos con DAX, Power Query y modelado de datos en estrella. Especializada en KPIs comerciales y financieros.',
      en: 'Interactive reports and executive dashboards using DAX, Power Query, and star schema modeling. Specialized in commercial and financial KPIs.',
    },
    skills: ['DAX', 'Power Query', 'Data Modeling', 'Row-Level Security', 'Incremental Refresh'],
    bg: 'from-yellow-400/10 to-amber-400/10',
    border: 'border-yellow-300 dark:border-yellow-700',
    badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    accent: 'text-yellow-600 dark:text-yellow-400',
    hover: 'hover:border-yellow-400 dark:hover:border-yellow-500',
    Logo: PowerBILogo,
    projectSlug: null,
    projects: [1, 4, 5],
  },
  {
    id: 'tableau',
    name: 'Tableau',
    tagline: { es: 'Visual Analytics Platform', en: 'Visual Analytics Platform' },
    desc: {
      es: 'Visualizaciones de datos exploratorias y dashboards de marketing con Tableau Desktop y Tableau Public. Integración con Google Ads API y fuentes de datos externas.',
      en: 'Exploratory data visualizations and marketing dashboards with Tableau Desktop and Tableau Public. Integration with Google Ads API and external data sources.',
    },
    skills: ['Tableau Desktop', 'Tableau Public', 'LOD Expressions', 'Blending', 'Story Points'],
    bg: 'from-orange-400/10 to-blue-400/10',
    border: 'border-orange-300 dark:border-orange-700',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    accent: 'text-orange-600 dark:text-orange-400',
    hover: 'hover:border-orange-400 dark:hover:border-orange-500',
    Logo: TableauLogo,
    projectSlug: 'marketing-attribution',
    projects: [3],
  },
  {
    id: 'looker',
    name: 'Looker',
    tagline: { es: 'Google Cloud BI & Analytics', en: 'Google Cloud BI & Analytics' },
    desc: {
      es: 'Modelado semántico con LookML, explorations y dashboards self-service sobre BigQuery. Orientada a equipos de producto y growth que necesitan métricas confiables en tiempo real.',
      en: 'Semantic modeling with LookML, Explores, and self-service dashboards on top of BigQuery. Focused on product and growth teams that need reliable real-time metrics.',
    },
    skills: ['LookML', 'BigQuery', 'Explores', 'Derived Tables', 'Scheduled Deliveries'],
    bg: 'from-green-400/10 to-blue-400/10',
    border: 'border-green-300 dark:border-green-700',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    accent: 'text-green-600 dark:text-green-400',
    hover: 'hover:border-green-400 dark:hover:border-green-500',
    Logo: LookerLogo,
    projectSlug: 'customer-rfm',
    projects: [2],
  },
];

export default function DashboardsPage() {
  const { language } = useApp();
  const lang = language as 'es' | 'en';

  useSEO(
    'Dashboards | Isabel Carrascal – BI Developer',
    'Power BI, Tableau and Looker dashboards by Isabel Carrascal. Interactive business intelligence solutions for startups and data teams.',
    '/dashboards'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-semibold mb-4">
              {lang === 'es' ? 'Herramientas de BI' : 'BI Tools'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'es' ? 'Mis ' : 'My '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Dashboards
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === 'es'
                ? 'Trabajo con las principales plataformas de Business Intelligence para construir soluciones de datos que generan decisiones.'
                : 'I work with the leading Business Intelligence platforms to build data solutions that drive decisions.'}
            </p>
          </div>

          {/* Tool cards */}
          <div className="flex flex-col gap-8">
            {TOOLS.map((tool) => {
              const Logo = tool.Logo;
              return (
                <div
                  key={tool.id}
                  className={`group bg-gradient-to-br ${tool.bg} rounded-2xl p-8 border ${tool.border} ${tool.hover} shadow-lg hover:shadow-2xl transition-all`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Logo + name */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3 w-32">
                      <Logo />
                      <p className="text-lg font-bold text-gray-900 dark:text-white text-center">{tool.name}</p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tool.badge}`}>
                        {tool.tagline[lang]}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                        {tool.desc[lang]}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.skills.map((s) => (
                          <span
                            key={s}
                            className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to="/projects"
                          className={`flex items-center gap-2 text-sm font-semibold ${tool.accent} hover:underline transition-all`}
                        >
                          {lang === 'es' ? 'Ver proyectos relacionados' : 'See related projects'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        {tool.projectSlug && (
                          <Link
                            to={`/project/${tool.projectSlug}`}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {lang === 'es' ? 'Case study destacado' : 'Featured case study'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
