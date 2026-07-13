import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { getAllPosts, formatDate } from '../blog/utils';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';

export default function BlogListPage() {
  const { language } = useApp();
  const es = language === 'es';
  const posts = getAllPosts();

  useSEO(
    es
      ? 'Blog – BI, Dashboards y Analytics | Isabel Carrascal'
      : 'Blog – BI, Dashboards & Analytics | Isabel Carrascal',
    es
      ? 'Artículos prácticos sobre Power BI, Tableau, analytics engineering y dashboards. Estrategias de datos para startups y empresas tech.'
      : 'Practical articles on Power BI, Tableau, analytics engineering and dashboards. Data strategies for startups and tech companies.',
    '/blog'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      {/* ── Header ─────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 bg-gradient-to-br from-pink-50/60 via-purple-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-wide mb-5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
            {es ? 'Blog de Analytics' : 'Analytics Blog'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {es ? 'BI, Dashboards y Analytics' : 'BI, Dashboards & Analytics'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            {es
              ? 'Artículos prácticos sobre herramientas de BI, estrategias de datos y cómo construir dashboards que realmente mueven el negocio.'
              : 'Practical articles on BI tools, data strategy, and how to build dashboards that actually move the business forward.'}
          </p>
        </div>
      </section>

      {/* ── Post list ──────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-20">
              {es ? 'Próximamente...' : 'Coming soon...'}
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group relative bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <Link to={`/blog/${post.slug}`} className="block p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-gray-700 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5 text-[0.9375rem]">
                      {post.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.date, es ? 'es-CO' : 'en-US')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} {es ? 'min de lectura' : 'min read'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-pink-600 dark:text-pink-400 group-hover:gap-2 transition-all">
                        {es ? 'Leer' : 'Read'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
