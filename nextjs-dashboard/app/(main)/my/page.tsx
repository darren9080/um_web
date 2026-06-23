import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { formatDateKo } from '@/app/lib/utils';

export const metadata: Metadata = { title: '마이페이지' };

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  free:      { label: '신청 완료', color: 'bg-green-100 text-green-800' },
  paid:      { label: '결제 완료', color: 'bg-blue-100 text-blue-800' },
  pending:   { label: '결제 대기', color: 'bg-yellow-100 text-yellow-800' },
  cancelled: { label: '취소됨',   color: 'bg-neutral-100 text-neutral-500' },
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/my');

  // 이메일 기준으로 신청 내역 조회
  const supabase = getSupabaseAdmin();
  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('email', session.user.email ?? '')
    .order('created_at', { ascending: false })
    .limit(20);

  const list = registrations ?? [];

  return (
    <div className="container-main py-10 lg:py-14 max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-caption font-semibold tracking-widest text-accent uppercase mb-2">My Page</p>
        <h1 className="text-heading-1 font-bold text-neutral-900">마이페이지</h1>
        <p className="text-body text-neutral-500 mt-1">{session.user.name} · {session.user.email}</p>
      </div>

      {/* 구독 상태 카드 */}
      <div className="bg-brand-charcoal text-white rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-neutral-400 mb-1">현재 구독</p>
            <p className="text-heading-3 font-bold">
              {session.user.subscriptionTier === 'free'
                ? '무료 구독'
                : session.user.subscriptionTier === 'individual'
                ? '개인 멤버십'
                : '기업 멤버십'}
            </p>
          </div>
          {session.user.subscriptionTier === 'free' && (
            <Link href="/membership" className="bg-accent text-white text-body-sm font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
              업그레이드
            </Link>
          )}
        </div>
      </div>

      {/* 이벤트 신청 내역 */}
      <section>
        <h2 className="text-heading-3 font-bold text-neutral-900 mb-5">
          이벤트 신청 내역
          <span className="ml-2 text-body-sm font-normal text-neutral-400">{list.length}건</span>
        </h2>

        {list.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl">
            <p className="text-body-sm text-neutral-500 mb-4">신청한 이벤트가 없습니다</p>
            <Link href="/events" className="btn-accent text-sm py-2.5 px-6 rounded-xl">
              이벤트 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((reg: Record<string, string | number>) => {
              const status = STATUS_LABEL[reg.payment_status as string] ?? STATUS_LABEL.pending;
              return (
                <div key={reg.id as string} className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-body font-semibold text-neutral-900 leading-snug">
                      {reg.event_title as string}
                    </h3>
                    <span className={`shrink-0 text-caption font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-neutral-500">
                    <span>{formatDateKo(reg.event_date as string)}</span>
                    <span>{reg.event_location as string}</span>
                    <span>참가 {reg.attendees as number}명</span>
                    {(reg.total_amount as number) > 0 && (
                      <span className="font-semibold text-primary">
                        {(reg.total_amount as number).toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-neutral-400 mt-2">
                    신청일 {new Date(reg.created_at as string).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
