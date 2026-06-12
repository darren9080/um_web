import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '결제 실패' };

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; message?: string }>;
}) {
  const { code, message } = await searchParams;

  const displayMessage =
    message ?? (code === 'PAY_PROCESS_CANCELED' ? '결제가 취소되었습니다.' : '결제에 실패했습니다.');

  return (
    <div className="container-main py-20 max-w-lg mx-auto text-center">
      {/* 실패 아이콘 */}
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">결제에 실패했습니다</h1>
      <p className="text-body text-neutral-500 mb-2">{displayMessage}</p>
      {code && (
        <p className="text-caption text-neutral-400 font-mono mb-8">오류 코드: {code}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link href="/membership" className="flex-1 btn-primary text-center">
          다시 시도하기
        </Link>
        <Link href="/" className="flex-1 btn-outline text-center">
          홈으로
        </Link>
      </div>
    </div>
  );
}
