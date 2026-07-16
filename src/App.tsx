import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { CaseStudy } from './components/CaseStudy';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useSEO } from './hooks/useSEO';

import EcommerceRevenuePage from './pages/EcommerceRevenuePage';
import CustomerRFMPage from './pages/CustomerRFMPage';
import MarketingAttributionPage from './pages/MarketingAttributionPage';
import CreditoHipotecarioPage from './pages/CreditoHipotecarioPage';
import EndeudamientoPage from './pages/EndeudamientoPage';
import ConsumoInflacionPage from './pages/ConsumoInflacionPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import CVPage from './pages/CVPage';
import ProjectsPage from './pages/ProjectsPage';
import ColombiaPage from './pages/ColombiaPage';
import BancosPage from './pages/BancosPage';
import DashboardsPage from './pages/DashboardsPage';
import BogotaRealEstatePage from './pages/BogotaRealEstatePage';

function Home() {
  useSEO(
    'Isabel Carrascal | Data & Analytics Expert for Startups',
    'Data & Analytics Expert specializing in Power BI, Tableau & Python dashboards for startups. Turning data into actionable decisions. Available for freelance.',
    '/'
  );
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <CaseStudy />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/ecommerce-revenue" element={<EcommerceRevenuePage />} />
        <Route path="/project/customer-rfm" element={<CustomerRFMPage />} />
        <Route path="/project/marketing-attribution" element={<MarketingAttributionPage />} />
        <Route path="/project/credito-hipotecario" element={<CreditoHipotecarioPage />} />
        <Route path="/project/endeudamiento" element={<EndeudamientoPage />} />
        <Route path="/project/consumo-inflacion" element={<ConsumoInflacionPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/cv" element={<CVPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/colombia" element={<ColombiaPage />} />
        <Route path="/bancos" element={<BancosPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/real-estate" element={<BogotaRealEstatePage />} />
      </Routes>
    </AppProvider>
  );
}
