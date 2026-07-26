import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authConfig } from './auth.config';
import { BRAND_SLUGS } from './app/lib/event-brands';

// 브랜드 서브도메인에서 메인 사이트로 돌려보낼 공통 경로
const MAIN_SITE_PREFIXES = ['/events', '/news', '/membership', '/my', '/login', '/data', '/topics', '/search', '/journalists', '/people', '/api'];
const ROOT_ORIGIN = 'https://iusm.co.kr';

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

  // ── marathon.iusm.co.kr — 울산매일마라톤 ────────────────────────────────
  if (subdomain === 'marathon') {
    // 신청·결제는 로그인 필요 (서브도메인 상대경로·물리경로 모두 대응)
    const needsAuth = pathname.startsWith('/apply') || pathname.startsWith('/marathon/apply');
    if (needsAuth && !isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
    // 서브도메인 경로 → /marathon/* 물리 경로. 이미 /marathon 접두면 중복 방지.
    const internalPath =
      pathname === '/' ? '/marathon'
      : pathname.startsWith('/marathon') ? pathname
      : `/marathon${pathname}`;
    return NextResponse.rewrite(new URL(internalPath, nextUrl));
  }

  // ── 이벤트 브랜드 서브도메인 (academy·jazz·award ...) ───────────────────
  if (subdomain && BRAND_SLUGS.has(subdomain)) {
    // 신청·결제 등 공통 기능은 메인 도메인으로 이동 (결제·회원 시스템 공유)
    if (MAIN_SITE_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL(pathname + nextUrl.search, ROOT_ORIGIN));
    }
    // 서브도메인 경로 → /brands/[brand]/* 물리 경로. 중복 접두 방지.
    const internalPath =
      pathname === '/' ? `/brands/${subdomain}`
      : pathname.startsWith('/brands') ? pathname
      : `/brands/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(internalPath, nextUrl));
  }

  // ── 메인 사이트 기존 인증 로직 ───────────────────────────────────────────
  const isCheckout = pathname.startsWith('/membership/checkout');
  const isAdmin = pathname.startsWith('/admin');
  const isMy = pathname.startsWith('/my');
  const isMarathonApply = pathname.startsWith('/marathon/apply');
  if ((isCheckout || isAdmin || isMy || isMarathonApply) && !isLoggedIn) {
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
