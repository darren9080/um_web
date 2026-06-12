'use server';

import { signIn, signOut } from '@/auth';

export async function signInWithProvider(
  provider: 'google' | 'naver' | 'kakao',
  callbackUrl?: string,
) {
  await signIn(provider, { redirectTo: callbackUrl ?? '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
