import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      provider: string;
      subscriptionTier: 'free' | 'individual' | 'corporate';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string;
    subscriptionTier?: string;
  }
}
