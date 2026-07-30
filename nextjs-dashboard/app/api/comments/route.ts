import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';

const PostSchema = z.object({
  articleSlug: z.string().min(1),
  content:     z.string().min(1, '댓글을 입력해주세요').max(1000, '1000자 이내로 작성해주세요'),
  parentId:    z.string().uuid().optional(),
});

// GET /api/comments?slug=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug 필요' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('article_comments')
    .select('id, parent_id, user_id, user_name, user_image, content, is_deleted, created_at')
    .eq('article_slug', slug)
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 삭제된 댓글은 content 마스킹
  const masked = (data ?? []).map((c) =>
    c.is_deleted ? { ...c, content: '삭제된 댓글입니다.', user_name: '', user_image: null } : c,
  );

  return NextResponse.json({ comments: masked });
}

// POST /api/comments
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: '잘못된 요청' }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? '입력값 오류' }, { status: 422 });
  }

  const { articleSlug, content, parentId } = parsed.data;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('article_comments')
    .insert({
      article_slug: articleSlug,
      parent_id:   parentId ?? null,
      user_id:     session.user.id!,
      user_name:   session.user.name ?? '익명',
      user_image:  session.user.image ?? null,
      content,
    })
    .select('id, parent_id, user_id, user_name, user_image, content, is_deleted, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ comment: data }, { status: 201 });
}

// DELETE /api/comments?id=...
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('article_comments')
    .update({ is_deleted: true })
    .eq('id', id)
    .eq('user_id', session.user.id!);  // 본인 댓글만

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
