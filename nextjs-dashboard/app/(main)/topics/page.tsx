import type { Metadata } from 'next';
import Link from 'next/link';
import { TOPICS } from '@/app/lib/topics-data';
import { DATASETS } from '@/app/lib/datasets-data';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { SITE_URL } from '@/app/lib/site-config';
import DataChart from '@/app/ui/iusm/data-chart';
import { formatDateKo } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: '주제 — 울산 현안 아카이브',
  description: '울산의 주요 현안별 기사·데이터 아카이브. 인구 감소, 청년창업, 문화산업 등 지속 추적 중인 주제를 한곳에서 확인하세요.',
  alternates: { canonical: `${SITE_URL}/topics` },
};

export default function TopicsPage() {
  return (
    <div className="container-main py-10 lg:py-14">
      <div className="mb-10">
        <p className="text-caption font-semibold text-primary tracking-widest uppercase mb-2">Topics</p>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">주제 아카이브</h1>
        <p className="text-body text-neutral-500 max-w-2xl">
          울산매일이 지속 추적하는 울산의 주요 현안. 기사는 발행과 동시에 관련 주제에 편입되어 흐르지 않고 누적됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOPICS.filter((t) => t.status === 'active').map((topic) => {
          const articles = PLACEHOLDER_ARTICLES.filter((a) =>
            topic.relatedArticleSlugs.includes(a.slug),
          );
          const heroDataset = topic.heroDatasetSlug
            ? DATASETS.find((d) => d.slug === topic.heroDatasetSlug)
            : undefined;

          return (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-card transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-caption font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  추적 중
                </span>
                <span className="text-caption text-neutral-400">
                  기사 {articles.length}건
                </span>
              </div>

              <h2 className="text-heading-3 font-bold text-neutral-900 group-hover:text-primary transition-colors mb-2">
                {topic.title}
              </h2>
              <p className="text-body-sm text-neutral-500 leading-relaxed line-clamp-3 mb-4">
                {topic.summary}
              </p>

              {/* 히어로 데이터 미니 차트 */}
              {heroDataset && (
                <div className="bg-neutral-50 rounded-xl p-3 mb-4">
                  <p className="text-caption text-neutral-400 mb-2">
                    {heroDataset.name} · {heroDataset.referenceDate} 기준
                  </p>
                  <DataChart
                    points={heroDataset.points.slice(-8)}
                    unit={heroDataset.unit}
                    compact
                    width={400}
                    height={80}
                  />
                </div>
              )}

              {/* 최신 기사 */}
              {articles.length > 0 && (
                <div className="mt-auto pt-3 border-t border-neutral-100">
                  <p className="text-caption text-neutral-400 mb-2">최근 기사</p>
                  <p className="text-body-sm font-semibold text-neutral-800 line-clamp-1">
                    {articles[0].title}
                  </p>
                  <p className="text-caption text-neutral-400 mt-0.5">
                    {formatDateKo(articles[0].publishedAt)}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
