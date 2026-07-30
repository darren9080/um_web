import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '울산매일UTV 이용약관.',
};

export default function TermsPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-article mx-auto">
        <div className="mb-10">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            Terms of Service
          </p>
          <h1
            className="text-display-sm font-bold text-neutral-900 mb-4"
            style={{ fontFamily: '"Noto Serif KR", serif' }}
          >
            이용약관
          </h1>
        </div>

        <div className="article-prose">
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6">
            <p className="text-body text-neutral-700 leading-relaxed">
              이용약관 본문은 법률 검토 후 게시될 예정입니다. 서비스 이용 중 약관 관련
              문의사항은 아래로 연락해주세요.
            </p>
            <p className="text-body-sm text-neutral-500 mt-3">
              문의: <a href="mailto:legal@um.co.kr" className="text-primary hover:underline">legal@um.co.kr</a>
            </p>
          </div>
          <p className="text-caption text-neutral-400 mt-6">
            개인정보 처리에 대한 내용은{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              개인정보처리방침
            </Link>
            을 참고해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
