export interface Journalist {
  id: string;
  slug: string;
  name: string;
  nameKo: string;
  title: string;
  department: string;
  bio: string;
  photo: string;
  beats: string[];
  email?: string;
  twitter?: string;
  joinedYear: number;
  awards?: string[];
  education?: string;
}

export const JOURNALISTS: Journalist[] = [
  {
    id: 'j1',
    slug: 'lee-mina',
    name: '이미나',
    nameKo: '이미나',
    title: '문화부 선임기자',
    department: '문화부',
    bio: '울산매일신문 문화부에서 15년간 공연·예술·지역 문화행사를 취재해왔습니다. 울산재즈페스티벌 창설 기획부터 함께하며 울산 문화 씬의 성장을 기록하고 있습니다. 독자들이 문화를 더 가까이 느낄 수 있도록 현장 중심 기사를 씁니다.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    beats: ['공연·예술', '문화행사', '재즈·음악', '전시'],
    email: 'mina.lee@um.co.kr',
    joinedYear: 2011,
    awards: ['한국기자협회 이달의 기자상 (2019)', '울산광역시 문화상 언론 부문 (2022)'],
    education: '이화여자대학교 신문방송학과',
  },
  {
    id: 'j2',
    slug: 'park-junhyuk',
    name: '박준혁',
    nameKo: '박준혁',
    title: '경제부 기자',
    department: '경제부',
    bio: '스타트업·기업인 네트워킹·CEO 아카데미 등 비즈니스 분야를 전담합니다. 울산 지역 기업과 스타트업 생태계를 밀착 취재하며 지역 경제의 흐름을 전달합니다. 숫자와 현장을 연결하는 기사를 지향합니다.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    beats: ['스타트업', '기업·경영', 'CEO 아카데미', '지역 경제'],
    email: 'junhyuk.park@um.co.kr',
    joinedYear: 2016,
    education: '연세대학교 경제학과',
  },
  {
    id: 'j3',
    slug: 'choi-sunghoon',
    name: '최성훈',
    nameKo: '최성훈',
    title: '스포츠부 기자',
    department: '스포츠부',
    bio: '울산 HD FC와 지역 스포츠 전반을 담당합니다. K리그부터 마라톤·골프대회까지, 울산에서 열리는 스포츠 현장이라면 어디든 달려갑니다. 선수와 팬이 공감할 수 있는 생생한 스포츠 기사를 씁니다.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    beats: ['울산 HD FC', 'K리그', '마라톤·육상', '골프'],
    email: 'sunghoon.choi@um.co.kr',
    joinedYear: 2018,
    education: '한국체육대학교 스포츠미디어학과',
  },
  {
    id: 'j4',
    slug: 'kim-jisu',
    name: '김지수',
    nameKo: '김지수',
    title: '사회부 기자',
    department: '사회부',
    bio: '울산 시정·교육·복지 등 사회 전반을 취재합니다. 시민의 일상에 영향을 미치는 행정과 정책을 꼼꼼히 들여다보며, 독자가 알아야 할 정보를 쉽고 명확하게 전달하는 데 집중합니다.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    beats: ['울산 시정', '교육', '복지', '환경'],
    email: 'jisu.kim@um.co.kr',
    joinedYear: 2019,
    education: '부산대학교 신문방송학과',
  },
  {
    id: 'j5',
    slug: 'song-hyewon',
    name: '송혜원',
    nameKo: '송혜원',
    title: '인문학부 기자',
    department: '인문학부',
    bio: '인문학·역사·철학 분야를 담당합니다. 딱딱하게 느껴질 수 있는 인문학을 독자의 삶과 연결하는 기사를 씁니다. 울산문학상 등 지역 문학·인문 행사도 전담 취재합니다.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    beats: ['인문학', '역사·철학', '문학', '독서·출판'],
    email: 'hyewon.song@um.co.kr',
    joinedYear: 2020,
    education: '서울대학교 국어국문학과',
  },
  {
    id: 'j6',
    slug: 'jung-daeun',
    name: '정다은',
    nameKo: '정다은',
    title: '청년·미래부 기자',
    department: '청년·미래부',
    bio: '청년 일자리·창업·청년박람회 등 미래 세대의 이야기를 전합니다. 현장에서 만난 청년들의 목소리를 그대로 담는 기사를 지향합니다. 울산 청년 생태계의 변화를 가장 가까이에서 기록하고 있습니다.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    beats: ['청년 일자리', '창업', '청년박람회', '교육·진로'],
    email: 'daeun.jung@um.co.kr',
    joinedYear: 2022,
    education: '울산대학교 미디어커뮤니케이션학과',
  },
];

export function getJournalistByName(authorName: string): Journalist | undefined {
  const name = authorName.replace(' 기자', '').trim();
  return JOURNALISTS.find((j) => j.nameKo === name || j.name === name);
}
