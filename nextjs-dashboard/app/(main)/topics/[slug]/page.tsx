import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { TOPICS } from '@/app/lib/topics-data';
import { DATASETS } from '@/app/lib/datasets-data';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { SITE_URL } from '@/app/lib/site-config';
import { formatDateKo } from '@/app/lib/utils';
import DataChart from '@/app/ui/iusm/data-chart';
import ArticleCard from '@/app/ui/iusm/article-card';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) return { title: '주제를 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/topics/${topic.slug}`;
  return {
    title: `${topic.title} — 울산 주제 아카이브`,
    description: topic.summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${topic.title} | 울산매일`,
      description: topic.summary,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function TopicDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();

  const relatedArticles = PLACEHOLDER_ARTICLES
    .filter((a) => topic.relatedArticleSlugs.includes(a.slug))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const relatedDatasets = DATASETS.filter((d) => topic.relatedDatasetSlugs.includes(d.slug));
  const heroDataset = topic.heroDatasetSlug
    ? DATASETS.find((d) => d.slug === topic.heroDatasetSlug)
    : undefined;

  return (
    <div>
      {/* 히어로 */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-main py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">홈</Link>
            <span>/</span>
            <Link href="/topics" className="hover:text-primary transition-colors">주제 아카이브</Link>
          </nav>

          <div className="max-w-3xl">
            <span className="text-caption font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              지속 추적
            </span>
            <h1 className="text-display font-bold text-neutral-900 mt-4 mb-4">{topic.title}</h1>
            <p className="text-body text-neutral-600 leading-relaxed">{topic.summary}</p>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">

          {/* 좌: 기사 타임라인 */}
          <div>
            <h2 className="text-heading-3 font-bold text-neutral-900 mb-6 flex items-center gap-2">
              기사 타임라인
              <span className="text-body-sm font-normal text-neutral-400">{relatedArticles.length}건</span>
            </h2>

            {relatedArticles.length > 0 ? (
              <div className="relative">
                {/* 타임라인 선 */}
                <div className="absolute left-[22px] top-0 bottom-0 w-px bg-neutral-200" />

                <div className="space-y-8">
                  {relatedArticles.map((article) => (
                    <div key={article.id} className="flex gap-5">
                      {/* 타임라인 점 */}
                      <div className="shrink-0 w-11 pt-1">
                        <div className="w-3 h-3 rounded-full bg-primary border-2 border-white ring-2 ring-primary/20 mx-auto" />
                      </div>

                      {/* 기사 카드 */}
                      <div className="flex-1 min-w-0 pb-8">
                        <p className="text-caption text-neutral-400 mb-2">
                          {formatDateKo(article.publishedAt)}
                        </p>
                        <Link
                          href={`/news/${article.slug}`}
                          className="group block bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-card transition-shadow"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                              <Image
                                src={article.thumbnail}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`}>
                                {CATEGORY_LABELS[article.category]}
                              </span>
                              <h3 className="text-body-sm font-bold text-neutral-900 group-hover:text-primary transition-colors mt-1.5 line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="text-caption text-neutral-400 mt-1">{article.author}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-neutral-50 rounded-2xl">
                <p className="text-body-sm text-neutral-400">아직 연결된 기사가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 우: 데이터 위젯 */}
          <aside className="space-y-6">
            {/* 히어로 데이터셋 */}
            {heroDataset && (
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-neutral-100">
                  <p className="text-caption text-neutral-400 mb-1">주요 데이터</p>
                  <h3 className="text-body font-bold text-neutral-900">{heroDataset.name}</h3>
                </div>
                <div className="p-4">
                  <DataChart
                    points={heroDataset.points.slice(-10)}
                    unit={heroDataset.unit}
                    compact
                    width={320}
                    height={100}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-heading-3 font-black text-neutral-900">
                        {heroDataset.points[heroDataset.points.length - 1].value.toLocaleString()}
                        <span className="text-caption font-normal text-neutral-400 ml-1">
                          {heroDataset.unit}
                        </span>
                      </p>
                      <p className="text-caption text-neutral-400">
                        {heroDataset.referenceDate} 기준
                        {heroDataset.isProvisional && (
                          <span className="ml-1 text-orange-600">(잠정)</span>
                        )}
                      </p>
                    </div>
                    <Link
                      href={`/data/${heroDataset.slug}`}
                      className="text-caption font-semibold text-primary hover:underline"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 관련 데이터셋 목록 */}
            {relatedDatasets.filter((d) => d.slug !== topic.heroDatasetSlug).length > 0 && (
              <div className="bg-white border border-neutral-200 rounded-2xl p-5">
                <h3 className="text-body-sm font-bold text-neutral-900 mb-4">관련 데이터</h3>
                <div className="space-y-3">
                  {relatedDatasets
                    .filter((d) => d.slug !== topic.heroDatasetSlug)
                    .map((dataset) => {
                      const latest = dataset.points[dataset.points.length - 1];
                      return (
                        <Link
                          key={dataset.slug}
                          href={`/data/${dataset.slug}`}
                          className="flex items-center justify-between group py-2 border-b border-neutral-100 last:border-0"
                        >
                          <span className="text-body-sm text-neutral-700 group-hover:text-primary transition-colors">
                            {dataset.name}
                          </span>
                          <span className="text-body-sm font-semibold text-neutral-900">
                            {latest.value.toLocaleString()}{dataset.unit}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 다른 주제 */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
              <h3 className="text-body-sm font-bold text-neutral-900 mb-4">다른 주제</h3>
              <div className="space-y-2">
                {TOPICS.filter((t) => t.slug !== topic.slug && t.status === 'active').map((t) => (
                  <Link
                    key={t.slug}
                    href={`/topics/${t.slug}`}
                    className="block text-body-sm text-neutral-600 hover:text-primary transition-colors py-1"
                  >
                    → {t.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
