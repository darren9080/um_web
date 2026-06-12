import '@/app/ui/global.css';
import { inter, notoSerifKR, notoSansKR } from '@/app/ui/fonts';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: '울산매일UTV - 울산 대표 미디어 플랫폼',
    template: '%s | 울산매일UTV',
  },
  description: '울산의 사회·문화·스포츠·경제 뉴스와 재즈페스티벌, 마라톤, 문학상, 청년박람회, CEO아카데미 등 지역 대표 이벤트를 전달하는 미디어 플랫폼입니다.',
  keywords: ['울산매일', 'UTV', '울산뉴스', '울산이벤트', '문화', '스포츠', '스타트업', 'CEO아카데미', '울산'],
  authors: [{ name: '울산매일UTV' }],
  creator: '울산매일UTV',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://um.co.kr',
    siteName: '울산매일UTV',
    title: '울산매일UTV - 울산 대표 미디어 플랫폼',
    description: '울산의 사회·문화·스포츠·경제 뉴스와 지역 대표 이벤트를 전달합니다.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ulsanmaeil_utv',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
