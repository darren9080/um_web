import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { formatDateKo } from '@/app/lib/utils';
import EventPaymentButton from './event-payment-button';

export const metadata: Metadata = { title: '이벤트 결제' };

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ orderId?: string; amount?: string; title?: string; failed?: string }>;

export default async function EventCheckoutPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();
  if (!event.price) redirect(`/events/${slug}`);

  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/events/${slug}/checkout`);

  const orderId = sp.orderId ?? `EVT-${slug}-${Date.now()}`;
  const amount  = sp.amount  ? parseInt(sp.amount, 10) : event.price;
  const failed  = sp.failed === '1';

  return (
    <div className="container-main py-10 max-w-lg mx-auto">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/events" className="hover:text-primary transition-colors">이벤트</Link>
        <span>/</span>
        <Link href={`/events/${slug}`} className="hover:text-primary transition-colors truncate max-w-[120px]">
          {event.title}
        </Link>
        <span>/</span>
        <span className="text-neutral-600">결제</span>
      </nav>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-8">결제 확인</h1>

      {/* 결제 실패 안내 */}
      {failed && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-body-sm text-red-700">
          결제가 취소되었거나 실패하였습니다. 다시 시도해 주세요.
        </div>
      )}

      {/* 이벤트 요약 카드 */}
      <div className="rounded-2xl border-2 border-neutral-200 p-6 mb-8">
        <p className="text-caption font-semibold text-neutral-400 uppercase tracking-widest mb-3">신청 이벤트</p>
        <h2 className="text-heading-3 font-bold text-neutral-900 mb-2">{event.title}</h2>
        <div className="flex flex-col gap-1 text-body-sm text-neutral-500 mb-5">
          <span>{formatDateKo(event.startDate)}{event.startDate !== event.endDate && ` ~ ${formatDateKo(event.endDate)}`}</span>
          <span>{event.location}</span>
        </div>

        <div className="section-divider my-4" />

        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-600">결제 금액</span>
          <span className="text-heading-2 font-black text-primary">{amount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제자 정보 */}
      <div className="bg-neutral-50 rounded-xl p-4 mb-6 space-y-1.5 text-body-sm text-neutral-600">
        <p className="font-semibold text-neutral-900 mb-2">결제자 정보</p>
        <p>{session.user.name}</p>
        <p>{session.user.email}</p>
      </div>

      {/* 결제 버튼 */}
      <EventPaymentButton
        orderId={orderId}
        orderName={event.title}
        amount={amount}
        customerEmail={session.user.email ?? ''}
        customerName={session.user.name ?? ''}
        userId={session.user.id ?? ''}
        eventSlug={slug}
      />

      <p className="text-caption text-neutral-400 text-center mt-4">
        결제 완료 후 이메일로 확인서가 발송됩니다
      </p>
    </div>
  );
}
