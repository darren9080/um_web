import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '언론사 윤리강령',
  description: '울산매일UTV 언론사 윤리강령. 한국신문협회 윤리강령 및 기자협회 윤리실천요강을 준수합니다.',
};

const ETHICS_ARTICLES = [
  {
    title: '제1조 (언론의 자유와 책임)',
    content: [
      '울산매일UTV 기자와 편집인은 언론의 자유가 민주주의의 근간임을 인식하고, 이 자유를 수호하며 책임 있게 행사한다.',
      '어떠한 외부 압력에도 굴하지 않고 독립적인 취재·보도·논평 활동을 한다.',
      '광고주, 정치권력, 사회적 이해집단으로부터 편집권의 독립을 지킨다.',
    ],
  },
  {
    title: '제2조 (사실 보도와 공정성)',
    content: [
      '모든 기사는 충분한 취재와 복수의 출처 확인을 거쳐 사실에 근거하여 작성한다.',
      '독자가 스스로 판단할 수 있도록 다양한 입장과 시각을 균형 있게 전달한다.',
      '추측이나 미확인 정보를 확인된 사실처럼 보도하지 않는다.',
      '오보가 발생하면 즉시 수정하고 수정 경위를 독자에게 투명하게 공개한다.',
    ],
  },
  {
    title: '제3조 (취재 윤리)',
    content: [
      '기자는 신분을 밝히고 취재하는 것을 원칙으로 하며, 불가피한 경우를 제외하고 위장 취재를 하지 않는다.',
      '취재 과정에서 얻은 미공개 정보를 사적 이익을 위해 사용하지 않는다.',
      '취재원의 신변 안전과 사생활을 보호하며, 취재원 보호를 요청받은 경우 이를 준수한다.',
      '금품, 향응, 편의 등 취재에 영향을 미칠 수 있는 일체의 혜택을 받지 않는다.',
    ],
  },
  {
    title: '제4조 (개인 존중과 사생활 보호)',
    content: [
      '범죄 피의자의 경우 법원의 유죄 판결 전까지 무죄 추정의 원칙을 적용한다.',
      '피해자, 미성년자, 사회적 약자의 신원은 공익적 필요가 없는 한 공개하지 않는다.',
      '사인(私人)의 사생활은 공적 관심사가 아닌 한 침해하지 않는다.',
      '자살 보도는 한국자살예방협회 지침에 따라 신중하게 처리한다.',
    ],
  },
  {
    title: '제5조 (광고와 편집의 분리)',
    content: [
      '광고와 편집 기사를 명확히 구분하여 독자가 혼동하지 않도록 한다.',
      '광고를 편집 기사로 위장하거나, 편집 기사를 광고 목적으로 활용하지 않는다.',
      '기사형 광고(네이티브 광고)는 반드시 "광고" 또는 "협찬"임을 표시한다.',
    ],
  },
  {
    title: '제6조 (저작권 및 지식재산권)',
    content: [
      '타 언론사와 개인의 저작물을 무단으로 인용하거나 도용하지 않는다.',
      '인용 시 반드시 출처를 명시하고, 적법한 범위 내에서 인용한다.',
      '울산매일UTV의 기사와 콘텐츠는 저작권법에 따라 보호되며, 무단 전재·복제를 금지한다.',
    ],
  },
  {
    title: '제7조 (윤리강령의 준수와 위반 처리)',
    content: [
      '모든 임직원은 본 윤리강령을 숙지하고 준수할 의무를 진다.',
      '윤리강령 위반 행위는 편집위원회에서 검토하며, 필요시 사내 징계 절차를 따른다.',
      '외부 독자·시민단체의 언론 윤리 관련 이의 제기는 편집국장이 검토하고 공개적으로 답변한다.',
    ],
  },
];

export default function EthicsPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-article mx-auto">
        <div className="mb-10">
          <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
            Ethics
          </p>
          <h1
            className="text-display-sm font-bold text-neutral-900 mb-4"
            style={{ fontFamily: '"Noto Serif KR", serif' }}
          >
            언론사 윤리강령
          </h1>
          <p className="text-body text-neutral-600 leading-relaxed">
            울산매일UTV는 한국신문협회 윤리강령, 한국기자협회 윤리실천요강을 바탕으로
            자체 윤리강령을 제정하여 준수합니다.
          </p>
          <p className="text-body-sm text-neutral-400 mt-2">
            제정일: 1992년 01월 28일 · 최종 개정: 2026년 01월 01일
          </p>
        </div>

        <div className="article-prose space-y-8">
          {ETHICS_ARTICLES.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-3">{title}</h2>
              <ol className="space-y-2 list-decimal list-inside">
                {content.map((item, i) => (
                  <li key={i} className="text-body-sm text-neutral-700 leading-relaxed pl-1">
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="mt-12 p-5 bg-neutral-50 rounded-xl border border-neutral-200 text-body-sm text-neutral-600">
          <p className="font-semibold text-neutral-900 mb-1">윤리강령 관련 문의</p>
          <p>편집국 윤리위원회 · <a href="mailto:ethics@ulsanmaeil.co.kr" className="text-accent hover:underline">ethics@ulsanmaeil.co.kr</a></p>
          <p>울산광역시 남구 두왕로 337-1, 리더스파크 3층 · 052-243-1001</p>
        </div>
      </div>
    </div>
  );
}
