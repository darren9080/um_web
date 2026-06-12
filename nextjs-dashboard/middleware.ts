import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// auth.config만 사용 — 프로바이더 없는 Edge Runtime 호환 설정
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/membership/checkout/:path*', '/admin/:path*'],
};
