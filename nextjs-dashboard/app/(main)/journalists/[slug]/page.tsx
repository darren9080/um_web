import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { JOURNALISTS } from '@/app/lib/journalists-data';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';
import ArticleCard from '@/app/ui/iusm/article-card';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const journalist = JOURNALISTS.find((j) => j.slug === slug);
  if (!journalist) return { title: '기자를 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/journalists/${journalist.slug}`;
  return {
    title: `${journalist.name} ${journalist.title}`,
    description: journalist.bio,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${journalist.name} | ${SITE_NAME}`,
      description: journalist.bio,
      images: [{ url: journalist.photo, width: 400, height: 533, alt: journalist.name }],
      url: canonicalUrl,
    },
  };
}

export default async function JournalistPage({ params }: { params: Params }) {
  const { slug } = await params;
  const journalist = JOURNALISTS.find((j) => j.slug === slug);
  if (!journalist) notFound();

  const articles = PLACEHOLDER_ARTICLES.filter(
    (a) => a.author === `${journalist.nameKo} 기자`,
  );

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/journalists/${journalist.slug}#person`,
    name: journalist.name,
    jobTitle: journalist.title,
    description: journalist.bio,
    image: journalist.photo,
    url: `${SITE_URL}/journalists/${journalist.slug}`,
    email: journalist.email,
    worksFor: {
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    knowsAbout: journalist.beats,
    ...(journalist.education ? { alumniOf: { '@type': 'EducationalOrganization', name: journalist.education } } : {}),
    ...(journalist.awards ? { award: journalist.awards } : {}),
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
            <span className="text-neutral-600">{journalist.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* 프로필 사진 */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-neutral-200 shrink-0">
              <Image
                src={journalist.photo}
                alt={journalist.name}
                fill
                className="object-cover object-top"
                priority
                sizes="160px"
              />
            </div>

            {/* 기자 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-caption font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {journalist.department}
                </span>
                <span className="text-caption text-neutral-400">
                  {journalist.joinedYear}년 입사
                </span>
              </div>
              <h1 className="text-heading-1 font-bold text-neutral-900 mt-2">{journalist.name}</h1>
              <p className="text-body text-neutral-500 mt-0.5 mb-4">{journalist.title}</p>

              {/* 담당 분야 */}
              <div className="flex flex-wrap gap-2 mb-5">
                {journalist.beats.map((beat) => (
                  <span
                    key={beat}
                    className="px-3 py-1 bg-white border border-neutral-200 text-neutral-600 text-caption font-medium rounded-full"
                  >
                    {beat}
                  </span>
                ))}
              </div>

              {/* 연락처 */}
              {journalist.email && (
                <a
                  href={`mailto:${journalist.email}`}
                  className="inline-flex items-center gap-2 text-body-sm text-neutral-600 hover:text-primary transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  {journalist.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* 왼쪽: 바이오 + 기사 목록 */}
          <div>
            {/* 바이오 */}
            <section className="mb-10">
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-4">소개</h2>
              <p className="text-body text-neutral-700 leading-relaxed">{journalist.bio}</p>
            </section>

            {/* 기자 기사 목록 */}
            <section>
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-6">
                작성 기사
                <span className="ml-2 text-body-sm font-normal text-neutral-400">
                  {articles.length}건
                </span>
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

          {/* 오른쪽: 수상·학력 */}
          <aside className="space-y-6">
            {journalist.education && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-body-sm font-bold text-neutral-900 mb-3">학력</h3>
                <p className="text-body-sm text-neutral-600">{journalist.education}</p>
              </div>
            )}

            {journalist.awards && journalist.awards.length > 0 && (
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-body-sm font-bold text-neutral-900 mb-3">수상 및 경력</h3>
                <ul className="space-y-2">
                  {journalist.awards.map((award) => (
                    <li key={award} className="flex items-start gap-2 text-body-sm text-neutral-600">
                      <span className="text-accent mt-0.5">·</span>
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 다른 기자 보기 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-body-sm font-bold text-neutral-900 mb-4">다른 기자</h3>
              <div className="space-y-3">
                {JOURNALISTS.filter((j) => j.id !== journalist.id).slice(0, 4).map((j) => (
                  <Link
                    key={j.id}
                    href={`/journalists/${j.slug}`}
                    className="flex items-center gap-3 group"
                  >
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
              <Link
                href="/journalists"
                className="block text-center mt-4 text-caption font-semibold text-primary hover:underline"
              >
                전체 기자 보기 →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
