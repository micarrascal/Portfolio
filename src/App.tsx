import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { CaseStudy } from './components/CaseStudy';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}