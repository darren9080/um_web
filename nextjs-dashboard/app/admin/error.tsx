'use client';

import { useEffect } from 'react';

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <h2 className="font-semibold text-slate-950 mb-1">오류가 발생했습니다</h2>
        <p className="text-sm text-slate-500">페이지를 불러오는 중 문제가 발생했습니다.</p>
      </div>
      <button
        onClick={reset}
        className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
      >
        다시 시도
      </button>
    </div>
  );
}
