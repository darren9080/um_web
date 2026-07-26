// 이벤트 브랜드 서브도메인 설정
// 마라톤(marathon.iusm.co.kr)처럼 정기 대표 이벤트를 각 서브도메인으로 분리.
// 단일 템플릿(app/brands/[brand])이 이 설정을 받아 브랜드별 사이트를 렌더.
// 새 브랜드 추가는 이 배열에 항목만 추가하면 됨.

export interface BrandProgramItem {
  step: string;   // '1주차' | 'DAY 1' | '대상' 등
  title: string;
  detail: string;
}

export interface EventBrand {
  slug: string;            // 서브도메인: 'academy'
  name: string;            // 'IUSM CEO 아카데미'
  shortName: string;       // 'CEO 아카데미'
  tagline: string;         // 히어로 한 줄
  description: string;     // 소개 문단
  accent: string;          // 브랜드 액센트 (hex)
  accentDark: string;      // 호버/딥
  heroImage: string;
  eventSlug: string;       // PLACEHOLDER_EVENTS 연결 (신청·일정·가격)
  infoTitle: string;       // 프로그램 섹션 제목
  program: BrandProgramItem[];
  highlights: { label: string; value: string }[];  // 핵심 지표(정원·기간 등)
  applyLabel: string;
}

export const EVENT_BRANDS: EventBrand[] = [
  {
    slug: 'academy',
    name: 'IUSM CEO 아카데미',
    shortName: 'CEO 아카데미',
    tagline: '울산 기업인의 리더십, 여기서 시작됩니다',
    description:
      '울산매일이 운영하는 지역 대표 기업인 교육 과정. 리더십·혁신·네트워킹을 주제로 현직 CEO와 전문가가 함께합니다. 수료 후에는 동문 네트워크에 참여해 지역 경제 리더로 성장할 수 있습니다.',
    accent: '#1E3A5F',
    accentDark: '#152C48',
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    eventSlug: 'ceo-academy-summer-2026',
    infoTitle: '커리큘럼',
    program: [
      { step: '1주차', title: '리더십의 본질', detail: '변화하는 경영 환경과 리더의 역할 재정의' },
      { step: '2주차', title: '혁신과 성장 전략', detail: '지역 기업의 스케일업 케이스 스터디' },
      { step: '3주차', title: '조직과 사람', detail: '인재 확보·조직문화·세대 통합 리더십' },
      { step: '4주차', title: '네트워킹 & 프로젝트', detail: '동문·투자자 네트워킹, 실전 프로젝트 발표' },
    ],
    highlights: [
      { label: '과정 기간', value: '4주 · 매주 화' },
      { label: '정원', value: '30명 한정' },
      { label: '수료 혜택', value: '동문 네트워크' },
    ],
    applyLabel: '수강 신청',
  },
  {
    slug: 'jazz',
    name: '울산매일 재즈 페스티벌',
    shortName: '재즈 페스티벌',
    tagline: '가을밤, 태화강에 재즈가 흐른다',
    description:
      '국내외 정상급 아티스트가 함께하는 울산 대표 음악 축제. 메인 스테이지부터 라운지 세션까지, 사흘간 도시 곳곳이 무대가 됩니다. 온 가족이 즐기는 울산의 가을 대표 문화 이벤트입니다.',
    accent: '#6D28D9',
    accentDark: '#581C9E',
    heroImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&q=80',
    eventSlug: 'iusm-jazz-festival-2026',
    infoTitle: '라인업 & 프로그램',
    program: [
      { step: 'DAY 1', title: '오프닝 나이트', detail: '메인 스테이지 · 헤드라이너 공연' },
      { step: 'DAY 2', title: '재즈 & 시티', detail: '라운지 세션 · 신인 아티스트 무대' },
      { step: 'DAY 3', title: '피날레', detail: '전 아티스트 합동 잼 세션 · 불꽃' },
    ],
    highlights: [
      { label: '기간', value: '3일간' },
      { label: '무대', value: '3개 스테이지' },
      { label: '참가팀', value: '국내외 20팀' },
    ],
    applyLabel: '티켓 예매',
  },
  {
    slug: 'award',
    name: '울산매일 문학상',
    shortName: '문학상',
    tagline: '울산의 이야기를 기록하는 새로운 목소리',
    description:
      '15년 전통의 울산매일 문학상. 소설·시·수필 부문에서 재능 있는 작가를 발굴하고 지역 문학의 저변을 넓혀 왔습니다. 등단을 꿈꾸는 누구나 응모할 수 있습니다.',
    accent: '#0F766E',
    accentDark: '#0B5952',
    heroImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    eventSlug: 'iusm-literary-award-2026',
    infoTitle: '공모 요강',
    program: [
      { step: '부문', title: '소설 · 시 · 수필', detail: '부문별 중복 응모 불가, 미발표 창작물' },
      { step: '자격', title: '제한 없음', detail: '연령·지역 제한 없이 누구나 응모 가능' },
      { step: '시상', title: '대상 및 부문상', detail: '상금과 함께 지면·온라인 게재 기회 제공' },
    ],
    highlights: [
      { label: '전통', value: '제15회' },
      { label: '부문', value: '소설·시·수필' },
      { label: '응모 자격', value: '제한 없음' },
    ],
    applyLabel: '작품 응모',
  },
];

export function getBrand(slug: string): EventBrand | undefined {
  return EVENT_BRANDS.find((b) => b.slug === slug);
}

export const BRAND_SLUGS = new Set(EVENT_BRANDS.map((b) => b.slug));
