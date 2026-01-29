import { ArrowRight, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Hero() {
  const { t } = useApp();
  
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-pink-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Profile Photo */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-purple-300 dark:from-pink-600 dark:to-purple-600 rounded-full blur-lg opacity-50 dark:opacity-30"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
              <img 
                src="./foto_isabel.JPG"
                alt="Isabel Carrascal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-2 bg-pink-100/60 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium mb-4">
              {t('nav.available')}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4">
              {t('hero.title')}
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              {t('hero.subtitle')}
            </h2>
            
            <p className="text-xl text-pink-600 dark:text-pink-400 mb-8 font-medium">
              {t('hero.tagline')}
            </p>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-10 max-w-2xl">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 justify-center"
              >
                {t('hero.cta.projects')}
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg transition-all flex items-center gap-2 justify-center"
              >
                <Mail className="w-5 h-5" />
                {t('hero.cta.contact')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}