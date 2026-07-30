import type { Metadata } from 'next';
import Link from 'next/link';
import { DATASETS } from '@/app/lib/datasets-data';
import { DATASET_DOMAIN_LABELS, DATASET_DOMAIN_COLORS, type DatasetDomain } from '@/app/lib/definitions';
import { SITE_URL } from '@/app/lib/site-config';
import DataChart from '@/app/ui/iusm/data-chart';

export const metadata: Metadata = {
  title: '데이터룸 — 울산 지역 통계·지표',
  description: '울산매일이 수집·정리한 울산 지역 핵심 데이터. 인구·고용·부동산·문화 등 분야별 데이터를 출처·기준일과 함께 제공합니다.',
  alternates: { canonical: `${SITE_URL}/data` },
  openGraph: {
    title: '데이터룸 — 울산 지역 통계·지표',
    description: '울산매일이 수집·정리한 울산 지역 핵심 데이터.',
    url: `${SITE_URL}/data`,
    type: 'website',
  },
};

const UPDATE_CYCLE_LABELS = {
  monthly: '매월',
  quarterly: '분기',
  yearly: '연간',
  daily: '매일',
} as const;

const ALL_DOMAINS = Object.keys(DATASET_DOMAIN_LABELS) as DatasetDomain[];

type SearchParams = Promise<{ domain?: string }>;

export default async function DataRoomPage({ searchParams }: { searchParams: SearchParams }) {
  const { domain } = await searchParams;
  const activeDomain = (ALL_DOMAINS.includes(domain as DatasetDomain) ? domain : 'all') as DatasetDomain | 'all';

  const filtered = activeDomain === 'all'
    ? DATASETS
    : DATASETS.filter((d) => d.domain === activeDomain);

  return (
    <div className="container-main py-10 lg:py-14">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-caption font-semibold text-primary tracking-widest uppercase mb-2">Data Room</p>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">울산 데이터룸</h1>
        <p className="text-body text-neutral-500 max-w-2xl">
          울산매일이 직접 수집·정리한 울산 지역 핵심 통계·지표.
          모든 데이터는 출처·기준일·갱신주기·확정/잠정 여부를 함께 공개합니다.
        </p>
      </div>

      {/* 도메인 필터 탭 */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/data"
          className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-colors ${
            activeDomain === 'all'
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          전체
        </Link>
        {ALL_DOMAINS.map((d) => (
          <Link
            key={d}
            href={`/data?domain=${d}`}
            className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-colors ${
              activeDomain === d
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {DATASET_DOMAIN_LABELS[d]}
          </Link>
        ))}
      </div>

      {/* 데이터셋 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dataset) => {
          const latestPoint = dataset.points[dataset.points.length - 1];
          const prevPoint = dataset.points[dataset.points.length - 2];
          const trend = prevPoint ? latestPoint.value - prevPoint.value : 0;
          const trendPct = prevPoint ? ((trend / prevPoint.value) * 100) : 0;

          return (
            <Link
              key={dataset.slug}
              href={`/data/${dataset.slug}`}
              className="group bg-white border border-neutral-200 rounded-2xl p-5 hover:shadow-card transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-caption font-semibold px-2.5 py-1 rounded-full ${DATASET_DOMAIN_COLORS[dataset.domain]}`}>
                  {DATASET_DOMAIN_LABELS[dataset.domain]}
                </span>
                <div className="flex items-center gap-1.5">
                  {dataset.isProvisional && (
                    <span className="text-caption font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                      잠정
                    </span>
                  )}
                  <span className="text-caption text-neutral-400">
                    {UPDATE_CYCLE_LABELS[dataset.updateCycle]}
                  </span>
                </div>
              </div>

              <h2 className="text-body font-bold text-neutral-900 group-hover:text-primary transition-colors mb-1">
                {dataset.name}
              </h2>
              <p className="text-caption text-neutral-400 mb-3">
                기준: {dataset.referenceDate} · 출처: {dataset.sourceName}
              </p>

              {/* 스파크라인 */}
              <div className="flex-1 min-h-0 -mx-1 mb-3">
                <DataChart points={dataset.points.slice(-12)} unit={dataset.unit} compact width={320} height={80} />
              </div>

              {/* 최신값 */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-heading-3 font-black text-neutral-900">
                    {latestPoint.value.toLocaleString()}
                    <span className="text-caption font-normal text-neutral-400 ml-1">{dataset.unit}</span>
                  </p>
                  <p className="text-caption text-neutral-400">{latestPoint.period}</p>
                </div>
                {prevPoint && (
                  <span className={`text-caption font-semibold ${trend < 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {trend > 0 ? '+' : ''}{trendPct.toFixed(1)}%
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl">
          <p className="text-body-sm text-neutral-400">해당 분야의 데이터가 없습니다.</p>
        </div>
      )}

      {/* 하단 안내 */}
      <div className="mt-12 p-6 bg-neutral-50 border border-neutral-200 rounded-2xl">
        <p className="text-body-sm font-bold text-neutral-900 mb-2">데이터 품질 원칙</p>
        <p className="text-caption text-neutral-500 leading-relaxed">
          모든 데이터는 공공기관 원본 출처를 명시하고, 잠정치와 확정치를 구분합니다.
          이상치 발견·정정 사항은 <Link href="/trust" className="text-primary hover:underline">신뢰 페이지</Link>에
          공개 기록합니다.
          데이터 제보·오류 신고: <a href="mailto:data@um.co.kr" className="text-primary hover:underline">data@um.co.kr</a>
        </p>
      </div>
    </div>
  );
}
