import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PLACEHOLDER_MEMBERSHIP_PLANS } from '@/app/lib/placeholder-data';
import TossPaymentButton from './toss-payment-button';

export const metadata: Metadata = {
  title: '결제',
  description: 'IUSM 멤버십 결제',
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const session = await auth();
  const { planId } = await searchParams;

  const plan = PLACEHOLDER_MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) redirect('/membership');

  const orderId = `IUSM-${plan.id}-${Date.now()}`;

  return (
    <div className="container-main py-12 max-w-lg mx-auto">
      <h1 className="text-heading-1 font-bold text-neutral-900 mb-8">결제 확인</h1>

      {/* 플랜 요약 */}
      <div className="rounded-2xl border-2 border-neutral-200 p-6 mb-8">
        <p className="text-caption font-semibold text-neutral-400 uppercase tracking-widest mb-3">
          선택한 플랜
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-2 font-bold text-neutral-900">{plan.name}</h2>
            <p className="text-body-sm text-neutral-500 mt-1">
              {plan.period === 'monthly' ? '매월 자동 결제' : '1년 구독 (연 1회 결제)'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-heading-1 font-black text-primary">
              {plan.price.toLocaleString()}원
            </p>
            <p className="text-caption text-neutral-400">
              / {plan.period === 'monthly' ? '월' : '년'}
            </p>
          </div>
        </div>

        <div className="section-divider my-5" />

        <ul className="space-y-2">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-body-sm text-neutral-700">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* 결제자 정보 */}
      <div className="rounded-xl bg-neutral-50 p-4 mb-8 space-y-2 text-body-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">이름</span>
          <span className="font-medium text-neutral-900">{session?.user?.name ?? '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">이메일</span>
          <span className="font-medium text-neutral-900">{session?.user?.email ?? '-'}</span>
        </div>
        <div className="section-divider my-2" />
        <div className="flex justify-between text-base font-bold">
          <span className="text-neutral-900">결제 금액</span>
          <span className="text-primary">{plan.price.toLocaleString()}원</span>
        </div>
      </div>

      {/* 토스 결제 버튼 */}
      <TossPaymentButton
        planId={plan.id}
        orderId={orderId}
        orderName={`IUSM ${plan.name}`}
        amount={plan.price}
        customerEmail={session?.user?.email ?? ''}
        customerName={session?.user?.name ?? ''}
        userId={session?.user?.id ?? ''}
      />

      <p className="mt-4 text-center text-caption text-neutral-400">
        결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
      </p>
    </div>
  );
}
