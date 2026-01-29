import { Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navigation() {
  const { theme, toggleTheme, language, toggleLanguage } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Name */}
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          IC
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                language === 'es'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              ES
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
