import AdSense from './adsense';

/**
 * 가로형 광고 로우 — 데스크톱 3분할(sm:grid-cols-3), 모바일 세로 스택(grid-cols-1).
 * 각 셀은 반응형 AdSense 광고 단위.
 * slots: 셀별 광고 단위 ID 배열. 하나만 주면 반복 사용.
 */
export default function AdSenseRow({
  slots, count = 3, className = '',
}: {
  slots: string | string[];
  count?: number;
  className?: string;
}) {
  const list = Array.isArray(slots) ? slots : Array.from({ length: count }, () => slots);
  const cols = count === 1 ? 'sm:grid-cols-1' : count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${cols} gap-4 ${className}`}>
      {list.slice(0, count).map((slot, i) => (
        <AdSense key={i} slot={slot} format="rectangle" />
      ))}
    </div>
  );
}
