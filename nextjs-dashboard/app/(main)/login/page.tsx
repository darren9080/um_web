import type { Metadata } from 'next';
import Link from 'next/link';
import { signInWithProvider } from './actions';
import { Logo } from '@/app/ui/iusm/logo';

export const metadata: Metadata = {
  title: '로그인',
  description: 'IUSM에 로그인하세요.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-104px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo variant="full" color="dark" size="lg" href="/" />
          </div>
          <h1 className="text-heading-2 font-bold text-neutral-900 mb-2">로그인</h1>
          <p className="text-body-sm text-neutral-500">
            소셜 계정으로 간편하게 시작하세요
          </p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3">
          {/* 구글 */}
          <form
            action={async () => {
              'use server';
              await signInWithProvider('google', callbackUrl);
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-colors text-body-sm font-semibold text-neutral-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 계속하기
            </button>
          </form>

          {/* 네이버 */}
          <form
            action={async () => {
              'use server';
              await signInWithProvider('naver', callbackUrl);
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-[#03C75A] hover:bg-[#02b350] transition-colors text-body-sm font-semibold text-white"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
              </svg>
              네이버로 계속하기
            </button>
          </form>

          {/* 카카오 */}
          <form
            action={async () => {
              'use server';
              await signInWithProvider('kakao', callbackUrl);
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-[#FEE500] hover:bg-[#f0d800] transition-colors text-body-sm font-semibold text-[#191919]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.742 1.618 5.15 4.067 6.583L5.1 21l4.91-2.617A10.95 10.95 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
              </svg>
              카카오로 계속하기
            </button>
          </form>
        </div>

        {/* 안내 문구 */}
        <p className="mt-8 text-center text-caption text-neutral-400 leading-relaxed">
          로그인 시{' '}
          <Link href="/about" className="underline hover:text-neutral-600">
            이용약관
          </Link>{' '}
          및{' '}
          <Link href="/about" className="underline hover:text-neutral-600">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
