import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useApp } from '../context/AppContext';

// ─── Reemplaza esto con tu clave de Web3Forms ───────────────────────────────
// 1. Ve a https://web3forms.com
// 2. Ingresa isacarrascalcc@gmail.com
// 3. Revisa tu Gmail y copia la clave que te enviaron
// 4. Pégala aquí:
const WEB3FORMS_KEY = '2ed5c1f0-c125-4cbb-b33c-e9d7dae79595';
// ────────────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Contact() {
  const { t, language } = useApp();
  const es = language === 'es';

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio Contact: mensaje de ${formData.name}`,
          from_name: formData.name,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full mb-6" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Info ──────────────────────────────── */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.heading')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {t('contact.intro')}
            </p>

            <div className="space-y-4">
              <a
                href="mailto:contact.isabelcarrascal@gmail.com"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-all border border-pink-100 dark:border-pink-800/30 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">contact.isabelcarrascal@gmail.com</div>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/isabelcarrascal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-all border border-pink-100 dark:border-pink-800/30 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">LinkedIn</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">linkedin.com/in/isabelcarrascal</div>
                </div>
              </a>

              <a
                href="https://github.com/micarrascal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-all border border-pink-100 dark:border-pink-800/30 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">GitHub</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">github.com/micarrascal</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── Form ──────────────────────────────── */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form.title')}
            </h3>

            {/* Success state */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center">
                <CheckCircle className="w-14 h-14 text-emerald-500" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {es ? '¡Mensaje enviado!' : 'Message sent!'}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">
                  {es
                    ? 'Gracias por escribirme. Te respondo a la brevedad posible.'
                    : 'Thanks for reaching out. I\'ll get back to you as soon as possible.'}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 px-6 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  {es ? 'Enviar otro mensaje' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Error banner */}
                {status === 'error' && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {es
                      ? 'Hubo un error al enviar. Intentá de nuevo o escríbeme directamente a isacarrascalcc@gmail.com'
                      : 'Something went wrong. Please try again or email me directly at isacarrascalcc@gmail.com'}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-60"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-60"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none disabled:opacity-60"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {es ? 'Enviando...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      {t('contact.form.submit')}
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
