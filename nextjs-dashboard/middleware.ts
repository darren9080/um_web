import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

// ── 서브도메인 역할 접근 정의 ──────────────────────────────────────────────
// cms.iusm.co.kr: 뉴스룸 편집 (기사·이벤트·데스크·일정)
const CMS_ROLES = new Set(['super_admin', 'publisher', 'desk_editor', 'reporter', 'event_manager']);
// admin.iusm.co.kr: 운영 관리 (홈페이지·배너·분석·설정)
const ADMIN_ROLES = new Set(['super_admin', 'publisher', 'desk_editor', 'ad_manager', 'analyst']);

// ── 메인 도메인 (서브도메인 처리 제외) ────────────────────────────────────
const ROOT_HOSTS = new Set([
  'iusm.co.kr',
  'www.iusm.co.kr',
  'um.co.kr',
  'localhost',
  '127.0.0.1',
]);

function getSubdomain(host: string): string | null {
  if (host.includes('vercel.app') || host.includes('vercel-dns')) return null;
  const bare = host.split(':')[0]; // 포트 제거
  const parts = bare.split('.');
  if (parts.length < 3) return null;
  return ROOT_HOSTS.has(bare) ? null : parts[0].toLowerCase();
}

type AuthedRequest = NextRequest & { auth?: { user?: { cmsRole?: string } } | null };

export default auth((req: AuthedRequest) => {
  const { nextUrl, headers } = req;
  const host = headers.get('host') ?? '';
  const subdomain = getSubdomain(host);
  const isLoggedIn = !!req.auth?.user;
  const cmsRole = req.auth?.user?.cmsRole ?? 'viewer';
  const { pathname } = nextUrl;

  // ── cms.iusm.co.kr — 뉴스룸 CMS ────────────────────────────────────────
  if (subdomain === 'cms') {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (!CMS_ROLES.has(cmsRole)) {
      // 권한 없는 역할 → 메인 사이트로
      return NextResponse.redirect(new URL('/', `https://iusm.co.kr`));
    }
    // / → /admin/articles (기사 목록 기본 랜딩)
    const internalPath = pathname === '/' ? '/admin/articles' : `/admin${pathname}`;
    return NextResponse.rewrite(new URL(internalPath, nextUrl));
  }

  // ── admin.iusm.co.kr — 운영 관리 ────────────────────────────────────────
  if (subdomain === 'admin') {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (!ADMIN_ROLES.has(cmsRole)) {
      // 기자 등 CMS 전용 역할 → cms 서브도메인으로 리다이렉트
      return NextResponse.redirect(new URL('/', `https://cms.iusm.co.kr`));
    }
    // / → /admin, /homepage → /admin/homepage
    const internalPath = pathname === '/' ? '/admin' : `/admin${pathname}`;
    return NextResponse.rewrite(new URL(internalPath, nextUrl));
  }

  // ── tv.iusm.co.kr — UTV 영상 (Phase 2 전 임시 리다이렉트) ──────────────
  if (subdomain === 'tv') {
    return NextResponse.redirect(new URL('/news', `https://iusm.co.kr`), 302);
  }

  // ── 메인 사이트 기존 인증 로직 ───────────────────────────────────────────
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)).*)',
  ],
};
