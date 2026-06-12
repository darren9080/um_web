import type { MetadataRoute } from 'next';

const SITE_URL = 'https://iusm.co.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/seed'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/news/',
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
  };
}
