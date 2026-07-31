import { getSupabaseAdmin } from '@/app/lib/supabase';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import type { Article, ArticleCategory } from '@/app/lib/definitions';

// Phase 1 런칭 데이터 소스: RSS로 동기화된 synced_articles가 진짜 콘텐츠다.
// 아직 비어 있거나(런칭 전) 연결이 끊기면 PLACEHOLDER_ARTICLES로 조용히
// 대체한다 — 이 프로젝트 전반에서 쓰는 fetch+fallback 패턴과 동일하다.
//
// synced_articles.idxno가 legacy CMS의 기사 ID이자 이 사이트의 slug다
// (next.config.ts의 /news/articleView.html?idxno=N → /news/N 리다이렉트와
// 짝을 이룬다).
//
// body_html은 RSS만으로는 채워지지 않는다(추후 크롤링/FTP 예정 — 002 마이그레이션
// 주석 참고) — 지금은 항상 빈 문자열이라고 가정하고, content가 비어 있으면
// 소비하는 페이지가 excerpt + 원문 링크(sourceUrl)로 대체 표시해야 한다.

type SyncedRow = {
  idxno: number;
  title: string;
  excerpt: string;
  body_html: string;
  category: string;
  author: string;
  thumbnail_url: string | null;
  source_url: string | null;
  tags: string[] | null;
  published_at: string | null;
  synced_at: string;
};

function mapRow(row: SyncedRow): Article {
  return {
    id: String(row.idxno),
    slug: String(row.idxno),
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.body_html || '',
    thumbnail: row.thumbnail_url || '/opengraph-image.png',
    category: row.category as ArticleCategory,
    author: row.author || '편집국',
    publishedAt: row.published_at ?? row.synced_at,
    readTime: Math.max(1, Math.round((row.excerpt || '').length / 200)),
    tags: row.tags ?? [],
    featured: false,
    premium: false,
    sourceUrl: row.source_url ?? undefined,
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('synced_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(200);

    if (error || !data || data.length === 0) return PLACEHOLDER_ARTICLES;
    return data.map(mapRow);
  } catch {
    return PLACEHOLDER_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const idxno = Number(slug);
  if (Number.isInteger(idxno)) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('synced_articles')
        .select('*')
        .eq('idxno', idxno)
        .maybeSingle();

      if (!error && data) return mapRow(data);
    } catch {
      // Supabase 연결 실패 — 아래 플레이스홀더 조회로 폴백
    }
  }

  return PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
}
