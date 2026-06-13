import '@/app/ui/global.css';
import { inter, notoSerifKR, notoSansKR } from '@/app/ui/fonts';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';

const OG_IMAGE = `${SITE_URL}/opengraph-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 울산 대표 미디어 플랫폼`,
    template: `%s | ${SITE_NAME}`,
  },
  description: '울산의 사회·문화·스포츠·경제 뉴스와 재즈페스티벌, 마라톤, 문학상, 청년박람회, CEO아카데미 등 지역 대표 이벤트를 전달하는 미디어 플랫폼입니다.',
  keywords: ['울산매일', 'UTV', '울산뉴스', '울산이벤트', '문화', '스포츠', '스타트업', 'CEO아카데미', '울산'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 울산 대표 미디어 플랫폼`,
    description: '울산의 사회·문화·스포츠·경제 뉴스와 지역 대표 이벤트를 전달합니다.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ulsanmaeil_utv',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NAVER_SITE_VERIFICATION
        ? { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION }
        : {}),
      ...(process.env.BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
        : {}),
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
