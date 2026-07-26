import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';

const Schema = z.object({
  year:             z.number().int(),
  course:           z.enum(['full', 'half', '10km', '5km']),
  name:             z.string().min(1, '이름을 입력해주세요'),
  gender:           z.enum(['M', 'F']),
  birthDate:        z.string().min(1, '생년월일을 입력해주세요'),
  phone:            z.string().min(9, '연락처를 입력해주세요').max(20),
  email:            z.string().email('올바른 이메일을 입력해주세요'),
  shirtSize:        z.string().optional(),
  emergencyContact: z.string().optional(),
  totalAmount:      z.number().int().min(0),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? '입력값을 확인해주세요' }, { status: 422 });
  }

  const d = parsed.data;
  const orderId = `MARA-${d.year}-${d.course}-${Date.now()}`;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('marathon_registrations')
    .insert({
      year:           d.year,
      course:         d.course,
      user_id:        session.user.id ?? null,
      name:           d.name,
      gender:         d.gender,
      birth_date:     d.birthDate,
      phone:          d.phone,
      email:          d.email,
      shirt_size:     d.shirtSize ?? null,
      emergency_contact: d.emergencyContact ?? null,
      total_amount:   d.totalAmount,
      payment_status: 'pending',
      order_id:       orderId,
    })
    .select('id, order_id')
    .single();

  if (error) {
    console.error('[marathon/register]', error);
    return NextResponse.json({ error: '신청 처리 중 오류가 발생했습니다' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id, orderId: data.order_id });
}
