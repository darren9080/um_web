'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-main py-24 flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <div>
        <h1 className="text-heading-2 font-bold text-neutral-900 mb-2">
          페이지를 불러오지 못했습니다
        </h1>
        <p className="text-body-sm text-neutral-500 max-w-sm">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          다시 시도
        </button>
        <Link href="/" className="btn-outline">
          홈으로
        </Link>
      </div>
    </div>
  );
}
