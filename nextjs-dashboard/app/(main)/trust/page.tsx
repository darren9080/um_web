import type { Metadata } from 'next';
import Link from 'next/link';
import { CORRECTIONS } from '@/app/lib/topics-data';
import { SITE_URL } from '@/app/lib/site-config';

export const metadata: Metadata = {
  title: '신뢰 — 출처·정정·AI 고지 | 울산매일',
  description: '울산매일의 데이터 출처 정책, 정정 이력, AI 활용 고지를 공개합니다. 투명성이 신뢰의 증명입니다.',
  alternates: { canonical: `${SITE_URL}/trust` },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function TrustPage() {
  return (
    <div className="container-main py-10 lg:py-14">
      <div className="max-w-3xl mx-auto">

        {/* 헤더 */}
        <div className="mb-12">
          <p className="text-caption font-semibold text-primary tracking-widest uppercase mb-2">Trust</p>
          <h1 className="text-heading-1 font-bold text-neutral-900 mb-4">신뢰 정책</h1>
          <p className="text-body text-neutral-600 leading-relaxed">
            울산매일은 <strong>매일, 울산을 기록합니다</strong>.<br />
            출처·기준일·갱신주기·정정 이력을 항상 공개하는 것이 울산매일의 신뢰 약속입니다.
          </p>
        </div>

        {/* 섹션 1: 정정 이력 */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-6 flex items-center gap-3">
            정정 이력
            {CORRECTIONS.length > 0 && (
              <span className="text-body-sm font-normal bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                {CORRECTIONS.length}건
              </span>
            )}
          </h2>

          {CORRECTIONS.length > 0 ? (
            <div className="space-y-4">
              {[...CORRECTIONS].reverse().map((c) => (
                <div key={c.id} className="border border-neutral-200 rounded-xl p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-caption font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full">
                      정정
                    </span>
                    <span className="text-caption text-neutral-400">{formatDate(c.correctedAt)}</span>
                  </div>
                  <p className="text-body-sm font-semibold text-neutral-900 mb-2">
                    <Link href={`/news/${c.articleSlug}`} className="hover:text-primary transition-colors">
                      {c.articleTitle} →
                    </Link>
                  </p>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">{c.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-body-sm text-green-700 font-semibold">정정 이력이 없습니다</p>
              <p className="text-caption text-green-600 mt-1">오류·오보 신고: data@um.co.kr</p>
            </div>
          )}
        </section>

        <div className="border-t border-neutral-200 my-10" />

        {/* 섹션 2: 데이터 출처 정책 */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">데이터 출처 정책</h2>

          <div className="space-y-6">
            <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <h3 className="text-body font-bold text-neutral-900 mb-2">원칙 1 — 공공기관 1차 출처</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                모든 수치 데이터는 통계청 KOSIS, 행정안전부, 문화체육관광부 등 공공기관의 1차 출처를 명시합니다.
                언론사 재인용·비공개 자료는 원칙적으로 사용하지 않으며, 부득이한 경우 사유를 밝힙니다.
              </p>
            </div>

            <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <h3 className="text-body font-bold text-neutral-900 mb-2">원칙 2 — 기준일·갱신주기 공개</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                모든 데이터셋에는 기준일, 갱신주기, 확정/잠정 여부를 표기합니다.
                잠정치는 점선으로 구별하고, 확정 후 자동 업데이트됩니다.
              </p>
            </div>

            <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <h3 className="text-body font-bold text-neutral-900 mb-2">원칙 3 — 가공 방법 공개</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                원시 데이터를 가공한 경우 가공 방법·집계 기준·제외 항목을 각 데이터셋 페이지에 공개합니다.
                누구든 동일 방법으로 검증할 수 있어야 한다는 것이 울산매일의 재현성 원칙입니다.
              </p>
            </div>

            <div className="p-5 border-l-4 border-primary bg-primary/5 rounded-r-xl">
              <h3 className="text-body font-bold text-neutral-900 mb-2">원칙 4 — 고정 URL과 인용 지원</h3>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                모든 데이터셋은 고정 URL(<code className="text-caption bg-neutral-100 px-1 rounded">iusm.co.kr/data/[slug]</code>)과
                JSON API(<code className="text-caption bg-neutral-100 px-1 rounded">iusm.co.kr/api/datasets/[slug]</code>)를 제공합니다.
                외부 인용 시 출처·기준일을 명시하는 인용문 포맷을 자동 생성합니다.
              </p>
            </div>
          </div>

          <p className="text-caption text-neutral-400 mt-5">
            데이터 오류 제보: <a href="mailto:data@um.co.kr" className="text-primary hover:underline">data@um.co.kr</a>
          </p>
        </section>

        <div className="border-t border-neutral-200 my-10" />

        {/* 섹션 3: AI 활용 고지 */}
        <section className="mb-12">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">AI 활용 고지 정책</h2>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-6">
            <p className="text-body text-neutral-700 leading-relaxed">
              울산매일은 AI 도구를 보조 수단으로 활용하되, <strong>모든 기사의 최종 판단·검증·책임은 기자에게 있습니다.</strong>
              AI가 활용된 콘텐츠에는 해당 사실을 기사 하단에 고지합니다.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 text-caption font-bold flex items-center justify-center mt-0.5">O</span>
              <div>
                <p className="text-body-sm font-semibold text-neutral-900">허용 — 보조 도구로서 활용</p>
                <p className="text-caption text-neutral-500 mt-0.5 leading-relaxed">
                  자료 정리·요약, 맞춤법 교정, 구조화 데이터 파싱, 번역 초안. 기자 검수 후 게재.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 text-caption font-bold flex items-center justify-center mt-0.5">X</span>
              <div>
                <p className="text-body-sm font-semibold text-neutral-900">금지 — 받아쓰기</p>
                <p className="text-caption text-neutral-500 mt-0.5 leading-relaxed">
                  AI 생성 기사를 기자 검수 없이 그대로 게재하거나, AI 판단을 사실 확인 없이 인용하는 행위.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-neutral-200 my-10" />

        {/* 섹션 4: 취재 윤리 */}
        <section>
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">취재 윤리</h2>
          <div className="space-y-3 text-body-sm text-neutral-600 leading-relaxed">
            <p>울산매일은 <Link href="/ethics" className="text-primary hover:underline">취재 윤리 강령</Link>과 한국기자협회 윤리강령을 준수합니다.</p>
            <p>광고·협찬 관계는 기사와 명확히 구별하며, 유료 게재물에는 '광고' 표시를 합니다.</p>
            <p>오류·이해충돌·압력 제보: <a href="mailto:ethics@um.co.kr" className="text-primary hover:underline">ethics@um.co.kr</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
