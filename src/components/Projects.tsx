import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ParticleText } from './ParticleText';

// Only real-data projects are featured here for now. The other project
// pages (customer-rfm, marketing-attribution, credito-hipotecario,
// endeudamiento, consumo-inflacion) still use fabricated placeholder
// numbers and are intentionally left out of this grid until they're
// rebuilt on real open data too — see PAUSED_PROJECTS below.
const projects = [
  {
    id: 1, path: '/project/ecommerce-revenue',
    titleKey: 'project1.title', descKey: 'project1.desc',
    impactKey: 'project1.impact', categoryKey: 'project1.category',
    tags: ['Python', 'pandas', 'Real Open Data'],
  },
  {
    id: 7, path: '/real-estate',
    titleKey: 'project7.title', descKey: 'project7.desc',
    impactKey: 'project7.impact', categoryKey: 'project7.category',
    tags: ['Python', 'GeoJSON', 'Choropleth Map'],
  },
  {
    id: 8, path: '/colombia',
    titleKey: 'project8.title', descKey: 'project8.desc',
    impactKey: 'project8.impact', categoryKey: 'project8.category',
    tags: ['Python', 'DANE', 'Choropleth Map'],
  },
];

// Paused pending a real-data rebuild (same treatment as ecommerce-revenue):
// { id: 2, path: '/project/customer-rfm', titleKey: 'project2.title', ... },
// { id: 3, path: '/project/marketing-attribution', titleKey: 'project3.title', ... },
// { id: 4, path: '/project/credito-hipotecario', titleKey: 'project4.title', ... },
// { id: 5, path: '/project/endeudamiento', titleKey: 'project5.title', ... },
// { id: 6, path: '/project/consumo-inflacion', titleKey: 'project6.title', ... },

export function Projects() {
  const { t } = useApp();

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900" id="projects">
      <div className="max-w-6xl mx-auto">

        {/* ── Particle divider ───────────────────── */}
        <div className="h-24 md:h-32 mb-6">
          <ParticleText text="Projects" fontSize={130} revealOnScroll className="w-full h-full" />
        </div>

        {/* ── Section header ─────────────────────── */}
        <div className="text-center mb-16">
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
              to={project.path}
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
