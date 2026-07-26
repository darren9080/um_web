// Google AdSense 설정
// 실제 노출은 승인된 퍼블리셔 계정과 광고 단위(슬롯) ID가 필요.
// 미설정(개발·프리뷰) 시 AdSense 규격 플레이스홀더로 렌더.

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''; // 'ca-pub-XXXXXXXXXXXXXXXX'

// 위치별 광고 단위(슬롯) ID — AdSense 대시보드에서 발급 후 env로 주입
export const ADSENSE_SLOTS = {
  homeTop:       process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP ?? '',
  homeMain:      process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MAIN ?? '',
  sidebar:       process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? '',
  articleInline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? '',
} as const;

export type AdFormat = 'auto' | 'horizontal' | 'rectangle' | 'in-article';

// AdSense 광고 형식별 속성 + 최소 높이(레이아웃 시프트 방지)
export const AD_FORMAT: Record<AdFormat, {
  adFormat: string;
  responsive?: boolean;
  layout?: string;
  minHeight: number;
  label: string;
}> = {
  auto:         { adFormat: 'auto',       responsive: true,  minHeight: 90,  label: '반응형' },
  horizontal:   { adFormat: 'horizontal', responsive: true,  minHeight: 90,  label: '가로형' },
  rectangle:    { adFormat: 'rectangle',  responsive: true,  minHeight: 250, label: '사각형' },
  'in-article': { adFormat: 'fluid',      layout: 'in-article', minHeight: 200, label: '인아티클' },
};
