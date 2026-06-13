import type { Metadata } from 'next';
import Link from 'next/link';
import { PLACEHOLDER_MEMBERSHIP_PLANS } from '@/app/lib/placeholder-data';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: '멤버십',
  description: 'IUSM 개인 구독 및 기업 멤버십 플랜을 확인하세요.',
};

export default async function MembershipPage() {
  const session = await auth();
  const individualPlans = PLACEHOLDER_MEMBERSHIP_PLANS.filter((p) => p.tier === 'individual');
  const corporatePlans = PLACEHOLDER_MEMBERSHIP_PLANS.filter((p) => p.tier === 'corporate');

  return (
    <div className="container-main py-12">
      {/* 페이지 헤더 */}
      <div className="text-center mb-12">
        <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          멤버십
        </p>
        <h1 className="text-display-sm font-bold text-neutral-900 mb-4 text-balance">
          IUSM과 함께하는<br />더 깊은 인사이트
        </h1>
        <p className="text-body text-neutral-500 max-w-lg mx-auto">
          프리미엄 기사, 이벤트 우선 신청권, 리서치 리포트까지.<br />
          IUSM 멤버십으로 더 많은 혜택을 경험하세요.
        </p>
      </div>

      {/* 개인 구독 플랜 */}
      <section className="mb-14">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6 text-center">개인 구독</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {individualPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border-2 transition-shadow ${
                plan.highlighted
                  ? 'border-primary bg-white shadow-card-hover'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-caption font-bold px-4 py-1 rounded-full">
                    가장 인기
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-heading-3 font-bold text-neutral-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-display-sm font-black text-primary">
                    {plan.price.toLocaleString()}원
                  </span>
                  <span className="text-body-sm text-neutral-400">
                    / {plan.period === 'monthly' ? '월' : '년'}
                  </span>
                </div>
                {plan.period === 'yearly' && (
                  <p className="text-caption text-green-600 font-semibold mt-1">
                    월 {Math.round(plan.price / 12).toLocaleString()}원 · 25% 절약
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-body-sm text-neutral-700">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={
                  session?.user?.subscriptionTier !== 'free'
                    ? '#'
                    : `/membership/checkout?planId=${plan.id}`
                }
                className={`block w-full py-3 rounded-xl text-body-sm font-bold text-center transition-colors ${
                  session?.user?.subscriptionTier !== 'free'
                    ? 'border border-neutral-200 text-neutral-400 cursor-default'
                    : plan.highlighted
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'border border-neutral-200 text-neutral-700 hover:border-primary hover:text-primary'
                }`}
              >
                {session?.user?.subscriptionTier !== 'free'
                  ? '현재 구독 중'
                  : plan.highlighted
                  ? '지금 시작하기'
                  : '구독하기'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 구분선 */}
      <div className="section-divider mb-14" />

      {/* 기업 멤버십 */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-3">기업/단체 멤버십</h2>
          <p className="text-body-sm text-neutral-500">
            팀과 함께 IUSM의 프리미엄 콘텐츠를 활용하세요
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {corporatePlans.map((plan) => (
            <div key={plan.id} className="bg-primary text-white rounded-2xl p-8 shadow-card-hover">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-heading-2 font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-heading-1 font-black">
                      {plan.price.toLocaleString()}원
                    </span>
                    <span className="text-body-sm text-neutral-400">/ 년</span>
                  </div>
                </div>
                <span className="bg-white/20 text-white text-caption font-semibold px-3 py-1 rounded-full">
                  최대 10인
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-body-sm">
                    <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/about#contact"
                className="block w-full py-3.5 bg-white text-primary font-bold text-body-sm rounded-xl hover:bg-neutral-100 transition-colors text-center"
              >
                기업 멤버십 문의하기
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6 text-center">자주 묻는 질문</h2>
        <div className="space-y-4">
          {[
            {
              q: '언제든지 구독을 취소할 수 있나요?',
              a: '네, 언제든지 마이페이지에서 구독을 취소할 수 있습니다. 취소 시 남은 기간 동안은 계속 이용 가능합니다.',
            },
            {
              q: '결제 수단은 무엇을 지원하나요?',
              a: '신용카드, 체크카드, 카카오페이, 네이버페이, 토스페이 등을 지원합니다.',
            },
            {
              q: '기업 멤버십은 어떻게 신청하나요?',
              a: '기업 멤버십 문의 버튼을 클릭하거나 contact@iusm.co.kr로 문의해 주세요. 담당자가 2영업일 내 연락드립니다.',
            },
            {
              q: '프리미엄 기사는 어떤 내용인가요?',
              a: 'IUSM 리서치팀의 심층 분석 보고서, 인터뷰, 데이터 기반 리포트 등 일반 독자에게 공개되지 않는 심층 콘텐츠입니다.',
            },
          ].map(({ q, a }, i) => (
            <details key={i} className="group border border-neutral-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-body-sm font-semibold text-neutral-900 hover:bg-neutral-50 list-none">
                {q}
                <svg className="w-4 h-4 text-neutral-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-body-sm text-neutral-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <div className="text-center mt-14 py-10 bg-neutral-50 rounded-2xl border border-neutral-200">
        <p className="text-body-sm text-neutral-500 mb-3">구독 전에 더 알고 싶으신가요?</p>
        <h3 className="text-heading-2 font-bold text-neutral-900 mb-5">궁금한 점이 있으시면 문의해 주세요</h3>
        <Link href="/about#contact" className="btn-outline">
          문의하기
        </Link>
      </div>
    </div>
  );
}
