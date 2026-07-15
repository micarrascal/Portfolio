import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { ColombiaData } from '../components/ColombiaData';
import { useSEO } from '../hooks/useSEO';

export default function ColombiaPage() {
  useSEO(
    'Colombia en Datos | Isabel Carrascal',
    'Interactive visualizations of the Colombian financial system: bancarization map, CPI inflation history, and credit portfolio by type.',
    '/colombia'
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <div className="pt-20">
        <ColombiaData />
      </div>
      <Footer />
    </div>
  );
}
