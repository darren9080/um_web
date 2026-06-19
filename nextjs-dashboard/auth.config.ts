import type { NextAuthConfig } from 'next-auth';

// Edge Runtime 호환 설정 (프로바이더 없음 — middleware 전용)
export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    // JWT 토큰의 cmsRole을 Edge 미들웨어 session에 노출
    session({ session, token }) {
      if (token.cmsRole) session.user.cmsRole = token.cmsRole as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCheckout = nextUrl.pathname.startsWith('/membership/checkout');
      const isAdmin = nextUrl.pathname.startsWith('/admin');
      if (isCheckout || isAdmin) return isLoggedIn;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
