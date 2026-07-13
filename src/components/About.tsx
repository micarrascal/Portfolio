import { TrendingUp, Database, BarChart3, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function About() {
  const { t } = useApp();
  
  const strengths = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      titleKey: 'about.strength1.title',
      descKey: 'about.strength1.desc'
    },
    {
      icon: <Database className="w-6 h-6" />,
      titleKey: 'about.strength2.title',
      descKey: 'about.strength2.desc'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      titleKey: 'about.strength3.title',
      descKey: 'about.strength3.desc'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      titleKey: 'about.strength4.title',
      descKey: 'about.strength4.desc'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto text-center mb-6">
            {t('about.intro1')}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto text-center">
            {t('about.intro2')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strengths.map((strength, index) => (
            <div 
              key={index}
              className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl border border-pink-100 dark:border-pink-800/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4 shadow-md">
                {strength.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t(strength.titleKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(strength.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}