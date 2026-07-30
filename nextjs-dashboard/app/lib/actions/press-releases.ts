'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { requirePermission, getCurrentProfileId } from '@/app/lib/actions/guard';
import { createEmbedding, generateArticleDraft, measurePressReleaseSimilarity } from '@/app/lib/cms/ai';

function slugify(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `article-${Date.now()}`;
}

// 1차 스코프: 텍스트 붙여넣기/.txt만 지원한다. PDF/DOCX 파싱은 별도
// 라이브러리(pdf-parse, mammoth)가 필요해 이번 Phase 범위 밖이다.
export async function uploadPressRelease(formData: FormData) {
  const { userEmail } = await requirePermission('articles.ai');

  const title = (formData.get('title') as string) ?? '';
  const body = (formData.get('body') as string) ?? '';
  const source = (formData.get('source') as string) || null;

  if (!title || !body) {
    throw new Error('제목과 본문은 필수 항목입니다.');
  }

  let embedding: number[] | null = null;
  try {
    embedding = await createEmbedding(body);
  } catch (err) {
    // 임베딩 실패는 업로드 자체를 막지 않는다 — 유사도 측정만 나중에 재시도 필요
    console.warn('보도자료 임베딩 생성 실패:', err instanceof Error ? err.message : err);
  }

  const uploadedBy = await getCurrentProfileId(userEmail);

  const { data, error } = await getSupabaseAdmin()
    .from('press_releases')
    .insert({ title, body, source, uploaded_by: uploadedBy, embedding })
    .select('id')
    .single();

  if (error) {
    console.error('Error uploading press release:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/articles');
  return data.id as string;
}

export async function generateDraftFromPressRelease(pressReleaseId: string, section: string) {
  await requirePermission('articles.ai');

  if (!section) {
    throw new Error('섹션을 선택해주세요.');
  }

  const { data: pr, error } = await getSupabaseAdmin()
    .from('press_releases')
    .select('body')
    .eq('id', pressReleaseId)
    .single();

  if (error || !pr) {
    throw new Error('보도자료를 찾을 수 없습니다.');
  }

  const draft = await generateArticleDraft({ pressReleaseText: pr.body, section });

  const { data: inserted, error: insertError } = await getSupabaseAdmin()
    .from('articles')
    .insert({
      title: draft.title,
      slug: slugify(draft.title),
      summary: draft.dek,
      body: draft.body,
      section,
      status: 'draft',
      seo_keywords: draft.seo_keywords ?? [],
      hero_image_alt: draft.image_alt_text ?? null,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error saving generated draft:', insertError);
    throw new Error(insertError.message);
  }

  revalidatePath('/admin/articles');
  return {
    articleId: inserted.id as string,
    factCheckQuestions: draft.fact_check_questions ?? [],
  };
}

export async function measureArticleSimilarity(articleId: string, pressReleaseId: string) {
  await requirePermission('articles.ai');

  const supabase = getSupabaseAdmin();
  const [{ data: article, error: articleError }, { data: pr, error: prError }] = await Promise.all([
    supabase.from('articles').select('body').eq('id', articleId).single(),
    supabase.from('press_releases').select('body').eq('id', pressReleaseId).single(),
  ]);

  if (articleError || prError || !article || !pr) {
    throw new Error('기사 또는 보도자료를 찾을 수 없습니다.');
  }

  if (!article.body) {
    throw new Error('기사 본문이 비어 있어 유사도를 측정할 수 없습니다.');
  }

  const similarity = await measurePressReleaseSimilarity(pr.body, article.body);

  const { error: insertError } = await supabase.from('article_similarity_checks').insert({
    article_id: articleId,
    press_release_id: pressReleaseId,
    cosine_similarity: similarity,
  });

  if (insertError) {
    console.warn('유사도 기록 저장 실패:', insertError.message);
  }

  revalidatePath('/admin/articles');
  revalidatePath(`/admin/articles/${articleId}/edit`);
  return similarity;
}
