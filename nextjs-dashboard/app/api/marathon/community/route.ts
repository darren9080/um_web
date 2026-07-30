import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';

const PostSchema = z.object({
  category: z.enum(['review', 'group', 'qna', 'free']),
  title:    z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이내로 작성해주세요'),
  content:  z.string().min(1, '내용을 입력해주세요'),
});

// GET /api/marathon/community?category=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('community_posts')
    .select('id, category, title, author_name, views, likes, comment_count, migrated, created_at')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (category && category !== 'all') query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

// POST /api/marathon/community
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? '입력값 오류' }, { status: 422 });
  }

  const { category, title, content } = parsed.data;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      category, title, content,
      user_id:     session.user.id!,
      author_name: session.user.name ?? '러너',
      author_image: session.user.image ?? null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
