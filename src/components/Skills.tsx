import { BarChart4, Database, TrendingUp, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Skills() {
  const { t } = useApp();
  
  const skillCategories = [
    {
      icon: <BarChart4 className="w-6 h-6" />,
      titleKey: 'skills.bi.title',
      color: "from-pink-500 to-rose-500",
      skills: ["Power BI", "Tableau", "Looker", "Sigma", "Metabase"]
    },
    {
      icon: <Database className="w-6 h-6" />,
      titleKey: 'skills.data.title',
      color: "from-purple-500 to-pink-500",
      skills: ["SQL", "Python", "Snowflake", "BigQuery", "dbt"]
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      titleKey: 'skills.analytics.title',
      color: "from-rose-500 to-purple-500",
      skills: ["KPIs & Metrics", "Forecasting", "Segmentation", "A/B Testing"]
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      titleKey: 'skills.ux.title',
      color: "from-pink-600 to-purple-600",
      skills: ["Dashboard Design", "Data Storytelling", "Interactive Reports", "Executive Summaries"]
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/20 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('skills.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t(category.titleKey)}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:shadow-md transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}