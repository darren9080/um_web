import type { MetadataRoute } from 'next';
import { PLACEHOLDER_ARTICLES, PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { SITE_URL } from '@/app/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/membership`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/ethics`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = PLACEHOLDER_ARTICLES.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: article.featured ? 0.9 : 0.8,
  }));

  const eventPages: MetadataRoute.Sitemap = PLACEHOLDER_EVENTS.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: new Date(event.startDate),
    changeFrequency: 'weekly' as const,
    priority: event.featured ? 0.85 : 0.75,
  }));

  return [...staticPages, ...articlePages, ...eventPages];
}
