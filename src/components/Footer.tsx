import { Mail, Linkedin, Github } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Footer() {
  const { t } = useApp();
  
  return (
    <footer className="py-12 px-6 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/20 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 dark:via-pink-600 to-transparent mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Name & Role */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {t('hero.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('footer.role')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:isabel.carrascal@example.com"
              className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/isabelcarrascal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/isabelcarrascal"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-gray-500 dark:text-gray-500 text-sm">
          © {new Date().getFullYear()} {t('hero.title')}. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}