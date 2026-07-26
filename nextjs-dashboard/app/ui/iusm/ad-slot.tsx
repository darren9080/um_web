'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Banner } from '@/app/lib/cms/definitions';
import { AD_SIZES, type AdPlacement } from '@/app/lib/ads';

interface Props {
  placement: AdPlacement;
  banners: Banner[];
  className?: string;
}

/**
 * 공개 광고 슬롯. 서버 컴포넌트에서 getActiveBanners()로 필터한 배너를 받아 렌더.
 * - '광고' 라벨 항상 노출(취재·광고 구별 — 윤리 원칙)
 * - 복수 배너는 로드 시 랜덤 1개 노출(임프레션 공정 분배)
 * - 활성 배너 없으면 아무것도 렌더하지 않음
 */
export default function AdSlot({ placement, banners, className = '' }: Props) {
  const size = AD_SIZES[placement];
  const [index, setIndex] = useState(0);

  // 하이드레이션 안전: 서버·초기 렌더는 0번, 마운트 후 랜덤 선택
  useEffect(() => {
    if (banners.length > 1) {
      setIndex(Math.floor(Math.random() * banners.length));
    }
  }, [banners.length]);

  if (banners.length === 0) return null;
  const banner = banners[index] ?? banners[0];

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200"
        style={{ maxWidth: size.w, aspectRatio: size.ratio }}
      >
        {/* 광고 라벨 */}
        <span className="absolute top-1.5 left-1.5 z-10 text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded bg-black/45 text-white/90 backdrop-blur-sm">
          광고
        </span>

        <a
          href={banner.linkUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label={`광고: ${banner.title}`}
          className="block w-full h-full group"
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover group-hover:opacity-95 transition-opacity"
            sizes={`(max-width: ${size.w}px) 100vw, ${size.w}px`}
          />
        </a>
      </div>
    </div>
  );
}
