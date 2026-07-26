import { getActiveBanners, type AdPlacement } from '@/app/lib/ads';
import AdSlot from './ad-slot';

/**
 * 서버 컴포넌트 래퍼 — 요청 시점에 활성 배너를 필터해 광고 슬롯을 렌더.
 * 활성 배너가 없으면 슬롯 자체를 렌더하지 않는다(빈 공간 방지).
 */
export default function AdSlotServer({
  placement, className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const active = getActiveBanners(placement);
  if (active.length === 0) return null;
  return <AdSlot placement={placement} banners={active} className={className} />;
}
