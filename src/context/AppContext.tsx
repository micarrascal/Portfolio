import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'es';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.available': 'Available for Analytics Consulting',

    // Hero
    'hero.title': 'Isabel Carrascal',
    'hero.subtitle': 'Data & Analytics Expert',
    'hero.tagline': 'Data Analytics · BI · Open Data',
    'hero.description': "5+ years turning data into decisions that matter. I've delivered data analytics, business intelligence, and data management projects — from data pipelines to interactive dashboards and KPI frameworks — turning complex datasets into clear, actionable narratives.",
    'hero.cta.projects': 'View Projects',
    'hero.cta.contact': 'Contact Me',

    // About
    'about.title': 'About Me',
    'about.intro1': 'As an Analytics Engineer with a passion for data storytelling, I help organizations unlock the power of their data. My expertise spans modern BI platforms, analytics engineering, Python modeling, and open data — from e-commerce revenue analysis to Colombian public datasets.',
    'about.intro2': 'My approach combines analytical rigor with design thinking, ensuring that every dashboard, report, and metric serves a clear business purpose and drives actionable outcomes.',
    'about.strength1.title': 'Analytics Engineering',
    'about.strength1.desc': 'Building scalable data pipelines, models and transformation workflows',
    'about.strength2.title': 'BI & Dashboards',
    'about.strength2.desc': 'Designing interactive dashboards that drive strategic decisions',
    'about.strength3.title': 'Open Data Analysis',
    'about.strength3.desc': 'Exploring Colombian public datasets to surface meaningful insights',
    'about.strength4.title': 'Data Storytelling',
    'about.strength4.desc': 'Translating complex data into compelling narratives and visualizations',

    // Skills
    'skills.title': 'Skills & Tech Stack',
    'skills.bi.title': 'BI & Visualization',
    'skills.data.title': 'Data & Engineering',
    'skills.analytics.title': 'Analytics',
    'skills.ux.title': 'Visualization UX',

    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'From e-commerce analytics to Colombian open data — turning numbers into insights that drive real decisions',
    'projects.view': 'View Case Study',
    'projects.filter.all': 'All Projects',
    'projects.filter.ecommerce': 'E-Commerce',
    'projects.filter.opendata': 'Colombia Open Data',

    'project1.title': 'E-Commerce Revenue Analytics',
    'project1.desc': 'Revenue trend, category performance and a real conversion funnel, built entirely on open datasets: real UK retailer transactions and real cosmetics-store clickstream.',
    'project1.impact': '3.44% real funnel conversion · 17.1% cancellation rate flagged',
    'project1.category': 'E-Commerce Analytics · Real Data',

    'project7.title': 'Bogotá Real Estate Market',
    'project7.desc': 'Interactive choropleth map and dashboard analyzing price per m² across Bogotá\'s 20 localities, national housing sales cycles, and city comparisons.',
    'project7.impact': '19 localities mapped · 5.2× price gap Usaquén vs Ciudad Bolívar',
    'project7.category': 'Real Estate · Real Data',

    'project8.title': 'Colombia in Data',
    'project8.desc': 'Interactive financial inclusion map by department, CPI inflation history, and credit portfolio breakdown for the Colombian financial system.',
    'project8.impact': '33 departments mapped · 2022 inflation peak: 13.12%',
    'project8.category': 'Colombia Open Data · Real Data',

    'project2.title': 'Customer RFM Segmentation',
    'project2.desc': 'Python + BigQuery clustering model segmenting customers by Recency, Frequency, and Monetary value to enable precision retention campaigns.',
    'project2.impact': '3× engagement in target segments · 22% churn reduction',
    'project2.category': 'Customer Analytics',

    'project3.title': 'Marketing Attribution & ROAS',
    'project3.desc': 'Real-time Tableau dashboard connecting Google Ads and Meta APIs to measure multi-touch attribution and ROAS across all paid channels.',
    'project3.impact': '$2M ad spend optimized · ROAS improved 40%',
    'project3.category': 'Marketing Analytics',

    'project4.title': 'Mortgage Credit Analysis — Colombia',
    'project4.desc': 'Analysis of Colombia\'s mortgage market using Superfinanciera data: rate evolution (VIS vs non-VIS), new disbursements by quarter, and the IMIV housing price index from 2018–2023.',
    'project4.impact': 'Rates peaked at 16.5% in 2022 · $95B COP total mortgage portfolio tracked',
    'project4.category': 'Colombia Financial Data',

    'project5.title': 'Household Debt & Credit Risk',
    'project5.desc': 'Comprehensive portfolio quality analysis using Superfinanciera and BanRep data: delinquency by credit modality, household debt-to-GDP evolution, and consumer credit composition.',
    'project5.impact': 'Household debt at 21.3% of GDP · Consumer delinquency: 6.1% IC',
    'project5.category': 'Colombia Financial Data',

    'project6.title': 'Consumption & Inflation Colombia',
    'project6.desc': 'Macro dashboard tracking Colombia\'s CPI by spending group (DANE), real private consumption trends, and the purchasing power gap between minimum wage and basic household basket.',
    'project6.impact': 'IPC peak 13.34% Mar 2023 · Real consumption fell 0.8% in 2023',
    'project6.category': 'Colombia Open Data',

    // Case Study
    'case.title': 'Featured Case Study',
    'case.subtitle': 'Colombia in Data — Real Financial System Data',
    'case.back': 'Back to Projects',
    'case.next': 'Next Case Study',

    // Contact
    'contact.title': "Let's Connect",
    'contact.subtitle': "Interested in working together or discussing BI opportunities? I'd love to hear from you.",
    'contact.heading': 'Get in Touch',
    'contact.intro': "Whether you need a custom BI solution, want to discuss analytics strategy, or are looking to collaborate on a project, I'm always open to new opportunities.",
    'contact.form.title': 'Send a Message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.emailPlaceholder': 'your.email@example.com',
    'contact.form.messagePlaceholder': 'Tell me about your project or inquiry...',
    'contact.form.submit': 'Send Message',
    'contact.form.success': "Thank you for your message! I'll get back to you soon.",

    // Footer
    'footer.role': 'Data & Analytics Expert',
    'footer.copyright': 'All rights reserved.',

  },
  es: {
    // Navigation
    'nav.available': 'Disponible para Consultoría Analítica',

    // Hero
    'hero.title': 'Isabel Carrascal',
    'hero.subtitle': 'Data & Analytics Expert',
    'hero.tagline': 'Analítica de Datos · BI · Datos Abiertos',
    'hero.description': 'Más de 5 años transformando datos en decisiones que importan. He desarrollado proyectos de analítica de datos, inteligencia de negocio y gestión de datos — desde pipelines de datos hasta dashboards interactivos y frameworks de KPIs — convirtiendo datasets complejos en narrativas claras y accionables.',
    'hero.cta.projects': 'Ver Proyectos',
    'hero.cta.contact': 'Contactarme',

    // About
    'about.title': 'Sobre Mí',
    'about.intro1': 'Como Ingeniera Analítica con pasión por la narrativa de datos, ayudo a las organizaciones a desbloquear el poder de sus datos. Mi experiencia abarca plataformas modernas de BI, ingeniería analítica, modelado en Python y datos abiertos — desde análisis de ingresos en e-commerce hasta datasets públicos colombianos.',
    'about.intro2': 'Mi enfoque combina rigor analítico con pensamiento de diseño, asegurando que cada dashboard, reporte y métrica sirva a un propósito claro del negocio y genere resultados accionables.',
    'about.strength1.title': 'Ingeniería Analítica',
    'about.strength1.desc': 'Construcción de pipelines de datos escalables, modelos y flujos de transformación',
    'about.strength2.title': 'BI & Dashboards',
    'about.strength2.desc': 'Diseño de dashboards interactivos que impulsan decisiones estratégicas',
    'about.strength3.title': 'Datos Abiertos',
    'about.strength3.desc': 'Exploración de datasets públicos colombianos para extraer insights significativos',
    'about.strength4.title': 'Narrativa de Datos',
    'about.strength4.desc': 'Traducción de datos complejos en narrativas e insights convincentes',

    // Skills
    'skills.title': 'Habilidades & Stack Tecnológico',
    'skills.bi.title': 'BI & Visualización',
    'skills.data.title': 'Datos & Ingeniería',
    'skills.analytics.title': 'Analítica',
    'skills.ux.title': 'UX de Visualización',

    // Projects
    'projects.title': 'Proyectos Destacados',
    'projects.subtitle': 'Desde analítica e-commerce hasta datos abiertos colombianos — convirtiendo números en insights que impulsan decisiones reales',
    'projects.view': 'Ver Caso de Estudio',
    'projects.filter.all': 'Todos los Proyectos',
    'projects.filter.ecommerce': 'E-Commerce',
    'projects.filter.opendata': 'Datos Abiertos Colombia',

    'project1.title': 'Analítica de Ingresos E-Commerce',
    'project1.desc': 'Tendencia de ingresos, rendimiento por categoría y un embudo de conversión real, construidos 100% sobre datasets abiertos: transacciones reales de un retailer del Reino Unido y clickstream real de una tienda de cosméticos.',
    'project1.impact': '3.44% de conversión real del embudo · 17.1% de tasa de cancelación',
    'project1.category': 'Analítica E-Commerce · Datos Reales',

    'project7.title': 'Mercado Inmobiliario de Bogotá',
    'project7.desc': 'Mapa interactivo y dashboard analizando precio por m² en las 20 localidades de Bogotá, ciclos de ventas de vivienda a nivel nacional, y comparación entre ciudades.',
    'project7.impact': '19 localidades mapeadas · brecha de precio 5.2× Usaquén vs Ciudad Bolívar',
    'project7.category': 'Bienes Raíces · Datos Reales',

    'project8.title': 'Colombia en Datos',
    'project8.desc': 'Mapa interactivo de inclusión financiera por departamento, histórico de inflación IPC, y desglose de cartera de crédito del sistema financiero colombiano.',
    'project8.impact': '33 departamentos mapeados · pico de inflación 2022: 13.12%',
    'project8.category': 'Datos Abiertos Colombia · Datos Reales',

    'project2.title': 'Segmentación RFM de Clientes',
    'project2.desc': 'Modelo de clustering en Python + BigQuery que segmenta clientes por Recencia, Frecuencia y Valor Monetario para campañas de retención de precisión.',
    'project2.impact': '3× engagement en segmentos objetivo · 22% reducción de churn',
    'project2.category': 'Analítica de Clientes',

    'project3.title': 'Atribución de Marketing & ROAS',
    'project3.desc': 'Dashboard en tiempo real de Tableau conectando Google Ads y Meta APIs para medir atribución multi-touch y ROAS en todos los canales de pago.',
    'project3.impact': '$2M en inversión optimizada · ROAS mejorado 40%',
    'project3.category': 'Analítica de Marketing',

    'project4.title': 'Crédito Hipotecario en Colombia',
    'project4.desc': 'Análisis del mercado hipotecario colombiano con datos de la Superfinanciera: evolución de tasas VIS vs no VIS, desembolsos trimestrales e índice de Precios de Vivienda Nueva (IMIV) 2018–2023.',
    'project4.impact': 'Tasas alcanzaron 16,5% en 2022 · Cartera hipotecaria total de $95B COP rastreada',
    'project4.category': 'Datos Financieros Colombia',

    'project5.title': 'Endeudamiento y Riesgo de Cartera',
    'project5.desc': 'Análisis integral de calidad de cartera con datos de Superfinanciera y BanRep: morosidad por modalidad, evolución del endeudamiento de hogares como % del PIB, y composición del crédito de consumo.',
    'project5.impact': 'Deuda hogares en 21,3% del PIB · IC consumo: 6,1% · Cobertura: 95,6%',
    'project5.category': 'Datos Financieros Colombia',

    'project6.title': 'Consumo Privado e Inflación Colombia',
    'project6.desc': 'Dashboard macro rastreando el IPC de Colombia por grupos de gasto (DANE), tendencias del consumo privado real, y la brecha de poder adquisitivo entre el salario mínimo y la canasta básica familiar.',
    'project6.impact': 'Pico IPC 13,34% Mar 2023 · Consumo real cayó 0,8% en 2023',
    'project6.category': 'Datos Abiertos Colombia',

    // Case Study
    'case.title': 'Caso de Estudio Destacado',
    'case.subtitle': 'Colombia en Datos — Datos Reales del Sistema Financiero',
    'case.back': 'Volver a Proyectos',
    'case.next': 'Siguiente Caso de Estudio',

    // Contact
    'contact.title': 'Conectemos',
    'contact.subtitle': '¿Interesado en trabajar juntos o discutir oportunidades de BI? Me encantaría saber de ti.',
    'contact.heading': 'Ponte en Contacto',
    'contact.intro': 'Ya sea que necesites una solución BI personalizada, quieras discutir estrategia analítica o estés buscando colaborar en un proyecto, siempre estoy abierta a nuevas oportunidades.',
    'contact.form.title': 'Enviar un Mensaje',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.message': 'Mensaje',
    'contact.form.namePlaceholder': 'Tu nombre',
    'contact.form.emailPlaceholder': 'tu.correo@ejemplo.com',
    'contact.form.messagePlaceholder': 'Cuéntame sobre tu proyecto o consulta...',
    'contact.form.submit': 'Enviar Mensaje',
    'contact.form.success': '¡Gracias por tu mensaje! Te responderé pronto.',

    // Footer
    'footer.role': 'Data & Analytics Expert',
    'footer.copyright': 'Todos los derechos reservados.',

  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
