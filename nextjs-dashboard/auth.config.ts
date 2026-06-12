import type { NextAuthConfig } from 'next-auth';

// Edge Runtime 호환 설정 (프로바이더 없음 — middleware 전용)
export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCheckout = nextUrl.pathname.startsWith('/membership/checkout');
      if (isCheckout) return isLoggedIn;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
