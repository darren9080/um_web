import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: '결제 완료' };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }>;
}) {
  const { paymentKey, orderId, amount } = await searchParams;

  if (!paymentKey || !orderId || !amount) {
    redirect('/membership');
  }

  // 서버에서 Toss 결제 최종 승인
  const secretKey = process.env.TOSS_SECRET_KEY;
  let paymentData: Record<string, unknown> | null = null;
  let errorMessage: string | null = null;

  if (secretKey) {
    const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
      cache: 'no-store',
    });

    if (res.ok) {
      paymentData = await res.json();
      // TODO: DB 연동 후 — 사용자 subscriptionTier 업데이트
    } else {
      const err = await res.json();
      errorMessage = err.message ?? '결제 승인에 실패했습니다.';
    }
  } else {
    // 개발 환경 (TOSS_SECRET_KEY 미설정)
    paymentData = { orderId, amount: Number(amount) };
  }

  if (errorMessage) {
    redirect(`/membership/fail?message=${encodeURIComponent(errorMessage)}`);
  }

  return (
    <div className="container-main py-20 max-w-lg mx-auto text-center">
      {/* 성공 아이콘 */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">결제가 완료되었습니다</h1>
      <p className="text-body text-neutral-500 mb-8">
        IUSM 멤버십이 활성화되었습니다.<br />
        프리미엄 콘텐츠를 즐겨보세요.
      </p>

      {/* 결제 정보 */}
      <div className="rounded-xl bg-neutral-50 p-5 text-left space-y-3 mb-8 text-body-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">주문번호</span>
          <span className="font-medium text-neutral-900 font-mono text-xs">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">결제 금액</span>
          <span className="font-bold text-primary">{Number(amount).toLocaleString()}원</span>
        </div>
        {typeof paymentData?.method === 'string' && (
          <div className="flex justify-between">
            <span className="text-neutral-500">결제 수단</span>
            <span className="font-medium text-neutral-900">{paymentData.method}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/news" className="flex-1 btn-primary text-center">
          프리미엄 기사 보기
        </Link>
        <Link href="/" className="flex-1 btn-outline text-center">
          홈으로
        </Link>
      </div>
    </div>
  );
}
