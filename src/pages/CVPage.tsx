import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CV_URL = '/isabel-carrascal-cv.pdf';

export default function CVPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

      {/* ── Header bar ─────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          isabelcarrascal.com
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Isabel Carrascal</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Data & Analytics Expert</p>
        </div>

        <a
          href={CV_URL}
          download="Isabel-Carrascal-CV.pdf"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>

      {/* ── PDF viewer ─────────────────────────── */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto h-full">
          <iframe
            src={CV_URL}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white"
            style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}
            title="Isabel Carrascal — CV"
          />
        </div>
      </div>

    </div>
  );
}
