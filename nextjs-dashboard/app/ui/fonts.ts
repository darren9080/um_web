import { Inter, Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});
