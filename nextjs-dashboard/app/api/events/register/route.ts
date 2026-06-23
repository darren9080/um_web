import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';

const Schema = z.object({
  eventId:       z.string().min(1),
  eventTitle:    z.string().min(1),
  eventDate:     z.string().min(1),
  eventLocation: z.string().min(1),
  name:          z.string().min(1, '이름을 입력해주세요'),
  email:         z.string().email('올바른 이메일을 입력해주세요'),
  phone:         z.string().min(9, '연락처를 입력해주세요').max(15),
  attendees:     z.number().int().min(1).max(10),
  totalAmount:   z.number().int().min(0),
});

export async function POST(request: Request) {
  const session = await auth();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? '입력값을 확인해주세요';
    return NextResponse.json({ error: msg }, { status: 422 });
  }

  const d = parsed.data;
  const supabase = getSupabaseAdmin();

  const record = {
    event_id:       d.eventId,
    event_title:    d.eventTitle,
    event_date:     d.eventDate,
    event_location: d.eventLocation,
    user_id:        session?.user?.id ?? null,
    name:           d.name,
    email:          d.email,
    phone:          d.phone,
    attendees:      d.attendees,
    total_amount:   d.totalAmount,
    payment_status: d.totalAmount === 0 ? 'free' : 'pending',
    order_id:       d.totalAmount > 0 ? `EVT-${d.eventId}-${Date.now()}` : null,
  };

  const { data, error } = await supabase
    .from('event_registrations')
    .insert(record)
    .select('id, order_id, payment_status')
    .single();

  if (error) {
    console.error('[events/register]', error);
    return NextResponse.json({ error: '신청 처리 중 오류가 발생했습니다' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    orderId: data.order_id,
    paymentStatus: data.payment_status,
  });
}
