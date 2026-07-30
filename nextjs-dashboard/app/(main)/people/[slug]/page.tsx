import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { JOURNALISTS } from '@/app/lib/journalists-data';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { TOPICS } from '@/app/lib/topics-data';
import { DATASETS } from '@/app/lib/datasets-data';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';
import ArticleCard from '@/app/ui/iusm/article-card';
import DataChart from '@/app/ui/iusm/data-chart';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return JOURNALISTS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const person = JOURNALISTS.find((j) => j.slug === slug);
  if (!person) return { title: '인물을 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/people/${person.slug}`;
  return {
    title: `${person.name} ${person.title} — 울산매일`,
    description: person.bio,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${person.name} | ${SITE_NAME}`,
      description: person.bio,
      images: [{ url: person.photo, width: 400, height: 400, alt: person.name }],
      url: canonicalUrl,
      type: 'profile',
    },
  };
}

export default async function PersonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const person = JOURNALISTS.find((j) => j.slug === slug);
  if (!person) notFound();

  const articles = PLACEHOLDER_ARTICLES.filter(
    (a) => a.author === `${person.nameKo} 기자`,
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // 기자가 다룬 주제
  const coveredTopics = TOPICS.filter((t) =>
    t.relatedArticleSlugs.some((s) => articles.some((a) => a.slug === s)),
  );

  // 기자가 활용한 데이터셋
  const usedDatasets = DATASETS.filter((d) =>
    d.relatedArticleSlugs.some((s) => articles.some((a) => a.slug === s)),
  );

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/people/${person.slug}#person`,
    name: person.name,
    jobTitle: person.title,
    description: person.bio,
    image: person.photo,
    url: `${SITE_URL}/people/${person.slug}`,
    email: person.email,
    worksFor: {
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    knowsAbout: person.beats,
    ...(person.education ? { alumniOf: { '@type': 'EducationalOrganization', name: person.education } } : {}),
    ...(person.awards ? { award: person.awards } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* 히어로 */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container-main py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">홈</Link>
            <span>/</span>
            <Link href="/journalists" className="hover:text-primary transition-colors">기자 소개</Link>
            <span>/</span>
            <span className="text-neutral-600">{person.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-neutral-200 shrink-0">
              <Image
                src={person.photo}
                alt={person.name}
                fill
                className="object-cover object-top"
                priority
                sizes="160px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-caption font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {person.department}
                </span>
                <span className="text-caption text-neutral-400">{person.joinedYear}년 입사</span>
              </div>
              <h1 className="text-heading-1 font-bold text-neutral-900 mt-2">{person.name}</h1>
              <p className="text-body text-neutral-500 mt-0.5 mb-4">{person.title}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {person.beats.map((beat) => (
                  <span
                    key={beat}
                    className="px-3 py-1 bg-white border border-neutral-200 text-neutral-600 text-caption font-medium rounded-full"
                  >
                    {beat}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center gap-2 text-body-sm text-neutral-600 hover:text-primary transition-colors"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    {person.email}
                  </a>
                )}
                <span className="text-body-sm text-neutral-400">
                  작성 기사 {articles.length}건
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* 좌: 바이오 + 기사 */}
          <div>
            <section className="mb-10">
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-4">소개</h2>
              <p className="text-body text-neutral-700 leading-relaxed">{person.bio}</p>
            </section>

            {/* 커버 주제 */}
            {coveredTopics.length > 0 && (
              <section className="mb-10">
                <h2 className="text-heading-3 font-bold text-neutral-900 mb-4">취재 주제</h2>
                <div className="flex flex-wrap gap-2">
                  {coveredTopics.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/topics/${t.slug}`}
                      className="px-4 py-2 bg-primary/5 text-primary text-body-sm font-semibold rounded-full hover:bg-primary/10 transition-colors"
                    >
                      {t.title} →
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 기사 목록 */}
            <section>
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-6">
                작성 기사
                <span className="ml-2 text-body-sm font-normal text-neutral-400">{articles.length}건</span>
              </h2>
              {articles.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {articles.map((article) => (
                    <div key={article.id} className="py-4 first:pt-0">
                      <ArticleCard article={article} variant="horizontal" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-sm text-neutral-400">등록된 기사가 없습니다.</p>
              )}
            </section>
          </div>

          {/* 우: 사이드바 */}
          <aside className="space-y-6">
            {/* 학력 */}
            {person.education && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-body-sm font-bold text-neutral-900 mb-3">학력</h3>
                <p className="text-body-sm text-neutral-600">{person.education}</p>
              </div>
            )}

            {/* 수상 */}
            {person.awards && person.awards.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-body-sm font-bold text-neutral-900 mb-3">수상 및 경력</h3>
                <ul className="space-y-2">
                  {person.awards.map((award) => (
                    <li key={award} className="flex items-start gap-2 text-body-sm text-neutral-600">
                      <span className="text-accent mt-0.5">·</span>
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 활용 데이터 */}
            {usedDatasets.length > 0 && (
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-neutral-100">
                  <h3 className="text-body-sm font-bold text-neutral-900">활용한 데이터</h3>
                </div>
                {usedDatasets.map((d) => {
                  const latest = d.points[d.points.length - 1];
                  return (
                    <Link
                      key={d.slug}
                      href={`/data/${d.slug}`}
                      className="block p-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                    >
                      <p className="text-body-sm font-semibold text-neutral-900 mb-2">{d.name}</p>
                      <DataChart
                        points={d.points.slice(-6)}
                        unit={d.unit}
                        compact
                        width={280}
                        height={60}
                      />
                      <p className="text-caption text-neutral-400 mt-1">
                        최신: {latest.value.toLocaleString()}{d.unit} ({latest.period})
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 다른 기자 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-body-sm font-bold text-neutral-900 mb-4">다른 기자</h3>
              <div className="space-y-3">
                {JOURNALISTS.filter((j) => j.id !== person.id).slice(0, 4).map((j) => (
                  <Link key={j.id} href={`/people/${j.slug}`} className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 shrink-0">
                      <Image src={j.photo} alt={j.name} fill className="object-cover object-top" sizes="40px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm font-semibold text-neutral-800 group-hover:text-primary transition-colors">{j.name}</p>
                      <p className="text-caption text-neutral-400 truncate">{j.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/journalists" className="block text-center mt-4 text-caption font-semibold text-primary hover:underline">
                전체 기자 보기 →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
