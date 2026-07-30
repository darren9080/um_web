import Link from 'next/link';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/app/lib/supabase';

export const metadata: Metadata = { title: '신청 완료' };

type SearchParams = Promise<{
  paymentKey?: string;
  orderId?: string;
  amount?: string;
}>;

async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) return null;

  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: 'no-store',
  });

  if (!res.ok) return null;

  // 결제 확인 후 DB 상태 업데이트
  await getSupabaseAdmin()
    .from('event_registrations')
    .update({ payment_status: 'paid', payment_key: paymentKey, updated_at: new Date().toISOString() })
    .eq('order_id', orderId);

  return await res.json();
}

export default async function EventRegisterSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { paymentKey, orderId, amount } = await searchParams;

  // 토스페이먼츠 결제 성공 콜백인 경우 서버에서 결제 확인
  const isPaidConfirmation = !!(paymentKey && orderId && amount);
  if (isPaidConfirmation) {
    await confirmPayment(paymentKey!, orderId!, parseInt(amount!, 10));
  }

  return (
    <div className="container-main py-20 max-w-lg mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">
        {isPaidConfirmation ? '결제가 완료되었습니다' : '신청이 완료되었습니다'}
      </h1>
      <p className="text-body text-neutral-600 mb-2">
        입력하신 이메일로 확인서가 발송됩니다.
      </p>
      <p className="text-body-sm text-neutral-400 mb-10">
        문의사항은 편집국(052-243-1001)으로 연락 주세요.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/events" className="btn-outline py-3 px-8 rounded-xl text-body-sm font-semibold">
          다른 이벤트 보기
        </Link>
        <Link href="/my" className="btn-accent py-3 px-8 rounded-xl text-body-sm font-semibold">
          내 신청 내역
        </Link>
      </div>
    </div>
  );
}
