import { Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function Navigation() {
  const { theme, toggleTheme, language, toggleLanguage } = useApp();
  const location = useLocation();
  const isProjects = location.pathname === '/projects';
  const isDashboards = location.pathname === '/dashboards';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo → Home */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          IC
        </Link>

        {/* Center: nav links */}
        <div className="flex items-center gap-1">
          <a
            href="https://blogisabelcarrascal.wordpress.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Blog
          </a>
          <Link
            to="/projects"
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isProjects
                ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Projects
          </Link>
          <Link
            to="/dashboards"
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isDashboards
                ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Dashboards
          </Link>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
