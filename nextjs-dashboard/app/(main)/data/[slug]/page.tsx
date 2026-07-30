import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDatasetBySlug, DATASETS } from '@/app/lib/datasets-data';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { DATASET_DOMAIN_LABELS, DATASET_DOMAIN_COLORS } from '@/app/lib/definitions';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';
import DataChart from '@/app/ui/iusm/data-chart';
import CiteButton from '@/app/ui/iusm/cite-button';
import ArticleCard from '@/app/ui/iusm/article-card';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const dataset = getDatasetBySlug(slug);
  if (!dataset) return { title: '데이터를 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/data/${dataset.slug}`;
  return {
    title: `${dataset.name} — 울산 데이터룸`,
    description: dataset.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${dataset.name} | 울산매일 데이터룸`,
      description: dataset.description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

const UPDATE_CYCLE_LABELS = {
  monthly: '매월 갱신',
  quarterly: '분기 갱신',
  yearly: '연간 갱신',
  daily: '매일 갱신',
} as const;

export default async function DatasetDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const dataset = getDatasetBySlug(slug);
  if (!dataset) notFound();

  const canonicalUrl = `${SITE_URL}/data/${dataset.slug}`;
  const apiUrl = `${SITE_URL}/api/datasets/${dataset.slug}`;

  const relatedArticles = PLACEHOLDER_ARTICLES.filter((a) =>
    dataset.relatedArticleSlugs.includes(a.slug),
  );

  const latestPoint = dataset.points[dataset.points.length - 1];
  const firstPoint  = dataset.points[0];
  const totalChange = latestPoint.value - firstPoint.value;
  const changePct   = ((totalChange / firstPoint.value) * 100);

  const today = new Date().toISOString().slice(0, 10);
  const citationText = `출처: 울산매일 데이터룸, "${dataset.name}", ${dataset.sourceName} 기준, ${dataset.referenceDate} 기준일, ${today} 인용, ${canonicalUrl}`;

  // JSON-LD (Dataset schema)
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${canonicalUrl}#dataset`,
    name: dataset.name,
    description: dataset.description,
    url: canonicalUrl,
    creator: {
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    temporalCoverage: `${firstPoint.period}/${latestPoint.period}`,
    measurementTechnique: dataset.methodNote,
    variableMeasured: dataset.unit,
    dateModified: dataset.referenceDate,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: apiUrl,
    },
    isBasedOn: dataset.sourceUrl ? {
      '@type': 'Dataset',
      name: dataset.sourceName,
      url: dataset.sourceUrl,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      <div className="container-main py-10 lg:py-14">
        <div className="max-w-4xl mx-auto">

          {/* 브레드크럼 */}
          <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">홈</Link>
            <span>/</span>
            <Link href="/data" className="hover:text-primary transition-colors">데이터룸</Link>
            <span>/</span>
            <Link href={`/data?domain=${dataset.domain}`} className="hover:text-primary transition-colors">
              {DATASET_DOMAIN_LABELS[dataset.domain]}
            </Link>
          </nav>

          {/* 헤더 */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-caption font-semibold px-2.5 py-1 rounded-full ${DATASET_DOMAIN_COLORS[dataset.domain]}`}>
                {DATASET_DOMAIN_LABELS[dataset.domain]}
              </span>
              {dataset.isProvisional ? (
                <span className="inline-flex items-center gap-1 text-caption font-semibold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  잠정치 포함
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-caption font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  확정
                </span>
              )}
              <span className="text-caption text-neutral-400">{UPDATE_CYCLE_LABELS[dataset.updateCycle]}</span>
            </div>

            <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">{dataset.name}</h1>
            <p className="text-body text-neutral-600 leading-relaxed">{dataset.description}</p>
          </header>

          {/* 메타 정보 바 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-neutral-50 rounded-2xl p-5 mb-8">
            <div>
              <p className="text-caption text-neutral-400 mb-1">기준일</p>
              <p className="text-body-sm font-semibold text-neutral-900">{dataset.referenceDate}</p>
            </div>
            <div>
              <p className="text-caption text-neutral-400 mb-1">갱신주기</p>
              <p className="text-body-sm font-semibold text-neutral-900">{UPDATE_CYCLE_LABELS[dataset.updateCycle]}</p>
            </div>
            <div>
              <p className="text-caption text-neutral-400 mb-1">단위</p>
              <p className="text-body-sm font-semibold text-neutral-900">{dataset.unit}</p>
            </div>
            <div>
              <p className="text-caption text-neutral-400 mb-1">출처</p>
              {dataset.sourceUrl ? (
                <a
                  href={dataset.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-semibold text-primary hover:underline"
                >
                  {dataset.sourceName} ↗
                </a>
              ) : (
                <p className="text-body-sm font-semibold text-neutral-900">{dataset.sourceName}</p>
              )}
            </div>
          </div>

          {/* 최신값 요약 */}
          <div className="flex flex-wrap items-center gap-8 mb-6">
            <div>
              <p className="text-caption text-neutral-400 mb-0.5">최신값 ({latestPoint.period})</p>
              <p className="text-display font-black text-neutral-900">
                {latestPoint.value.toLocaleString()}
                <span className="text-body font-normal text-neutral-400 ml-2">{dataset.unit}</span>
              </p>
              {latestPoint.isProvisional && (
                <p className="text-caption text-orange-600 mt-0.5">잠정치</p>
              )}
            </div>
            <div>
              <p className="text-caption text-neutral-400 mb-0.5">기간 내 변화 ({firstPoint.period} → {latestPoint.period})</p>
              <p className={`text-heading-2 font-bold ${totalChange < 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {totalChange > 0 ? '+' : ''}{totalChange.toLocaleString()} {dataset.unit}
                <span className="text-body font-normal ml-2">
                  ({changePct > 0 ? '+' : ''}{changePct.toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>

          {/* 시계열 차트 */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8">
            <DataChart points={dataset.points} unit={dataset.unit} width={800} height={280} />
            {dataset.points.some((p) => p.isProvisional) && (
              <p className="text-caption text-neutral-400 mt-3 flex items-center gap-2">
                <span className="inline-block w-6 border-t-2 border-dashed border-orange-400" />
                점선: 잠정치 (확정 전 수정될 수 있음)
              </p>
            )}
          </div>

          {/* 가공 방법 */}
          <div className="mb-8 p-4 bg-neutral-50 border-l-4 border-neutral-300 rounded-r-xl">
            <p className="text-caption font-bold text-neutral-700 mb-1">가공 방법 공개</p>
            <p className="text-caption text-neutral-500 leading-relaxed">{dataset.methodNote}</p>
          </div>

          {/* 인용하기 */}
          <div className="mb-12">
            <CiteButton url={canonicalUrl} citationText={citationText} />
            <p className="text-caption text-neutral-400 mt-2">
              JSON 데이터 API:&nbsp;
              <Link href={`/api/datasets/${dataset.slug}`} className="font-mono text-primary hover:underline">
                {apiUrl}
              </Link>
            </p>
          </div>

          {/* 관련 기사 */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-5">
                이 데이터를 다룬 기사
                <span className="ml-2 text-body-sm font-normal text-neutral-400">{relatedArticles.length}건</span>
              </h2>
              <div className="divide-y divide-neutral-100">
                {relatedArticles.map((article) => (
                  <div key={article.id} className="py-4 first:pt-0">
                    <ArticleCard article={article} variant="horizontal" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
