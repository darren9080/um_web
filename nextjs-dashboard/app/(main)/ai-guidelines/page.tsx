import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 활용 가이드라인',
  description: '울산매일UTV AI 활용 가이드라인. 기사 작성, 이미지 생성, 번역 등 AI 도구 활용 원칙과 표기 기준을 안내합니다.',
};

const GUIDELINE_SECTIONS = [
  {
    title: '1. 기본 원칙',
    icon: '⚖️',
    items: [
      'AI는 기자의 취재와 판단을 보조하는 도구이며, 최종 보도 결정과 책임은 사람 기자에게 있다.',
      'AI가 생성한 콘텐츠는 반드시 기자가 직접 사실 확인 후 수정·보완하여 사용한다.',
      'AI 도구 활용 여부는 독자에게 투명하게 공개한다.',
      'AI 생성 결과물을 수정 없이 그대로 기사로 사용하는 것을 금지한다.',
    ],
  },
  {
    title: '2. 기사 작성 보조',
    icon: '✍️',
    items: [
      '보도자료 기반 초안 생성 시 원문 의존도(similarity)가 70% 이상이면 추가 독자 취재를 진행한다.',
      'AI 초안을 사용한 기사에는 편집 노트에 "AI 초안 보조 사용" 을 기록한다(독자에게는 선택적 표기).',
      '팩트체크, 맥락 분석, 심층 해설은 반드시 기자의 직접 판단으로 작성한다.',
      'AI가 제안한 SEO 키워드·메타 설명은 기자가 검토 후 채택 여부를 결정한다.',
    ],
  },
  {
    title: '3. AI 생성 이미지',
    icon: '🖼️',
    items: [
      'AI 생성 이미지는 반드시 "AI 생성 이미지" 캡션을 표기하고 실제 취재 사진과 명확히 구분한다.',
      '범죄 피의자, 실존 인물을 모사한 AI 이미지 생성을 금지한다.',
      '사건·사고·재해 현장의 AI 생성 이미지 사용을 금지한다.',
      'AI 이미지 생성에 사용한 프롬프트와 모델명을 내부 기록으로 보관한다.',
    ],
  },
  {
    title: '4. 번역 및 요약',
    icon: '🌐',
    items: [
      'AI 번역 결과는 원문과 대조 확인 후 사용하며, 뉘앙스·문화적 맥락을 기자가 검토한다.',
      'AI 자동 번역 기사에는 "(AI 번역 후 수정)" 표기를 권장한다.',
      '제휴사(워싱턴포스트, 블룸버그 등) 기사 번역 시 원 저작권 표기를 유지한다.',
    ],
  },
  {
    title: '5. 데이터 및 개인정보 보호',
    icon: '🔒',
    items: [
      '취재원의 개인정보가 포함된 자료를 외부 AI 서비스에 입력하지 않는다.',
      '미공개 내부 문서·자료를 상업용 AI 서비스에 학습 데이터로 제공하지 않는다.',
      'AI 서비스 이용 시 해당 서비스의 개인정보처리방침을 확인하고, 민감 정보 입력을 금지한다.',
      '기자 인증 계정으로만 사내 AI 도구를 사용하고, 계정을 공유하지 않는다.',
    ],
  },
  {
    title: '6. 독자 대상 AI 기능',
    icon: '🤖',
    items: [
      '독자 대상 AI 챗봇, 기사 요약 기능은 AI가 생성한 답변임을 명확히 표기한다.',
      'AI 추천 기사 알고리즘의 운영 원칙을 독자가 이해할 수 있게 공개한다.',
      '개인화 추천에 사용되는 데이터와 그 목적을 개인정보처리방침에 상세히 고지한다.',
    ],
  },
  {
    title: '7. 가이드라인 적용 및 갱신',
    icon: '📋',
    items: [
      '본 가이드라인은 AI 기술 발전에 따라 6개월 단위로 검토·갱신한다.',
      '신규 AI 도구 도입 시 편집국장 승인과 가이드라인 적합성 검토를 선행한다.',
      '가이드라인 위반 사례는 편집위원회에서 검토하고 결과를 사내 공유한다.',
    ],
  },
];

export default function AIGuidelinesPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-article mx-auto">
        <div className="mb-10">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            AI Guidelines
          </p>
          <h1
            className="text-display-sm font-bold text-neutral-900 mb-4"
            style={{ fontFamily: '"Noto Serif KR", serif' }}
          >
            AI 활용 가이드라인
          </h1>
          <p className="text-body text-neutral-600 leading-relaxed">
            울산매일UTV는 AI 도구를 책임감 있게 활용하여 저널리즘의 신뢰성과 윤리 기준을
            유지합니다. 이 가이드라인은 기사 작성, 이미지 생성, 번역, 독자 서비스 전반에
            적용됩니다.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 text-caption font-semibold rounded-full">
            <span>⚡</span>
            <span>제정: 2026년 01월 · 다음 검토 예정: 2026년 07월</span>
          </div>
        </div>

        <div className="space-y-8">
          {GUIDELINE_SECTIONS.map(({ title, icon, items }) => (
            <section key={title} className="rounded-xl border border-neutral-200 p-6">
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span>{icon}</span>
                {title}
              </h2>
              <ul className="space-y-2.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-sm text-neutral-700 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 p-5 bg-brand-charcoal rounded-xl text-white">
          <p className="font-semibold mb-1">AI 활용 관련 문의</p>
          <p className="text-neutral-400 text-body-sm">
            디지털편집팀 · <a href="mailto:digital@ulsanmaeil.co.kr" className="text-white hover:underline">digital@ulsanmaeil.co.kr</a>
          </p>
        </div>
      </div>
    </div>
  );
}
