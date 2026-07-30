'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { requirePermission, getCurrentProfileId } from '@/app/lib/actions/guard';
import { generateProofreadSuggestions, type ProofreadResult } from '@/app/lib/cms/ai';
import type { ArticleStatus } from '@/app/lib/cms/definitions';

function slugify(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `article-${Date.now()}`;
}

function parseArticleFormData(formData: FormData) {
  const title = (formData.get('title') as string) ?? '';
  return {
    title,
    slug: (formData.get('slug') as string) || slugify(title),
    summary: (formData.get('summary') as string) || '',
    body: (formData.get('body') as string) || '',
    section: (formData.get('section') as string) || '',
    desk: (formData.get('desk') as string) || 'online',
    seo_title: (formData.get('seo_title') as string) || null,
    meta_description: (formData.get('meta_description') as string) || null,
    seo_keywords: ((formData.get('seo_keywords') as string) || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    hero_image_url: (formData.get('hero_image_url') as string) || null,
    hero_image_alt: (formData.get('hero_image_alt') as string) || null,
  };
}

export async function createArticle(formData: FormData) {
  const { userEmail } = await requirePermission('articles.create');
  const data = parseArticleFormData(formData);

  if (!data.title || !data.section) {
    throw new Error('제목과 섹션은 필수 항목입니다.');
  }

  const authorId = await getCurrentProfileId(userEmail);

  const { data: inserted, error } = await getSupabaseAdmin()
    .from('articles')
    .insert({ ...data, author_id: authorId })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating article:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/articles');
  return inserted.id as string;
}

export async function updateArticle(id: string, formData: FormData) {
  const { userEmail } = await requirePermission('articles.update');
  const data = parseArticleFormData(formData);

  if (!data.title || !data.section) {
    throw new Error('제목과 섹션은 필수 항목입니다.');
  }

  const editorId = await getCurrentProfileId(userEmail);

  const { error } = await getSupabaseAdmin()
    .from('articles')
    .update({ ...data, editor_id: editorId, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating article:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/articles');
  revalidatePath(`/admin/articles/${id}/edit`);
}

export async function deleteArticle(id: string) {
  await requirePermission('articles.update');

  const { error } = await getSupabaseAdmin().from('articles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/articles');
}

// 상태 전이는 구조적으로만 검증한다 — 편집국의 실제 기사 데스크 규칙(누가 어떤
// 전이를 승인할 수 있는지)은 Phase 3(기사 데스크)에서 desk_queue와 함께 정의한다.
const ALLOWED_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> = {
  draft: ['copyediting', 'archived'],
  copyediting: ['desk_review', 'draft', 'archived'],
  desk_review: ['scheduled', 'published', 'copyediting', 'archived'],
  scheduled: ['published', 'desk_review', 'archived'],
  published: ['archived'],
  archived: ['draft'],
};

export async function updateArticleStatus(id: string, status: ArticleStatus) {
  await requirePermission('articles.publish');

  const { data: current, error: fetchError } = await getSupabaseAdmin()
    .from('articles')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    throw new Error('기사를 찾을 수 없습니다.');
  }

  const currentStatus = current.status as ArticleStatus;
  if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(status)) {
    throw new Error(`'${currentStatus}' 상태에서 '${status}'(으)로 전환할 수 없습니다.`);
  }

  const patch: Record<string, unknown> = { status };
  if (status === 'published') {
    patch.published_at = new Date().toISOString();
  }

  const { error } = await getSupabaseAdmin().from('articles').update(patch).eq('id', id);

  if (error) {
    console.error('Error updating article status:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/articles');
  revalidatePath(`/admin/articles/${id}/edit`);
}

export async function checkArticleProofreading(articleId: string): Promise<ProofreadResult> {
  await requirePermission('articles.correct');

  const { data: article, error } = await getSupabaseAdmin()
    .from('articles')
    .select('body')
    .eq('id', articleId)
    .single();

  if (error || !article) {
    throw new Error('기사를 찾을 수 없습니다.');
  }

  if (!article.body) {
    throw new Error('본문이 비어 있어 오탈자 점검을 할 수 없습니다.');
  }

  return generateProofreadSuggestions(article.body);
}
