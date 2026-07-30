import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.tosspayments.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://phinf.pstatic.net https://ssl.pstatic.net https://k.kakaocdn.net https://*.supabase.co",
      "connect-src 'self' https://api.tosspayments.com https://*.supabase.co wss://*.supabase.co",
      "frame-src https://js.tosspayments.com https://www.youtube.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'phinf.pstatic.net', pathname: '/**' },
      { protocol: 'https', hostname: 'ssl.pstatic.net', pathname: '/**' },
      { protocol: 'https', hostname: 'k.kakaocdn.net', pathname: '/**' },
      // NSP/ND소프트 CMS CDN (RSS 이미지)
      { protocol: 'https', hostname: '*.iusm.co.kr', pathname: '/**' },
      { protocol: 'https', hostname: '*.ulsan.co.kr', pathname: '/**' },
      // Supabase Storage (배너 이미지 업로드)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    return [
      // NSP 구 URL 포맷 → 새 URL 301 리다이렉트
      // e.g. /news/articleView.html?idxno=1063984 → /news/1063984
      {
        source: '/news/articleView.html',
        has: [{ type: 'query', key: 'idxno', value: '(?<idxno>\\d+)' }],
        destination: '/news/:idxno',
        permanent: true,
      },
      // 구 사이트 다른 섹션 URL 패턴 (NSP 공통)
      {
        source: '/news/articleList.html',
        destination: '/news',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
