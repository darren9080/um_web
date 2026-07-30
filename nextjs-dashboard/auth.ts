import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Naver from 'next-auth/providers/naver';
import Kakao from 'next-auth/providers/kakao';
import { authConfig } from './auth.config';
import { getSupabaseAdmin } from './app/lib/supabase';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? '';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID ?? '',
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider;
        token.subscriptionTier = 'free';

        // 첫 로그인 시 cms_profiles upsert
        if (user.email && user.name && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const role = user.email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'viewer';
          await getSupabaseAdmin().from('cms_profiles').upsert(
            { email: user.email, display_name: user.name, role },
            { onConflict: 'email', ignoreDuplicates: true },
          );
          token.cmsRole = role;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.provider = (token.provider ?? 'unknown') as string;
      session.user.subscriptionTier = (token.subscriptionTier ?? 'free') as
        | 'free'
        | 'individual'
        | 'corporate';
      session.user.cmsRole = (token.cmsRole ?? 'viewer') as string;
      return session;
    },
  },
});
