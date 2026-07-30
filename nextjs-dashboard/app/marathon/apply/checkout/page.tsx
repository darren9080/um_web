import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { getRaceByYear, COURSE_LABELS, type CourseType } from '@/app/lib/marathon-data';
import MarathonPaymentButton from './marathon-payment-button';

export const metadata: Metadata = { title: '참가비 결제' };

type SearchParams = Promise<{ orderId?: string; failed?: string }>;

export default async function MarathonCheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const orderId = sp.orderId;
  const failed = sp.failed === '1';

  if (!orderId) redirect('/marathon/apply');

  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=' + encodeURIComponent('https://marathon.iusm.co.kr/apply'));
  }

  // 신청 내역 조회
  const { data: reg } = await getSupabaseAdmin()
    .from('marathon_registrations')
    .select('year, course, name, email, total_amount, payment_status')
    .eq('order_id', orderId)
    .single();

  if (!reg) {
    return (
      <div className="container-main py-20 max-w-lg mx-auto text-center">
        <h1 className="text-heading-2 font-bold text-neutral-900 mb-3">신청 내역을 찾을 수 없습니다</h1>
        <p className="text-body-sm text-neutral-500 mb-8">신청이 만료되었거나 잘못된 접근입니다.</p>
        <Link href="/marathon/apply" className="inline-block px-6 py-3 rounded-xl bg-brand-red text-white font-bold">다시 신청하기</Link>
      </div>
    );
  }

  const race = getRaceByYear(reg.year);

  return (
    <div className="container-main py-10 max-w-lg mx-auto">
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
        <span>/</span>
        <Link href="/marathon/apply" className="hover:text-brand-red transition-colors">참가신청</Link>
        <span>/</span>
        <span className="text-neutral-600">결제</span>
      </nav>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-8">참가비 결제</h1>

      {failed && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-body-sm text-red-700">
          결제가 취소되었거나 실패하였습니다. 다시 시도해 주세요.
        </div>
      )}

      <div className="rounded-2xl border-2 border-neutral-200 p-6 mb-6">
        <p className="text-caption font-semibold text-neutral-400 uppercase tracking-widest mb-3">신청 대회</p>
        <h2 className="text-heading-3 font-bold text-neutral-900 mb-2">{race?.title ?? `${reg.year}년 대회`}</h2>
        <p className="text-body-sm text-neutral-500 mb-5">{COURSE_LABELS[reg.course as CourseType]} · {reg.name}</p>
        <div className="section-divider my-4" />
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-neutral-600">결제 금액</span>
          <span className="text-heading-2 font-black text-brand-red">{reg.total_amount.toLocaleString()}원</span>
        </div>
      </div>

      <MarathonPaymentButton
        orderId={orderId}
        orderName={`${race?.title ?? '울산매일마라톤'} - ${COURSE_LABELS[reg.course as CourseType]}`}
        amount={reg.total_amount}
        customerEmail={reg.email ?? session.user.email ?? ''}
        customerName={reg.name ?? session.user.name ?? ''}
        userId={session.user.id ?? ''}
      />

      <p className="text-caption text-neutral-400 text-center mt-4">
        결제 완료 후 배번은 접수 마감 뒤 일괄 배정되며 이메일로 안내됩니다.
      </p>
    </div>
  );
}
