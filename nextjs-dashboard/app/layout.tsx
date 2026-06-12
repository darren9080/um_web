import '@/app/ui/global.css';
import { inter, notoSerifKR, notoSansKR } from '@/app/ui/fonts';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'IUSM - 사회·문화·인문·스포츠 미디어 플랫폼',
    template: '%s | IUSM',
  },
  description: '재즈페스티벌, 마라톤, 문학상, 청년박람회, CEO아카데미 등 다양한 이벤트와 사회·문화·인문·스포츠 뉴스를 제공하는 미디어 플랫폼입니다.',
  keywords: ['IUSM', '이벤트', '컨퍼런스', '뉴스', '문화', '스포츠', '인문학', '스타트업', 'CEO아카데미'],
  authors: [{ name: 'IUSM' }],
  creator: 'IUSM',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://iusm.co.kr',
    siteName: 'IUSM',
    title: 'IUSM - 사회·문화·인문·스포츠 미디어 플랫폼',
    description: '재즈페스티벌, 마라톤, 문학상, 청년박람회, CEO아카데미 등 다양한 이벤트와 미디어 콘텐츠',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@iusm_kr',
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
