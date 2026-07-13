import { useEffect } from 'react';

const BASE_URL = 'https://isabelcarrascal.com';
const DEFAULT_TITLE = 'Isabel Carrascal | Data & Analytics Expert for Startups';
const DEFAULT_DESC = 'BI Developer specializing in Power BI, Tableau & Python dashboards for startups. Freelance analytics expert turning data into actionable decisions. Available now.';
const DEFAULT_IMAGE = `${BASE_URL}/foto_isabel.JPG`;

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO(title: string, description: string, canonicalPath = '/') {
  useEffect(() => {
    const url = BASE_URL + canonicalPath;

    document.title = title;

    setMeta('name', 'description', description);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', DEFAULT_IMAGE);

    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', DEFAULT_IMAGE);

    setCanonical(url);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('name', 'description', DEFAULT_DESC);
      setCanonical(BASE_URL + '/');
    };
  }, [title, description, canonicalPath]);
}
