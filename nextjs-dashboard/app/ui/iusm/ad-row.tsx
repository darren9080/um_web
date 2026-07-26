'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Banner } from '@/app/lib/cms/definitions';

interface Props {
  banners: Banner[];
  count?: number;
  className?: string;
}

/**
 * 가로형 광고 로우 — 데스크톱에서 count개(기본 3) 가로 배치,
 * 화면이 좁아지면 세로로 스택(grid-cols-1 → sm:grid-cols-3).
 * - '광고' 라벨 상시 노출(취재·광고 구별)
 * - 배너가 count보다 많으면 랜덤 시작점에서 순환 배치(임프레션 분배)
 * - 배너가 부족하면 있는 만큼만 렌더
 */
export default function AdRow({ banners, count = 3, className = '' }: Props) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (banners.length > 1) setOffset(Math.floor(Math.random() * banners.length));
  }, [banners.length]);

  if (banners.length === 0) return null;

  const cellCount = Math.min(count, banners.length);
  const cells = Array.from({ length: cellCount }, (_, i) => banners[(offset + i) % banners.length]);
  const gridCols = cellCount === 1 ? 'sm:grid-cols-1' : cellCount === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4 ${className}`}>
      {cells.map((banner, i) => (
        <div
          key={`${banner.id}-${i}`}
          className="relative w-full overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200"
          style={{ aspectRatio: '3 / 2' }}
        >
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
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </a>
        </div>
      ))}
    </div>
  );
}
