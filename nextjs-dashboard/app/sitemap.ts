import type { MetadataRoute } from 'next';
import { PLACEHOLDER_ARTICLES, PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { DATASETS } from '@/app/lib/datasets-data';
import { TOPICS } from '@/app/lib/topics-data';
import { JOURNALISTS } from '@/app/lib/journalists-data';
import { MARATHON_RACES, COMMUNITY_POSTS } from '@/app/lib/marathon-data';
import { SITE_URL } from '@/app/lib/site-config';

const MARATHON_URL = SITE_URL.replace('://', '://marathon.');

// '2025-Q1', '2024' 등 파싱 불가 값 대비 안전 파서
function safeDate(value: string, fallback: Date): Date {
  const d = new Date(value);
  return isNaN(d.getTime()) ? fallback : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/data`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/topics`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/journalists`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/membership`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/trust`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/advertising`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/ethics`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/ai-guidelines`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
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

  const datasetPages: MetadataRoute.Sitemap = DATASETS.map((d) => ({
    url: `${SITE_URL}/data/${d.slug}`,
    lastModified: safeDate(d.referenceDate, now),
    changeFrequency: d.updateCycle === 'daily' ? 'daily' as const : 'weekly' as const,
    priority: 0.8,
  }));

  const topicPages: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${SITE_URL}/topics/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const peoplePages: MetadataRoute.Sitemap = JOURNALISTS.flatMap((j) => [
    { url: `${SITE_URL}/journalists/${j.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${SITE_URL}/people/${j.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
  ]);

  // 마라톤 서브도메인
  const marathonPages: MetadataRoute.Sitemap = [
    { url: `${MARATHON_URL}/marathon`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${MARATHON_URL}/marathon/records`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${MARATHON_URL}/marathon/archive`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${MARATHON_URL}/marathon/community`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    ...MARATHON_RACES.map((r) => ({
      url: `${MARATHON_URL}/marathon/${r.year}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: r.status === 'open' ? 0.8 : 0.5,
    })),
    ...COMMUNITY_POSTS.map((p) => ({
      url: `${MARATHON_URL}/marathon/community/${p.id}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ];

  return [
    ...staticPages,
    ...articlePages,
    ...eventPages,
    ...datasetPages,
    ...topicPages,
    ...peoplePages,
    ...marathonPages,
  ];
}
