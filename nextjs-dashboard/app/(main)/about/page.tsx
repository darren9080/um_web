import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IUSM 소개',
  description: 'IUSM은 사회·문화·인문·스포츠 분야 미디어와 스타트업 육성, 기업인 네트워킹을 결합한 플랫폼입니다.',
};

export default function AboutPage() {
  return (
    <div className="container-main py-12">
      {/* 소개 헤더 */}
      <div className="max-w-article mx-auto">
        <div className="mb-12">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            About IUSM
          </p>
          <h1 className="text-display-sm font-bold text-neutral-900 mb-6 text-balance" style={{ fontFamily: 'Noto Serif KR, serif' }}>
            사람과 문화를 잇는<br />미디어 플랫폼
          </h1>
          <p className="text-body-lg text-neutral-600 leading-relaxed">
            IUSM은 사회·문화·인문·스포츠 분야의 깊이 있는 콘텐츠와 다양한 이벤트를 통해
            사람과 사람, 아이디어와 아이디어를 연결하는 미디어 플랫폼입니다.
          </p>
        </div>

        {/* 미션 */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-4" id="mission">
            우리의 미션
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: '📰',
                title: '신뢰할 수 있는 미디어',
                desc: '검증된 취재와 깊이 있는 분석으로 독자가 신뢰할 수 있는 콘텐츠를 제공합니다.',
              },
              {
                icon: '🎭',
                title: '문화를 연결하다',
                desc: '재즈, 문학, 마라톤 등 다양한 이벤트로 사람과 문화를 연결합니다.',
              },
              {
                icon: '🚀',
                title: '혁신을 지원하다',
                desc: '청년 창업가와 기업인의 성장을 돕는 프로그램과 네트워킹을 운영합니다.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-heading-4 font-bold text-neutral-900 mb-2">{title}</h3>
                <p className="text-body-sm text-neutral-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 편집 원칙 */}
        <section className="mb-12" id="editorial">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-4">편집 원칙</h2>
          <div className="prose-article space-y-4">
            <p className="text-body text-neutral-700 leading-relaxed">
              IUSM은 다음의 원칙을 바탕으로 콘텐츠를 제작합니다.
            </p>
            <ul className="space-y-3">
              {[
                '사실에 근거한 보도 — 모든 기사는 복수의 출처 확인 후 작성됩니다.',
                '독립적 편집권 — 광고주와 스폰서로부터 편집 내용은 완전히 독립됩니다.',
                '다양한 시각 — 다양한 배경과 관점을 가진 필자의 글을 게재합니다.',
                '투명한 수정 — 오류 발견 시 즉시 수정하고 수정 내역을 명시합니다.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-body-sm text-neutral-700">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-news shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 문의 */}
        <section id="contact" className="bg-primary rounded-2xl p-8 text-white">
          <h2 className="text-heading-2 font-bold mb-2">문의하기</h2>
          <p className="text-neutral-400 text-body-sm mb-6">
            광고·제휴·기업 멤버십 문의는 아래로 연락해 주세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-body-sm">
            <div>
              <p className="text-neutral-400 text-caption mb-1">일반 문의</p>
              <p className="text-white font-semibold">contact@iusm.co.kr</p>
            </div>
            <div>
              <p className="text-neutral-400 text-caption mb-1">광고·제휴</p>
              <p className="text-white font-semibold">ad@iusm.co.kr</p>
            </div>
            <div>
              <p className="text-neutral-400 text-caption mb-1">기업 멤버십</p>
              <p className="text-white font-semibold">biz@iusm.co.kr</p>
            </div>
            <div>
              <p className="text-neutral-400 text-caption mb-1">이벤트 제안</p>
              <p className="text-white font-semibold">event@iusm.co.kr</p>
            </div>
          </div>
          <Link href="/membership" className="inline-block bg-white text-primary font-semibold text-body-sm px-6 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors">
            멤버십 알아보기
          </Link>
        </section>
      </div>
    </div>
  );
}
