import type { MetadataRoute } from 'next';
import { insightSlugs } from '@/lib/content';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/faq', '/privacy-policy', '/insights'];

  return [
    ...routes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: now,
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.7
    })),
    ...insightSlugs.map((slug) => ({
      url: `${site.url}/insights/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ];
}
