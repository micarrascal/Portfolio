import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const projects = [
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

export function Projects() {
  const { t } = useApp();

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900" id="projects">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ─────────────────────── */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-600"
            >
              {/* Category badge */}
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold mb-4">
                {t(project.categoryKey)}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                {t(project.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {t(project.descKey)}
              </p>

              {/* Impact */}
              <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30">
                <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                  {t(project.impactKey)}
                </p>
              </div>

              {/* Tags */}
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

              {/* CTA */}
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                {t('projects.view')}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
