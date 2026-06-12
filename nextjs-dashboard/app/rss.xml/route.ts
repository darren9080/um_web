import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS } from '@/app/lib/definitions';

const SITE_URL = 'https://iusm.co.kr';
const SITE_TITLE = 'IUSM';
const SITE_DESCRIPTION = '사회·문화·인문·스포츠 미디어 플랫폼';

function rfc822Date(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString().replace('GMT', '+0900');
}

export async function GET() {
  const articles = PLACEHOLDER_ARTICLES;
  const lastBuildDate = rfc822Date(articles[0]?.publishedAt ?? new Date().toISOString());

  const items = articles
    .map((article) => {
      const pubDate = rfc822Date(article.publishedAt);
      const articleUrl = `${SITE_URL}/news/${article.slug}`;
      const categoryLabel = CATEGORY_LABELS[article.category];

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[${article.content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${article.author}]]></dc:creator>
      <category><![CDATA[${categoryLabel}]]></category>
      ${article.thumbnail ? `<enclosure url="${article.thumbnail}" type="image/jpeg" length="0"/>` : ''}
    </item>`.trim();
    })
    .join('\n    ');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko</language>
    <copyright>Copyright © ${new Date().getFullYear()} IUSM. All rights reserved.</copyright>
    <pubDate>${lastBuildDate}</pubDate>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${SITE_TITLE}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
