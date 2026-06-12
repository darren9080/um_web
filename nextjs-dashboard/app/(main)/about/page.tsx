import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '울산매일UTV 소개',
  description: '1992년 창간한 울산 최초·최고의 조간신문 울산매일과 UTV가 결합한 울산 대표 미디어 플랫폼입니다.',
};

const TEAM_STRUCTURE = [
  {
    dept: '뉴스국',
    color: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    teams: [
      { name: '취재팀', desc: '사회·정치·경제·문화·스포츠 현장 취재 및 기사 작성' },
      { name: '편집팀', desc: '기사 교열·데스크 검토·지면 배치·온라인 발행' },
      { name: '사진팀', desc: '현장 사진 취재·메타 관리·아카이브 운영' },
    ],
  },
  {
    dept: '이벤트국',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    teams: [
      { name: '행사팀', desc: '재즈페스티벌·마라톤·문학상 등 대형 행사 기획·운영' },
      { name: '아카데미팀', desc: 'CEO 아카데미·청년 창업 박람회·세미나 운영' },
    ],
  },
  {
    dept: '광고국',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    teams: [
      { name: '배너광고팀', desc: '온라인·지면 광고 기획·영업·소재 관리' },
      { name: '디지털광고팀', desc: '구글 애드센스·프로그래매틱 광고 운영 및 수익 최적화' },
    ],
  },
];

const COMPANY_INFO = [
  { label: '법인명', value: '(주)울산매일신문사' },
  { label: '제호', value: '울산매일 — 울산최초, 최고의 조간신문' },
  { label: '발행·편집인', value: '이연희' },
  { label: '청소년보호책임자', value: '김진영' },
  { label: '등록번호', value: '울산 가 01002 / 울산 아 01104' },
  { label: '등록일', value: '1992년 01월 28일' },
  { label: '사업자번호', value: '620-81-14006' },
  { label: '주소', value: '울산광역시 남구 두왕로 337-1, 리더스파크 3층' },
  { label: '대표전화', value: '052-243-1001' },
  { label: '팩스', value: '052-271-8790' },
];

export default function AboutPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-article mx-auto">

        {/* 헤더 */}
        <div className="mb-12">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            About 울산매일UTV
          </p>
          <h1
            className="text-display-sm font-bold text-neutral-900 mb-6 text-balance"
            style={{ fontFamily: '"Noto Serif KR", serif' }}
          >
            울산의 이야기를<br />울산과 함께
          </h1>
          <p className="text-body-lg text-neutral-600 leading-relaxed">
            울산매일UTV는 1992년 창간한 울산 최초의 조간신문 <strong>울산매일</strong>과
            영상·디지털 미디어 <strong>UTV</strong>가 결합한 울산 대표 미디어 플랫폼입니다.
            사회·문화·스포츠·경제 분야의 깊이 있는 보도와 재즈페스티벌, 마라톤, CEO 아카데미 등
            지역을 대표하는 이벤트를 운영합니다.
          </p>
        </div>

        {/* 팀 구조 */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-6" id="team">조직 구성</h2>
          <div className="space-y-5">
            {TEAM_STRUCTURE.map(({ dept, color, badge, teams }) => (
              <div key={dept} className={`rounded-xl border p-5 ${color}`}>
                <h3 className="text-heading-4 font-bold text-neutral-900 mb-3">{dept}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {teams.map(({ name, desc }) => (
                    <div key={name} className="bg-white rounded-lg p-3 border border-white/60">
                      <span className={`inline-block text-caption font-semibold px-2 py-0.5 rounded mb-1.5 ${badge}`}>
                        {name}
                      </span>
                      <p className="text-body-sm text-neutral-600">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 편집 원칙 */}
        <section className="mb-12" id="editorial">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-4">편집 원칙</h2>
          <ul className="space-y-3">
            {[
              '사실에 근거한 보도 — 모든 기사는 복수의 출처를 확인한 후 작성합니다.',
              '독립적 편집권 — 광고주·스폰서·외부 압력으로부터 편집 내용은 완전히 독립됩니다.',
              '다양한 시각 — 다양한 배경과 관점을 가진 취재원과 필자의 목소리를 반영합니다.',
              '투명한 수정 — 오류 발견 시 즉시 수정하고 수정 내역을 기사에 명시합니다.',
              '언론 윤리 준수 — 한국신문협회 윤리강령 및 기자협회 윤리실천요강을 준수합니다.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-body-sm text-neutral-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link href="/ethics" className="text-body-sm text-accent font-semibold hover:underline">
              윤리강령 전문 보기 →
            </Link>
            <Link href="/ai-guidelines" className="text-body-sm text-accent font-semibold hover:underline">
              AI 활용 가이드라인 →
            </Link>
          </div>
        </section>

        {/* 회사 정보 */}
        <section className="mb-12" id="company">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-4">사업자 정보</h2>
          <div className="rounded-xl border border-neutral-200 overflow-hidden">
            {COMPANY_INFO.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex gap-4 px-5 py-3 text-body-sm ${i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
              >
                <span className="w-36 shrink-0 text-neutral-500 font-medium">{label}</span>
                <span className="text-neutral-900">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 문의 */}
        <section id="contact" className="bg-brand-charcoal rounded-2xl p-8 text-white">
          <h2 className="text-heading-2 font-bold mb-2">문의하기</h2>
          <p className="text-neutral-400 text-body-sm mb-6">
            광고·제휴·기업 멤버십 문의는 아래로 연락해 주세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-body-sm">
            {[
              { label: '대표전화', value: '052-243-1001' },
              { label: '팩스', value: '052-271-8790' },
              { label: '일반 문의', value: 'contact@ulsanmaeil.co.kr' },
              { label: '광고·제휴', value: 'ad@ulsanmaeil.co.kr' },
              { label: '기업 멤버십', value: 'biz@ulsanmaeil.co.kr' },
              { label: '이벤트 제안', value: 'event@ulsanmaeil.co.kr' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-neutral-400 text-caption mb-1">{label}</p>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/advertising"
              className="inline-block bg-accent text-white font-semibold text-body-sm px-6 py-2.5 rounded-xl hover:bg-accent-dark transition-colors"
            >
              광고 문의하기
            </Link>
            <Link
              href="/membership"
              className="inline-block bg-white text-brand-charcoal font-semibold text-body-sm px-6 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              멤버십 알아보기
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
