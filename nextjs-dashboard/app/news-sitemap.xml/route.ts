import { getArticles } from '@/app/lib/synced-articles';
import { SITE_URL } from '@/app/lib/site-config';

// Google 뉴스 사이트맵: 최근 2일 이내 기사만 포함 (Google 정책)
export async function GET() {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const allArticles = await getArticles();
  const articles = allArticles.filter((a) => new Date(a.publishedAt) >= twoDaysAgo);

  const urls = articles
    .map((article) => {
      const pubDate = new Date(article.publishedAt).toISOString();
      return `
  <url>
    <loc>${SITE_URL}/news/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>IUSM</news:name>
        <news:language>ko</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
  </url>`.trim();
    })
    .join('\n  ');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
