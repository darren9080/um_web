import type { Topic, Correction } from './definitions';

export const TOPICS: Topic[] = [
  {
    slug: 'ulsan-population-decline',
    title: '울산 인구 감소',
    summary: '울산광역시 인구는 2019년 이후 지속적으로 감소하고 있습니다. 제조업 고용 구조 변화와 청년층 유출이 주요 원인으로 꼽히며, 지역 소멸 위험을 둘러싼 정책 논의가 활발히 이뤄지고 있습니다. 울산매일은 인구·주택·고용 데이터를 통해 이 현안을 지속 추적합니다.',
    status: 'active',
    heroDatasetSlug: 'ulsan-population',
    relatedArticleSlugs: ['youth-entrepreneurship-fair-2026'],
    relatedDatasetSlugs: ['ulsan-population', 'ulsan-housing-price-index'],
    createdAt: '2024-01-15T00:00:00+09:00',
  },
  {
    slug: 'youth-startup-ecosystem',
    title: '청년창업 생태계',
    summary: '울산 청년 창업 생태계의 변화를 추적합니다. 울산경제진흥원, 울산테크노파크 등 지원기관의 보육 현황과 투자 유치, 실패·생존율까지 데이터로 기록합니다. 청년박람회·CEO아카데미 등 현장 취재와 통계를 연결합니다.',
    status: 'active',
    heroDatasetSlug: 'ulsan-youth-startup-count',
    relatedArticleSlugs: ['youth-entrepreneurship-fair-2026', 'iusm-ceo-academy-2026-summer'],
    relatedDatasetSlugs: ['ulsan-youth-startup-count', 'ulsan-employment-rate'],
    createdAt: '2024-03-10T00:00:00+09:00',
  },
  {
    slug: 'ulsan-culture-industry',
    title: '울산 문화산업',
    summary: '재즈페스티벌·문학상·마라톤·전시회 등 울산의 문화 인프라와 문화산업 규모를 추적합니다. 문화기반시설 현황, 공연 관람객 수, 문화예산 비중 데이터와 현장 기사를 연결해 울산 문화의 성장을 입체적으로 기록합니다.',
    status: 'active',
    heroDatasetSlug: 'ulsan-cultural-facilities',
    relatedArticleSlugs: ['2026-iusm-jazz-festival-preview', 'iusm-literary-award-2026-winners'],
    relatedDatasetSlugs: ['ulsan-cultural-facilities'],
    createdAt: '2024-02-20T00:00:00+09:00',
  },
  {
    slug: 'ulsan-sports',
    title: '울산 스포츠',
    summary: '울산 HD FC, 마라톤, 골프 등 울산 스포츠 현안을 다룹니다. 관중 수, 지역 스포츠 예산, 대회 성과 등을 데이터로 기록합니다.',
    status: 'active',
    heroDatasetSlug: undefined,
    relatedArticleSlugs: ['seoul-marathon-2026-results'],
    relatedDatasetSlugs: [],
    createdAt: '2024-04-01T00:00:00+09:00',
  },
];

// 정정 이력 (공개)
export const CORRECTIONS: Correction[] = [
  {
    id: 'c1',
    articleSlug: 'youth-entrepreneurship-fair-2026',
    articleTitle: '청년 창업 박람회 7월 개최… 스타트업 300개사 참가 예정',
    reason: '참가 기업 수 300개사 → 285개사로 정정. 박람회 사무국 공식 발표 기준으로 수정했습니다.',
    correctedAt: '2026-06-12T10:30:00+09:00',
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
