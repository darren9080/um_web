import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/app/lib/supabase';

const Schema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  name:  z.string().max(50).optional(),
  source: z.string().max(20).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? '입력값 오류' }, { status: 422 });
  }

  const { email, name, source } = parsed.data;
  const supabase = getSupabaseAdmin();

  // upsert: 이미 있으면 재활성화, 없으면 신규
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email: email.toLowerCase(), name: name ?? null, source: source ?? 'web', active: true, unsubscribed_at: null },
      { onConflict: 'email' },
    );

  if (error) {
    console.error('[newsletter]', error);
    return NextResponse.json({ error: '구독 처리 중 오류가 발생했습니다' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
