import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 일반 크롤러
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/seed'],
      },
      // Google 뉴스 크롤러
      {
        userAgent: 'Googlebot-News',
        allow: '/news/',
      },
      // OpenAI (ChatGPT)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Anthropic (Claude)
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Google (AI Overview / Gemini)
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      // Microsoft Bing AI
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
