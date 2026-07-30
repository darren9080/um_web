import { notFound } from 'next/navigation';
import { articles as sampleArticles } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import ArticleEditorForm from '@/app/ui/admin/article-editor-form';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { Article } from '@/app/lib/cms/definitions';

type Params = Promise<{ id: string }>;

async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('articles')
      .select('*, author:cms_profiles!author_id(display_name), editor:cms_profiles!editor_id(display_name)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return sampleArticles.find((a) => a.id === id) ?? null;
    }

    return {
      id: data.id,
      title: data.title ?? '',
      slug: data.slug ?? '',
      summary: data.summary ?? '',
      body: data.body ?? '',
      section: data.section ?? '',
      desk: data.desk ?? 'online',
      status: data.status ?? 'draft',
      author: data.author?.display_name ?? '미배정',
      editor: data.editor?.display_name ?? undefined,
      seoKeywords: data.seo_keywords ?? [],
      views: 0,
      likes: 0,
      readDepth: 0,
      reporterAwarenessScore: 0,
      publishedAt: data.published_at ?? undefined,
      updatedAt: data.updated_at ?? '',
      heroImage: data.hero_image_url ?? undefined,
    };
  } catch {
    return sampleArticles.find((a) => a.id === id) ?? null;
  }
}

export default async function EditArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = await fetchArticle(id);

  if (!article) notFound();

  return (
    <>
      <SectionHeader title="기사 수정" description={article.title} />
      <ArticleEditorForm initial={article} />
    </>
  );
}
