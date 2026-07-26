import { banners } from '@/app/lib/cms/sample-data';
import type { Banner } from '@/app/lib/cms/definitions';

export type AdPlacement = Banner['placement']; // 'top' | 'main' | 'sidebar' | 'article_inline'

// IAB 표준 규격 매핑 (placement → 광고 슬롯 사이즈)
export const AD_SIZES: Record<AdPlacement, { w: number; h: number; label: string; ratio: string }> = {
  top:            { w: 970, h: 90,  label: '리더보드', ratio: '970 / 90' },
  main:           { w: 970, h: 250, label: '빌보드',   ratio: '970 / 250' },
  sidebar:        { w: 300, h: 250, label: '미디엄 렉탱글', ratio: '300 / 250' },
  article_inline: { w: 300, h: 250, label: '인아티클', ratio: '300 / 250' },
};

/**
 * 지정 위치의 활성 배너 목록 반환.
 * - isActive
 * - 노출 기간(startsAt ~ endsAt) 내
 * - sortOrder 오름차순
 *
 * TODO: 실제 서비스에서는 Supabase banners 테이블 쿼리로 교체.
 */
export function getActiveBanners(placement: AdPlacement, now: Date = new Date()): Banner[] {
  const ts = now.getTime();
  return banners
    .filter((b) => b.placement === placement)
    .filter((b) => b.isActive)
    .filter((b) => {
      const start = new Date(b.startsAt).getTime();
      const end = new Date(b.endsAt).getTime();
      const startOk = isNaN(start) || ts >= start;
      const endOk = isNaN(end) || ts <= end;
      return startOk && endOk;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
