import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Naver from 'next-auth/providers/naver';
import Kakao from 'next-auth/providers/kakao';

export const { handlers, signIn, signOut, auth } = NextAuth({
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
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider;
        token.subscriptionTier = 'free';
      }
      return token;
    },
    session({ session, token }) {
      session.user.provider = (token.provider ?? 'unknown') as string;
      session.user.subscriptionTier = (token.subscriptionTier ?? 'free') as
        | 'free'
        | 'individual'
        | 'corporate';
      return session;
    },
  },
});
