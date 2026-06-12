import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 모노레포 루트 경로 명시 — Vercel outputFileTracing 경고 해소
  outputFileTracingRoot: path.join(__dirname, '../../'),

  images: {
    remotePatterns: [
      // 언스플래시 (플레이스홀더 이미지)
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Google OAuth 프로필 사진
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // Naver OAuth 프로필 사진
      { protocol: 'https', hostname: 'phinf.pstatic.net', pathname: '/**' },
      { protocol: 'https', hostname: 'ssl.pstatic.net', pathname: '/**' },
      // Kakao OAuth 프로필 사진
      { protocol: 'https', hostname: 'k.kakaocdn.net', pathname: '/**' },
    ],
  },
};

export default nextConfig;
