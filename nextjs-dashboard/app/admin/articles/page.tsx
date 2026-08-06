import { articles as sampleArticles } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import ArticlesManager from '@/app/ui/admin/articles-manager';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { Article, PressRelease } from '@/app/lib/cms/definitions';

async function fetchArticles(): Promise<Article[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('articles')
      .select('*, author:cms_profiles!author_id(display_name), editor:cms_profiles!editor_id(display_name)')
      .order('updated_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return sampleArticles;
    }

    return data.map((row): Article => ({
      id: row.id,
      title: row.title ?? '',
      slug: row.slug ?? '',
      summary: row.summary ?? '',
      body: row.body ?? '',
      section: row.section ?? '',
      desk: row.desk ?? 'online',
      status: row.status ?? 'draft',
      author: row.author?.display_name ?? '미배정',
      editor: row.editor?.display_name ?? undefined,
      similarityScore: undefined,
      seoKeywords: row.seo_keywords ?? [],
      views: 0,
      likes: 0,
      readDepth: 0,
      reporterAwarenessScore: 0,
      publishedAt: row.published_at ?? undefined,
      updatedAt: row.updated_at ?? '',
      heroImage: row.hero_image_url ?? undefined,
    }));
  } catch {
    return sampleArticles;
  }
}

async function fetchPressReleases(): Promise<PressRelease[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('press_releases')
      .select('id, title, body, source, created_at')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row): PressRelease => ({
      id: row.id,
      title: row.title ?? '',
      body: row.body ?? '',
      source: row.source ?? undefined,
      createdAt: row.created_at ?? '',
    }));
  } catch {
    return [];
  }
}

export default async function ArticlesPage() {
  const [articles, pressReleases] = await Promise.all([fetchArticles(), fetchPressReleases()]);

  return (
    <>
      <SectionHeader
        title="기사 작성"
        description="기사 작성, 수정, 오탈자 교정, 보도자료 기반 초안 생성, 유사도 측정, SEO 추천을 한 화면에서 처리하는 편집 워크스페이스입니다."
      />
      <ArticlesManager initialArticles={articles} initialPressReleases={pressReleases} />
    </>
  );
}
