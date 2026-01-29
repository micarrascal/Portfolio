import { ExternalLink, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Projects() {
  const { t } = useApp();
  
  const projects = [
    {
      titleKey: 'project1.title',
      descKey: 'project1.desc',
      tags: ["Power BI", "SQL", "Revenue Analytics"],
      categoryKey: 'project1.category',
      impactKey: 'project1.impact',
      id: 1
    },
    {
      titleKey: 'project2.title',
      descKey: 'project2.desc',
      tags: ["Tableau", "Marketing Analytics", "Attribution"],
      categoryKey: 'project2.category',
      impactKey: 'project2.impact',
      id: 2
    },
    {
      titleKey: 'project3.title',
      descKey: 'project3.desc',
      tags: ["Python", "Looker", "Forecasting"],
      categoryKey: 'project3.category',
      impactKey: 'project3.impact',
      id: 3
    },
    {
      titleKey: 'project4.title',
      descKey: 'project4.desc',
      tags: ["Snowflake", "Power BI", "Segmentation"],
      categoryKey: 'project4.category',
      impactKey: 'project4.impact',
      id: 4
    },
    {
      titleKey: 'project5.title',
      descKey: 'project5.desc',
      tags: ["Sigma", "BigQuery", "Executive Reporting"],
      categoryKey: 'project5.category',
      impactKey: 'project5.impact',
      id: 5
    },
    {
      titleKey: 'project6.title',
      descKey: 'project6.desc',
      tags: ["Tableau", "SQL", "Operations"],
      categoryKey: 'project6.category',
      impactKey: 'project6.impact',
      id: 6
    }
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              onClick={() => document.getElementById('case-study')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-600 cursor-pointer"
            >
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold mb-4">
                {t(project.categoryKey)}
              </div>

              {/* Project Title */}
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
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* View Details Link */}
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium text-sm group-hover:gap-3 transition-all">
                {t('projects.view')}
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}