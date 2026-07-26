// 울산매일마라톤 — 통합 데이터 레이어 (placeholder)
// 기존 ulsanmaeilmara.com 의 대회·기록·커뮤니티를 언론사 웹으로 통합.
// 회원은 소셜 재가입 유도 + 미인증 인원은 기록만 이관(하이브리드).

export type MarathonStatus = 'upcoming' | 'open' | 'closed' | 'ended';

export type CourseType = 'full' | 'half' | '10km' | '5km';

export const COURSE_LABELS: Record<CourseType, string> = {
  full: '풀코스 42.195km',
  half: '하프 21.0975km',
  '10km': '10km',
  '5km': '5km 건강달리기',
};

export const COURSE_SHORT: Record<CourseType, string> = {
  full: '풀',
  half: '하프',
  '10km': '10km',
  '5km': '5km',
};

export interface MarathonCourse {
  type: CourseType;
  price: number;
  limit: number;
  registered: number;
}

export interface MarathonRace {
  year: number;
  edition: number;      // 회차
  title: string;
  status: MarathonStatus;
  date: string;         // 대회일
  registrationOpen?: string;
  registrationDeadline?: string;
  location: string;
  startPoint: string;
  organizer: string;
  heroImage: string;
  description: string;
  courses: MarathonCourse[];
  finishers?: number;   // 완주 인원 (지난 대회)
  weather?: string;
}

export interface RaceRecord {
  id: string;
  year: number;
  bib: string;          // 배번
  name: string;
  gender: 'M' | 'F';
  ageGroup: string;     // 연령대
  course: CourseType;
  recordTime: string;   // HH:MM:SS
  overallRank: number;  // 종합 순위
  courseRank: number;   // 부문 순위
}

export type PostCategory = 'review' | 'group' | 'qna' | 'free';

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  review: '완주후기',
  group: '함께달려요',
  qna: '질문답변',
  free: '자유게시판',
};

export const POST_CATEGORY_COLORS: Record<PostCategory, string> = {
  review: 'bg-red-50 text-red-700',
  group:  'bg-blue-50 text-blue-700',
  qna:    'bg-amber-50 text-amber-700',
  free:   'bg-neutral-100 text-neutral-600',
};

export interface CommunityPost {
  id: string;
  category: PostCategory;
  title: string;
  author: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  views: number;
  likes: number;
  commentCount: number;
  migrated?: boolean;   // 기존 사이트 이관 글
}

// ─── 대회 (회차별) ────────────────────────────────────────────────────────────

export const MARATHON_RACES: MarathonRace[] = [
  {
    year: 2026,
    edition: 22,
    title: '제22회 울산매일마라톤대회',
    status: 'open',
    date: '2026-10-18',
    registrationOpen: '2026-07-01',
    registrationDeadline: '2026-09-30',
    location: '울산광역시 문수월드컵경기장 일원',
    startPoint: '문수월드컵경기장',
    organizer: '울산매일신문사',
    heroImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80',
    description: '태화강을 따라 달리는 울산 최대 규모 시민 마라톤. 풀코스부터 5km 건강달리기까지 온 가족이 함께합니다. 완주 기록은 공인 계측으로 기록실에 영구 보관됩니다.',
    courses: [
      { type: 'full', price: 40000, limit: 3000, registered: 1842 },
      { type: 'half', price: 35000, limit: 4000, registered: 2967 },
      { type: '10km', price: 30000, limit: 5000, registered: 3521 },
      { type: '5km', price: 20000, limit: 3000, registered: 1204 },
    ],
  },
  {
    year: 2025,
    edition: 21,
    title: '제21회 울산매일마라톤대회',
    status: 'ended',
    date: '2025-10-19',
    location: '울산광역시 문수월드컵경기장 일원',
    startPoint: '문수월드컵경기장',
    organizer: '울산매일신문사',
    heroImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80',
    description: '2025년 제21회 대회는 역대 최다 인원이 참가한 가운데 성황리에 마무리되었습니다.',
    courses: [
      { type: 'full', price: 38000, limit: 3000, registered: 2891 },
      { type: 'half', price: 33000, limit: 4000, registered: 3854 },
      { type: '10km', price: 28000, limit: 5000, registered: 4712 },
      { type: '5km', price: 18000, limit: 3000, registered: 2643 },
    ],
    finishers: 13210,
    weather: '맑음, 14°C',
  },
  {
    year: 2024,
    edition: 20,
    title: '제20회 울산매일마라톤대회',
    status: 'ended',
    date: '2024-10-20',
    location: '울산광역시 문수월드컵경기장 일원',
    startPoint: '문수월드컵경기장',
    organizer: '울산매일신문사',
    heroImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=80',
    description: '창설 20주년을 맞은 뜻깊은 대회. 기념 메달과 함께 20년 역사를 되새겼습니다.',
    courses: [
      { type: 'full', price: 35000, limit: 2500, registered: 2401 },
      { type: 'half', price: 30000, limit: 3500, registered: 3312 },
      { type: '10km', price: 25000, limit: 4500, registered: 4108 },
      { type: '5km', price: 15000, limit: 2500, registered: 2287 },
    ],
    finishers: 11842,
    weather: '흐림, 16°C',
  },
];

// ─── 기록 (기록실) ───────────────────────────────────────────────────────────

export const RACE_RECORDS: RaceRecord[] = [
  { id: 'r1', year: 2025, bib: '10023', name: '김준호', gender: 'M', ageGroup: '30대', course: 'full', recordTime: '02:34:12', overallRank: 1, courseRank: 1 },
  { id: 'r2', year: 2025, bib: '10087', name: '이상현', gender: 'M', ageGroup: '40대', course: 'full', recordTime: '02:41:55', overallRank: 2, courseRank: 2 },
  { id: 'r3', year: 2025, bib: '10142', name: '박민재', gender: 'M', ageGroup: '20대', course: 'full', recordTime: '02:45:33', overallRank: 3, courseRank: 3 },
  { id: 'r4', year: 2025, bib: '20015', name: '정수연', gender: 'F', ageGroup: '30대', course: 'full', recordTime: '02:58:41', overallRank: 12, courseRank: 1 },
  { id: 'r5', year: 2025, bib: '30221', name: '최영수', gender: 'M', ageGroup: '50대', course: 'half', recordTime: '01:18:22', overallRank: 1, courseRank: 1 },
  { id: 'r6', year: 2025, bib: '30455', name: '한지민', gender: 'F', ageGroup: '20대', course: 'half', recordTime: '01:29:07', overallRank: 8, courseRank: 1 },
  { id: 'r7', year: 2025, bib: '40332', name: '오세훈', gender: 'M', ageGroup: '40대', course: '10km', recordTime: '00:36:14', overallRank: 1, courseRank: 1 },
  { id: 'r8', year: 2025, bib: '40891', name: '강예린', gender: 'F', ageGroup: '30대', course: '10km', recordTime: '00:42:38', overallRank: 15, courseRank: 1 },
  { id: 'r9', year: 2024, bib: '10011', name: '김준호', gender: 'M', ageGroup: '30대', course: 'full', recordTime: '02:36:48', overallRank: 1, courseRank: 1 },
  { id: 'r10', year: 2024, bib: '10203', name: '윤태경', gender: 'M', ageGroup: '30대', course: 'full', recordTime: '02:43:19', overallRank: 2, courseRank: 2 },
  { id: 'r11', year: 2024, bib: '20044', name: '정수연', gender: 'F', ageGroup: '30대', course: 'full', recordTime: '03:01:22', overallRank: 14, courseRank: 1 },
  { id: 'r12', year: 2024, bib: '30112', name: '최영수', gender: 'M', ageGroup: '50대', course: 'half', recordTime: '01:19:44', overallRank: 1, courseRank: 1 },
  { id: 'r13', year: 2024, bib: '40556', name: '배성우', gender: 'M', ageGroup: '20대', course: '10km', recordTime: '00:37:02', overallRank: 1, courseRank: 1 },
  { id: 'r14', year: 2024, bib: '45123', name: '문가영', gender: 'F', ageGroup: '40대', course: '5km', recordTime: '00:24:51', overallRank: 3, courseRank: 1 },
];

// ─── 커뮤니티 ────────────────────────────────────────────────────────────────

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    category: 'review',
    title: '제21회 대회 첫 풀코스 완주 후기 (서브4 성공!)',
    author: '달리는수연',
    content: '드디어 첫 풀코스를 3시간 58분에 완주했습니다! 태화강 코스가 생각보다 평탄해서 초보자도 도전해볼 만해요. 30km 지점 급수대에서 만난 분들 덕분에 끝까지 완주할 수 있었습니다. 내년에는 서브3.5에 도전합니다.',
    createdAt: '2025-10-21T14:20:00+09:00',
    views: 1842, likes: 127, commentCount: 34,
  },
  {
    id: 'p2',
    category: 'group',
    title: '[울산 남구] 주말 아침 태화강 연습 모임 구합니다',
    author: '남구러너',
    content: '매주 토요일 오전 6시 태화강 국가정원에서 10km 페이스런 하실 분 모집합니다. 페이스는 5:30~6:00 정도예요. 대회 준비 함께 해요!',
    createdAt: '2026-07-10T09:15:00+09:00',
    views: 523, likes: 41, commentCount: 18,
  },
  {
    id: 'p3',
    category: 'qna',
    title: '풀코스 첫 도전인데 훈련 기간 얼마나 잡아야 할까요?',
    author: '초보러너김',
    content: '평소 10km는 뛰는데 풀코스는 처음입니다. 10월 대회까지 3개월 정도 남았는데 준비 가능할까요? 주간 훈련량 조언 부탁드립니다.',
    createdAt: '2026-07-14T21:30:00+09:00',
    views: 687, likes: 22, commentCount: 27,
  },
  {
    id: 'p4',
    category: 'review',
    title: '20주년 기념 대회 메달 자랑합니다',
    author: '메달수집가',
    content: '제20회 20주년 기념 메달 정말 예쁘네요. 역대 메달들과 함께 찍어봤습니다. 울산매일마라톤 20년 역사가 느껴져서 뭉클하네요.',
    createdAt: '2024-10-22T18:45:00+09:00',
    views: 2103, likes: 189, commentCount: 45,
    migrated: true,
  },
  {
    id: 'p5',
    category: 'free',
    title: '대회 당일 주차 정보 공유합니다',
    author: '울산토박이',
    content: '문수월드컵경기장 주차장이 금방 차니까 대중교통 이용하시거나 인근 공영주차장 미리 알아두세요. 작년에 주차 때문에 스타트 놓칠 뻔했습니다.',
    createdAt: '2026-07-08T11:00:00+09:00',
    views: 941, likes: 56, commentCount: 12,
  },
];

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

export function getRaceByYear(year: number): MarathonRace | undefined {
  return MARATHON_RACES.find((r) => r.year === year);
}

export function getCurrentRace(): MarathonRace {
  return MARATHON_RACES.find((r) => r.status === 'open' || r.status === 'upcoming') ?? MARATHON_RACES[0];
}

export function getPastRaces(): MarathonRace[] {
  return MARATHON_RACES.filter((r) => r.status === 'ended');
}

export function searchRecords(query: {
  name?: string; bib?: string; year?: number; course?: CourseType;
}): RaceRecord[] {
  return RACE_RECORDS.filter((r) => {
    if (query.year && r.year !== query.year) return false;
    if (query.course && r.course !== query.course) return false;
    if (query.name && !r.name.includes(query.name.trim())) return false;
    if (query.bib && !r.bib.includes(query.bib.trim())) return false;
    return true;
  }).sort((a, b) => a.overallRank - b.overallRank);
}

export function getPostById(id: string): CommunityPost | undefined {
  return COMMUNITY_POSTS.find((p) => p.id === id);
}

export function totalRegistered(race: MarathonRace): number {
  return race.courses.reduce((sum, c) => sum + c.registered, 0);
}

export function totalCapacity(race: MarathonRace): number {
  return race.courses.reduce((sum, c) => sum + c.limit, 0);
}
