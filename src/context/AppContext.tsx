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
    'nav.available': 'Available for BI Consulting',
    
    // Hero
    'hero.title': 'Isabel Carrascal',
    'hero.subtitle': 'Business Intelligence Developer',
    'hero.tagline': 'Data Analytics & BI Solutions',
    'hero.description': 'Transforming complex data into actionable insights. I specialize in designing analytics dashboards, building KPI frameworks, and enabling data-driven decision-making for businesses of all sizes.',
    'hero.cta.projects': 'View Projects',
    'hero.cta.contact': 'Contact Me',
    
    // About
    'about.title': 'About Me',
    'about.intro1': 'As a Business Intelligence Developer with a passion for data analytics, I help organizations unlock the power of their data. With expertise spanning modern BI platforms, data engineering, and visualization best practices, I deliver solutions that are both technically robust and business-focused.',
    'about.intro2': 'My approach combines analytical rigor with design thinking, ensuring that every dashboard, report, and metric serves a clear business purpose and drives actionable outcomes.',
    'about.strength1.title': 'Business Intelligence',
    'about.strength1.desc': 'Designing and implementing BI solutions that drive strategic decisions',
    'about.strength2.title': 'Analytics Engineering',
    'about.strength2.desc': 'Building scalable data pipelines and transformation workflows',
    'about.strength3.title': 'KPI Definition',
    'about.strength3.desc': 'Creating meaningful metrics frameworks aligned with business goals',
    'about.strength4.title': 'Data Storytelling',
    'about.strength4.desc': 'Translating complex data into compelling narratives and insights',
    
    // Skills
    'skills.title': 'Skills & Tech Stack',
    'skills.bi.title': 'BI & Visualization',
    'skills.data.title': 'Data & Engineering',
    'skills.analytics.title': 'Analytics',
    'skills.ux.title': 'Visualization UX',
    
    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Transforming data into actionable insights across diverse industries and business functions',
    'projects.view': 'View Case Study',
    
    'project1.title': 'E-Commerce Revenue Analytics',
    'project1.desc': 'Comprehensive Power BI dashboard tracking revenue, customer lifetime value, and product performance across multiple channels.',
    'project1.impact': '35% increase in data-driven decisions',
    'project1.category': 'BI Dashboard',
    
    'project2.title': 'Marketing Campaign ROI Tracker',
    'project2.desc': 'Real-time Tableau dashboard for tracking campaign performance, conversion rates, and attribution modeling.',
    'project2.impact': 'Optimized $2M ad spend',
    'project2.category': 'Marketing Analytics',
    
    'project3.title': 'Sales Forecasting Model',
    'project3.desc': 'Python-based forecasting model integrated with Looker for predictive sales analytics and inventory planning.',
    'project3.impact': '92% forecast accuracy',
    'project3.category': 'Predictive Analytics',
    
    'project4.title': 'Customer Segmentation Analysis',
    'project4.desc': 'Advanced segmentation dashboard using RFM analysis and behavioral clustering for targeted marketing.',
    'project4.impact': '3x engagement in target segments',
    'project4.category': 'Customer Analytics',
    
    'project5.title': 'Executive KPI Dashboard',
    'project5.desc': 'High-level executive dashboard consolidating key business metrics with drill-down capabilities for detailed analysis.',
    'project5.impact': 'Reduced reporting time by 80%',
    'project5.category': 'Executive Dashboard',
    
    'project6.title': 'Supply Chain Optimization',
    'project6.desc': 'End-to-end supply chain analytics tracking inventory levels, lead times, and supplier performance.',
    'project6.impact': '15% reduction in stockouts',
    'project6.category': 'Operations Analytics',
    
    // Case Study
    'case.title': 'Featured Case Study',
    'case.subtitle': 'E-Commerce Revenue Analytics Dashboard',
    'case.back': 'Back to Projects',
    'case.next': 'Next Case Study',
    
    'case.kpi1': 'Total Revenue',
    'case.kpi2': 'Conversion Rate',
    'case.kpi3': 'Avg Order Value',
    'case.kpi4': 'Customer LTV',
    'case.vs': 'vs last period',
    'case.increase': 'increase',
    'case.improvement': 'improvement',
    'case.growth': 'growth',
    
    'case.chart1': 'Revenue vs Target',
    'case.chart2': 'Traffic by Channel',
    
    'case.problem.title': 'Business Problem',
    'case.problem.desc': 'A mid-sized e-commerce company struggled with fragmented data across multiple platforms, making it difficult to track revenue performance, understand customer behavior, and optimize marketing spend effectively.',
    
    'case.tools.title': 'Data & Tools',
    'case.tools.1': 'Power BI for visualization',
    'case.tools.2': 'SQL Server for data warehouse',
    'case.tools.3': 'Python for data transformation',
    
    'case.kpis.title': 'KPIs & Metrics',
    'case.kpis.1': 'Revenue, AOV, Conversion Rate',
    'case.kpis.2': 'Customer Lifetime Value (LTV)',
    'case.kpis.3': 'Channel attribution & ROI',
    
    'case.impact.title': 'Insights & Impact',
    'case.impact.1': '35% increase in data-driven decisions',
    'case.impact.2': 'Identified $250K in untapped revenue',
    'case.impact.3': 'Reduced reporting time by 80%',
    
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
    'footer.role': 'Business Intelligence Developer',
    'footer.copyright': 'All rights reserved.',
    
    // Chart labels
    'chart.revenue': 'Revenue',
    'chart.target': 'Target',
    'chart.organic': 'Organic Search',
    'chart.paid': 'Paid Ads',
    'chart.social': 'Social Media',
    'chart.direct': 'Direct',
    'chart.referral': 'Referral',
  },
  es: {
    // Navigation
    'nav.available': 'Disponible para Consultoría BI',
    
    // Hero
    'hero.title': 'Isabel Carrascal',
    'hero.subtitle': 'Desarrolladora Business Intelligence',
    'hero.tagline': 'Analítica de Datos & Soluciones BI',
    'hero.description': 'Transformando datos complejos en insights accionables. Me especializo en diseñar dashboards analíticos, construir frameworks de KPIs y habilitar la toma de decisiones basada en datos para empresas de todos los tamaños.',
    'hero.cta.projects': 'Ver Proyectos',
    'hero.cta.contact': 'Contactarme',
    
    // About
    'about.title': 'Sobre Mí',
    'about.intro1': 'Como Desarrolladora de Business Intelligence con pasión por la analítica de datos, ayudo a las organizaciones a desbloquear el poder de sus datos. Con experiencia en plataformas modernas de BI, ingeniería de datos y mejores prácticas de visualización, entrego soluciones técnicamente robustas y enfocadas en el negocio.',
    'about.intro2': 'Mi enfoque combina rigor analítico con pensamiento de diseño, asegurando que cada dashboard, reporte y métrica sirva a un propósito claro del negocio y genere resultados accionables.',
    'about.strength1.title': 'Business Intelligence',
    'about.strength1.desc': 'Diseño e implementación de soluciones BI que impulsan decisiones estratégicas',
    'about.strength2.title': 'Ingeniería Analítica',
    'about.strength2.desc': 'Construcción de pipelines de datos escalables y flujos de transformación',
    'about.strength3.title': 'Definición de KPIs',
    'about.strength3.desc': 'Creación de frameworks de métricas significativas alineadas con objetivos de negocio',
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
    'projects.subtitle': 'Transformando datos en insights accionables en diversas industrias y funciones de negocio',
    'projects.view': 'Ver Caso de Estudio',
    
    'project1.title': 'Analítica de Ingresos E-Commerce',
    'project1.desc': 'Dashboard integral de Power BI rastreando ingresos, valor de vida del cliente y rendimiento de productos en múltiples canales.',
    'project1.impact': '35% de aumento en decisiones basadas en datos',
    'project1.category': 'Dashboard BI',
    
    'project2.title': 'Rastreador ROI de Campañas',
    'project2.desc': 'Dashboard en tiempo real de Tableau para rastrear rendimiento de campañas, tasas de conversión y modelos de atribución.',
    'project2.impact': 'Optimización de $2M en inversión publicitaria',
    'project2.category': 'Analítica de Marketing',
    
    'project3.title': 'Modelo de Pronóstico de Ventas',
    'project3.desc': 'Modelo de pronóstico basado en Python integrado con Looker para analítica predictiva de ventas y planificación de inventario.',
    'project3.impact': '92% de precisión en pronósticos',
    'project3.category': 'Analítica Predictiva',
    
    'project4.title': 'Análisis de Segmentación de Clientes',
    'project4.desc': 'Dashboard avanzado de segmentación usando análisis RFM y clustering comportamental para marketing dirigido.',
    'project4.impact': '3x engagement en segmentos objetivo',
    'project4.category': 'Analítica de Clientes',
    
    'project5.title': 'Dashboard KPI Ejecutivo',
    'project5.desc': 'Dashboard ejecutivo de alto nivel consolidando métricas clave del negocio con capacidades de drill-down para análisis detallado.',
    'project5.impact': '80% de reducción en tiempo de reportes',
    'project5.category': 'Dashboard Ejecutivo',
    
    'project6.title': 'Optimización de Cadena de Suministro',
    'project6.desc': 'Analítica end-to-end de cadena de suministro rastreando niveles de inventario, tiempos de entrega y rendimiento de proveedores.',
    'project6.impact': '15% de reducción en desabastecimiento',
    'project6.category': 'Analítica de Operaciones',
    
    // Case Study
    'case.title': 'Caso de Estudio Destacado',
    'case.subtitle': 'Dashboard de Analítica de Ingresos E-Commerce',
    'case.back': 'Volver a Proyectos',
    'case.next': 'Siguiente Caso de Estudio',
    
    'case.kpi1': 'Ingresos Totales',
    'case.kpi2': 'Tasa de Conversión',
    'case.kpi3': 'Valor Promedio de Pedido',
    'case.kpi4': 'LTV del Cliente',
    'case.vs': 'vs período anterior',
    'case.increase': 'incremento',
    'case.improvement': 'mejora',
    'case.growth': 'crecimiento',
    
    'case.chart1': 'Ingresos vs Meta',
    'case.chart2': 'Tráfico por Canal',
    
    'case.problem.title': 'Problema de Negocio',
    'case.problem.desc': 'Una empresa e-commerce de tamaño medio enfrentaba datos fragmentados en múltiples plataformas, dificultando el seguimiento del rendimiento de ingresos, la comprensión del comportamiento del cliente y la optimización efectiva del gasto en marketing.',
    
    'case.tools.title': 'Datos & Herramientas',
    'case.tools.1': 'Power BI para visualización',
    'case.tools.2': 'SQL Server para almacén de datos',
    'case.tools.3': 'Python para transformación de datos',
    
    'case.kpis.title': 'KPIs & Métricas',
    'case.kpis.1': 'Ingresos, AOV, Tasa de Conversión',
    'case.kpis.2': 'Valor de Vida del Cliente (LTV)',
    'case.kpis.3': 'Atribución de canales & ROI',
    
    'case.impact.title': 'Insights & Impacto',
    'case.impact.1': '35% de aumento en decisiones basadas en datos',
    'case.impact.2': 'Identificación de $250K en ingresos no aprovechados',
    'case.impact.3': '80% de reducción en tiempo de reportes',
    
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
    'footer.role': 'Desarrolladora Business Intelligence',
    'footer.copyright': 'Todos los derechos reservados.',
    
    // Chart labels
    'chart.revenue': 'Ingresos',
    'chart.target': 'Meta',
    'chart.organic': 'Búsqueda Orgánica',
    'chart.paid': 'Anuncios Pagados',
    'chart.social': 'Redes Sociales',
    'chart.direct': 'Directo',
    'chart.referral': 'Referidos',
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Apply theme to document
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
