import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
