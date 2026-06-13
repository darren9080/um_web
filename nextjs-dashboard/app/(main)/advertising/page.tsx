import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '광고 문의',
  description: '울산매일UTV 광고·제휴 문의. 배너광고, 기사형 광고, 이벤트 스폰서십, 디지털 광고 패키지를 안내합니다.',
};

const AD_PACKAGES = [
  {
    name: '메인 배너',
    type: 'banner',
    sizes: ['728×90 (리더보드)', '300×250 (사각형)', '320×50 (모바일)'],
    positions: ['홈 상단', '기사 본문 내', '사이드바'],
    price: '월 50만원~',
    desc: '울산 지역 최다 조회수를 가진 뉴스 페이지 최상단 노출. 브랜드 인지도 향상에 효과적.',
    badge: '인기',
    badgeColor: 'bg-accent text-white',
  },
  {
    name: '기사형 광고',
    type: 'native',
    sizes: ['기사 형식 콘텐츠'],
    positions: ['뉴스 피드 내 노출', '검색 결과 포함'],
    price: '건당 150만원~',
    desc: '전문 에디터가 제작하는 네이티브 광고. 독자 신뢰도 높은 기사 형식으로 메시지 전달.',
    badge: '추천',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    name: '이벤트 스폰서십',
    type: 'sponsorship',
    sizes: ['행사 현장 노출', '디지털 콘텐츠 노출'],
    positions: ['재즈페스티벌', '마라톤', 'CEO 아카데미', '청년 창업 박람회'],
    price: '행사별 협의',
    desc: '울산 대표 문화·스포츠 행사 공식 스폰서. 현장 브랜딩 + 온라인 콘텐츠 노출 패키지.',
    badge: '고효과',
    badgeColor: 'bg-green-600 text-white',
  },
  {
    name: '디지털 광고 패키지',
    type: 'digital',
    sizes: ['구글 애드센스 연동', '프로그래매틱 광고'],
    positions: ['전 페이지 자동 노출', 'CPM/CPC 방식'],
    price: 'CPM 기준 협의',
    desc: '구글 애드센스 기반의 자동화 디지털 광고. 타겟 오디언스 최적화로 높은 전환율 제공.',
    badge: '자동화',
    badgeColor: 'bg-purple-600 text-white',
  },
];

export default function AdvertisingPage() {
  return (
    <div className="container-main py-12">
      {/* 헤더 */}
      <div className="max-w-article mx-auto mb-12">
        <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          Advertising
        </p>
        <h1
          className="text-display-sm font-bold text-neutral-900 mb-4 text-balance"
          style={{ fontFamily: '"Noto Serif KR", serif' }}
        >
          울산 최고 도달률,<br />울산매일UTV 광고
        </h1>
        <p className="text-body-lg text-neutral-600 leading-relaxed">
          울산 지역 1위 미디어 플랫폼에 광고하세요. 뉴스·이벤트·디지털 채널을 통해
          울산 핵심 독자층에게 직접 도달합니다.
        </p>
      </div>

      {/* 광고 패키지 */}
      <div className="mb-16">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">광고 상품</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AD_PACKAGES.map((pkg) => (
            <div key={pkg.name} className="rounded-xl border border-neutral-200 p-6 bg-white hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-heading-4 font-bold text-neutral-900">{pkg.name}</h3>
                <span className={`text-caption font-bold px-2 py-0.5 rounded ${pkg.badgeColor}`}>
                  {pkg.badge}
                </span>
              </div>
              <p className="text-body-sm text-neutral-600 mb-4 leading-relaxed">{pkg.desc}</p>
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-caption font-semibold text-neutral-500 mb-1">규격</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.sizes.map((s) => (
                      <span key={s} className="text-caption bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-caption font-semibold text-neutral-500 mb-1">노출 위치</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.positions.map((p) => (
                      <span key={p} className="text-caption bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-heading-4 font-bold text-accent">{pkg.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 문의 폼 */}
      <div className="max-w-article mx-auto">
        <div className="bg-brand-charcoal rounded-2xl p-8 text-white">
          <h2 className="text-heading-2 font-bold mb-2">광고 문의</h2>
          <p className="text-neutral-400 text-body-sm mb-8">
            아래 양식을 작성하시면 영업일 기준 1일 이내 담당자가 연락드립니다.
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption text-neutral-400 mb-1.5">회사명 *</label>
                <input
                  type="text"
                  required
                  placeholder="(주)예시회사"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-body-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-caption text-neutral-400 mb-1.5">담당자명 *</label>
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-body-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-caption text-neutral-400 mb-1.5">이메일 *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-body-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-caption text-neutral-400 mb-1.5">연락처 *</label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-body-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-caption text-neutral-400 mb-1.5">관심 광고 상품</label>
              <div className="flex flex-wrap gap-2">
                {AD_PACKAGES.map((pkg) => (
                  <label key={pkg.name} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-accent" />
                    <span className="text-body-sm text-neutral-300">{pkg.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-caption text-neutral-400 mb-1.5">문의 내용</label>
              <textarea
                rows={4}
                placeholder="광고 목적, 예산 범위, 원하는 기간 등을 자유롭게 작성해 주세요."
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-body-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto btn-accent px-8 py-3 rounded-xl text-base font-semibold"
            >
              문의 보내기
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm">
            <div>
              <p className="text-neutral-500 text-caption mb-1">광고팀 직통</p>
              <p className="text-white font-semibold">052-243-1001</p>
            </div>
            <div>
              <p className="text-neutral-500 text-caption mb-1">이메일</p>
              <p className="text-white font-semibold">ad@ulsanmaeil.co.kr</p>
            </div>
            <div>
              <p className="text-neutral-500 text-caption mb-1">팩스</p>
              <p className="text-white font-semibold">052-271-8790</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
