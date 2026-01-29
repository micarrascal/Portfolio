import { Target, Database, TrendingUp, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

export function CaseStudy() {
  const { t, theme } = useApp();
  
  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 42000 },
    { month: 'Feb', revenue: 52000, target: 48000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 68000, target: 60000 },
    { month: 'Jun', revenue: 75000, target: 65000 },
  ];

  const channelData = [
    { name: t('chart.organic'), value: 35 },
    { name: t('chart.paid'), value: 28 },
    { name: t('chart.social'), value: 20 },
    { name: t('chart.direct'), value: 12 },
    { name: t('chart.referral'), value: 5 },
  ];

  const COLORS = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fbcfe8'];
  
  // Chart colors based on theme
  const chartColors = {
    text: theme === 'dark' ? '#d1d5db' : '#6b7280',
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gray-50 via-pink-50/30 to-purple-50/20 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900" id="case-study">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('case.back')}
          </button>
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            {t('case.next')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('case.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500 mx-auto rounded-full mb-6"></div>
          <h3 className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
            {t('case.subtitle')}
          </h3>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100 dark:border-gray-800">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{t('case.kpi1')}</div>
              <div className="text-3xl font-bold">$349K</div>
              <div className="text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+24% {t('case.vs')}</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{t('case.kpi2')}</div>
              <div className="text-3xl font-bold">3.8%</div>
              <div className="text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+0.6% {t('case.increase')}</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-500 to-purple-500 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{t('case.kpi3')}</div>
              <div className="text-3xl font-bold">$127</div>
              <div className="text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+$15 {t('case.improvement')}</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl text-white">
              <div className="text-sm opacity-90 mb-2">{t('case.kpi4')}</div>
              <div className="text-3xl font-bold">$892</div>
              <div className="text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+18% {t('case.growth')}</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('case.chart1')}</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" stroke={chartColors.text} />
                  <YAxis stroke={chartColors.text} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} name={t('chart.revenue')} />
                  <Line type="monotone" dataKey="target" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" name={t('chart.target')} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('case.chart2')}</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Case Study Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Problem */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('case.problem.title')}</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('case.problem.desc')}
            </p>
          </div>

          {/* Data & Tools */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('case.tools.title')}</h4>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.tools.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.tools.2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.tools.3')}</span>
              </li>
            </ul>
          </div>

          {/* KPIs & Metrics */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('case.kpis.title')}</h4>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.kpis.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.kpis.2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.kpis.3')}</span>
              </li>
            </ul>
          </div>

          {/* Insights & Impact */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('case.impact.title')}</h4>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.impact.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.impact.2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{t('case.impact.3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
