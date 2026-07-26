import { getActiveBanners, type AdPlacement } from '@/app/lib/ads';
import AdRow from './ad-row';

/**
 * 서버 래퍼 — 요청 시점에 활성 배너를 필터해 가로형 3분할 광고 로우를 렌더.
 * 활성 배너가 없으면 렌더하지 않는다.
 */
export default function AdRowServer({
  placement, count = 3, className,
}: {
  placement: AdPlacement;
  count?: number;
  className?: string;
}) {
  const active = getActiveBanners(placement);
  if (active.length === 0) return null;
  return <AdRow banners={active} count={count} className={className} />;
}
