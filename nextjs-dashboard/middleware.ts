import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// 서브도메인 → 경로 prefix 매핑
const SUBDOMAIN_REWRITES: Record<string, string> = {
  admin: '/admin',
  tv: '/_tv',    // Phase 2: UTV 영상 섹션 (현재는 리다이렉트)
};

// 메인 도메인 목록 (서브도메인 처리 제외)
const ROOT_HOSTS = new Set([
  'iusm.co.kr',
  'www.iusm.co.kr',
  'um.co.kr',
  'localhost',
  '127.0.0.1',
]);

function getSubdomain(host: string): string | null {
  // Vercel 프리뷰 URL은 서브도메인 처리 건너뜀
  if (host.includes('vercel.app') || host.includes('vercel-dns')) return null;

  const parts = host.split('.');
  // iusm.co.kr → parts.length === 3, admin.iusm.co.kr → parts.length === 4
  if (parts.length < 3) return null;

  const sub = parts[0].toLowerCase();
  return ROOT_HOSTS.has(host) ? null : sub;
}

export default auth((req: NextRequest & { auth: unknown }) => {
  const { nextUrl, headers } = req;
  const host = headers.get('host') ?? '';
  const subdomain = getSubdomain(host);

  // ── admin.iusm.co.kr ──────────────────────────────────────────────────────
  if (subdomain === 'admin') {
    const isLoggedIn = !!(req as { auth?: { user?: unknown } }).auth?.user;
    if (!isLoggedIn) {
      // 미인증 → 메인 사이트 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/login', `https://${host.replace('admin.', '')}`);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
    // /admin/* 으로 내부 rewrite (URL 바 표시는 admin.iusm.co.kr 유지)
    const rewrittenPath = nextUrl.pathname === '/' ? '/admin' : `/admin${nextUrl.pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, nextUrl));
  }

  // ── tv.iusm.co.kr ─────────────────────────────────────────────────────────
  if (subdomain === 'tv') {
    // Phase 2 이전: 메인 사이트 뉴스 섹션으로 임시 리다이렉트
    return NextResponse.redirect(new URL('/news', `https://iusm.co.kr`), 302);
  }

  // ── 메인 사이트 기존 인증 로직 유지 ─────────────────────────────────────
  const isLoggedIn = !!(req as { auth?: { user?: unknown } }).auth?.user;
  const { pathname } = nextUrl;
  const isCheckout = pathname.startsWith('/membership/checkout');
  const isAdmin = pathname.startsWith('/admin');

  if ((isCheckout || isAdmin) && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 모든 경로 (정적 파일·API 제외)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)).*)',
  ],
};
