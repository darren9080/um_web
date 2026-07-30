'use client';

import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, AD_FORMAT, type AdFormat } from '@/app/lib/ads';

declare global {
  interface Window { adsbygoogle?: Record<string, unknown>[] }
}

interface Props {
  slot: string;
  format?: AdFormat;
  className?: string;
  minHeight?: number;
}

/**
 * Google AdSense 광고 단위.
 * - ADSENSE_CLIENT 미설정(개발·프리뷰): 규격 플레이스홀더 렌더
 * - 설정 시: <ins class="adsbygoogle"> 렌더 후 adsbygoogle.push()
 * - '광고' 라벨 상시 노출(취재·광고 구별)
 */
export default function AdSense({ slot, format = 'auto', className = '', minHeight }: Props) {
  const cfg = AD_FORMAT[format];
  const pushed = useRef(false);
  const h = minHeight ?? cfg.minHeight;

  useEffect(() => {
    if (!ADSENSE_CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense 스크립트 미로드 시 무시 */
    }
  }, []);

  // 미설정: 플레이스홀더 (레이아웃 검증용)
  if (!ADSENSE_CLIENT) {
    return (
      <div
        className={`relative w-full flex items-center justify-center rounded-lg bg-neutral-100 border border-dashed border-neutral-300 ${className}`}
        style={{ minHeight: h }}
      >
        <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-white/90">광고</span>
        <span className="text-caption text-neutral-400">Google AdSense · {cfg.label}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <span className="absolute top-1.5 left-1.5 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-white/90">광고</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: h }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={cfg.adFormat}
        {...(cfg.responsive ? { 'data-full-width-responsive': 'true' } : {})}
        {...(cfg.layout ? { 'data-ad-layout': cfg.layout } : {})}
      />
    </div>
  );
}
