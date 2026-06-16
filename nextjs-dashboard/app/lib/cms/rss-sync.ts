import { XMLParser } from 'fast-xml-parser';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { ArticleCategory } from '@/app/lib/definitions';

// NSP 카테고리 → 내부 카테고리 매핑
const CATEGORY_MAP: Record<string, ArticleCategory> = {
  '사회': 'society',
  '정치': 'society',
  '행정': 'society',
  '문화': 'culture',
  '예술': 'culture',
  '인문': 'humanities',
  '인문학': 'humanities',
  '스포츠': 'sports',
  '체육': 'sports',
  '스타트업': 'startup',
  '창업': 'startup',
  '비즈니스': 'business',
  '경제': 'business',
  '산업': 'business',
};

function mapCategory(raw: string | string[]): ArticleCategory {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return CATEGORY_MAP[String(value ?? '').trim()] ?? 'society';
}

function extractIdxno(link: string): number | null {
  const match = String(link).match(/idxno=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return String((value as Record<string, unknown>)['#text'] ?? '');
  }
  return String(value ?? '');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

export interface SyncResult {
  total: number;
  upserted: number;
  errors: number;
  durationMs: number;
}

export async function syncRSS(feedUrl: string): Promise<SyncResult> {
  const startTime = Date.now();

  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'UlsanMaeil-RSSBot/1.0' },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    cdataPropName: '__cdata',
    parseTagValue: false,
  });

  const parsed = parser.parse(xml);
  const rawItems: unknown[] =
    parsed?.rss?.channel?.item ??
    parsed?.feed?.entry ??
    [];

  const items = Array.isArray(rawItems) ? rawItems : [rawItems];
  const supabase = getSupabaseAdmin();
  let upserted = 0;
  let errors = 0;

  for (const item of items as Record<string, unknown>[]) {
    try {
      const link = extractText(item.link ?? item.id ?? '');
      const idxno = extractIdxno(link);
      if (!idxno) continue;

      // 썸네일: enclosure, media:thumbnail, media:content 순서로 시도
      const enclosure = item['enclosure'] as Record<string, string> | undefined;
      const mediaThumbnail = item['media:thumbnail'] as Record<string, string> | undefined;
      const mediaContent = item['media:content'] as Record<string, string> | undefined;
      const thumbnail =
        enclosure?.['@_url'] ??
        mediaThumbnail?.['@_url'] ??
        mediaContent?.['@_url'] ??
        null;

      const rawDescription = extractText(
        (item['description'] as unknown) ??
        (item['summary'] as unknown) ??
        '',
      );

      // pubDate 파싱 (KST 포함)
      const pubDateRaw = extractText(item.pubDate ?? item.published ?? '');
      const publishedAt = pubDateRaw ? new Date(pubDateRaw).toISOString() : null;

      const updatedRaw = extractText(item.lastBuildDate ?? item.updated ?? '');
      const cmsUpdatedAt = updatedRaw ? new Date(updatedRaw).toISOString() : null;

      const record = {
        idxno,
        title: extractText(item.title).trim(),
        excerpt: stripHtml(rawDescription).slice(0, 500),
        category: mapCategory(item.category as string | string[]),
        author: extractText(item.author ?? item['dc:creator'] ?? '')
          .replace(/\s*기자\s*$/, '')
          .trim(),
        thumbnail_url: thumbnail,
        source_url: link || null,
        published_at: publishedAt,
        cms_updated_at: cmsUpdatedAt,
        synced_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('synced_articles')
        .upsert(record, { onConflict: 'idxno' });

      if (error) {
        console.error(`[rss-sync] upsert error idxno=${idxno}:`, error.message);
        errors++;
      } else {
        upserted++;
      }
    } catch (err) {
      console.error('[rss-sync] item parse error:', err);
      errors++;
    }
  }

  const durationMs = Date.now() - startTime;

  // 동기화 로그 기록
  await supabase.from('rss_sync_logs').insert({
    feed_url: feedUrl,
    total: items.length,
    upserted,
    errors,
    duration_ms: durationMs,
  });

  return { total: items.length, upserted, errors, durationMs };
}
