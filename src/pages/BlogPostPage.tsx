import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { getPostBySlug, formatDate } from '../blog/utils';
import { useSEO } from '../hooks/useSEO';
import { useApp } from '../context/AppContext';

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-12 mb-5 text-gray-900 dark:text-white leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white leading-tight border-b border-gray-100 dark:border-gray-800 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[1.0625rem] text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 ml-5 space-y-2 list-disc list-outside text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 ml-5 space-y-2 list-decimal list-outside text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[1.0625rem] leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-pink-600 dark:text-pink-400 underline underline-offset-2 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className={`${className ?? ''} text-sm font-mono`}>{children}</code>
      );
    }
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-[0.875em] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-xl p-5 mb-6 overflow-x-auto text-sm font-mono leading-relaxed border border-gray-800">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-pink-400 dark:border-pink-600 pl-5 py-1 my-6 bg-pink-50 dark:bg-pink-900/10 rounded-r-xl text-gray-600 dark:text-gray-400 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-gray-200 dark:border-gray-800 my-10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="rounded-xl w-full object-cover my-6 border border-gray-100 dark:border-gray-800"
    />
  ),
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const es = language === 'es';

  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  useSEO(
    post ? `${post.title} | Isabel Carrascal` : 'Post not found | Isabel Carrascal',
    post?.description ?? '',
    `/blog/${slug ?? ''}`
  );

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 pt-48 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
            {es ? 'Artículo no encontrado.' : 'Article not found.'}
          </p>
          <Link
            to="/blog"
            className="text-pink-600 dark:text-pink-400 font-semibold hover:underline"
          >
            {es ? '← Volver al Blog' : '← Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />

      {/* ── Article header ─────────────────────── */}
      <header className="pt-32 pb-12 px-6 bg-gradient-to-br from-pink-50/50 via-white to-white dark:from-gray-900 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {es ? 'Blog' : 'Blog'}
          </button>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-5 text-sm text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date, es ? 'es-CO' : 'en-US')}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} {es ? 'min de lectura' : 'min read'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Article body ───────────────────────── */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* ── Footer CTA ─────────────────────────── */}
      <div className="py-14 px-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
          {es
            ? '¿Tienes un proyecto de BI o analytics? '
            : 'Have a BI or analytics project? '}
          <Link
            to="/#contact"
            className="underline text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            {es ? 'Escríbeme' : 'Get in touch'}
          </Link>
        </p>
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-md transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {es ? 'Ver todos los artículos' : 'All articles'}
        </button>
      </div>

      <Footer />
    </div>
  );
}
