import type { Post, PostMeta } from './types';

function parseFrontmatter(raw: string): { meta: PostMeta; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {} as PostMeta, content: raw };

  const fmStr = match[1];
  const content = match[2];
  const meta: Record<string, string | string[]> = {};

  for (const line of fmStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx <= 0) continue;
    const key = line.slice(0, colonIdx).trim();
    const raw = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (key === 'tags') {
      meta[key] = raw
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = raw;
    }
  }

  return { meta: meta as unknown as PostMeta, content };
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

let _cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (_cache) return _cache;

  const modules = import.meta.glob<string>('./posts/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  _cache = Object.values(modules)
    .map((raw) => {
      const { meta, content } = parseFrontmatter(raw);
      return { ...meta, content, readingTime: readingTime(content) } as Post;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return _cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string, locale = 'en-US'): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
