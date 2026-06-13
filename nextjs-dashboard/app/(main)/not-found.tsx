import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
};

export default function NotFound() {
  return (
    <div className="container-main py-24 flex flex-col items-center text-center gap-6">
      <p className="text-[6rem] font-black text-neutral-100 leading-none select-none">404</p>

      <div className="-mt-4">
        <h1 className="text-heading-2 font-bold text-neutral-900 mb-2">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-body-sm text-neutral-500 max-w-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary">홈으로</Link>
        <Link href="/news" className="btn-outline">뉴스 보기</Link>
        <Link href="/events" className="btn-outline">이벤트 보기</Link>
      </div>
    </div>
  );
}
