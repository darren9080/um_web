import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import CommentSection from '@/app/ui/iusm/comment-section';
import AdSlotServer from '@/app/ui/iusm/ad-slot-server';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';
import ArticleCard from '@/app/ui/iusm/article-card';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';
import { getJournalistByName } from '@/app/lib/journalists-data';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption', 'iframe']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
    '*': ['class', 'id'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: '기사를 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/news/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.thumbnail, width: 1200, height: 630, alt: article.title }],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail],
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const journalist = getJournalistByName(article.author);
  const related = PLACEHOLDER_ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category,
  ).slice(0, 3);

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'NewsArticle',
                '@id': `${SITE_URL}/news/${article.slug}#article`,
                headline: article.title,
                description: article.excerpt,
                image: {
                  '@type': 'ImageObject',
                  url: article.thumbnail,
                  width: 1200,
                  height: 630,
                },
                datePublished: article.publishedAt,
                dateModified: article.publishedAt,
                inLanguage: 'ko-KR',
                articleSection: CATEGORY_LABELS[article.category],
                keywords: article.tags.join(', '),
                url: `${SITE_URL}/news/${article.slug}`,
                mainEntityOfPage: `${SITE_URL}/news/${article.slug}`,
                author: {
                  '@type': 'Person',
                  name: article.author,
                  worksFor: { '@id': `${SITE_URL}/#organization` },
                },
                publisher: {
                  '@type': 'NewsMediaOrganization',
                  '@id': `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
                },
                isPartOf: {
                  '@type': 'Periodical',
                  name: SITE_NAME,
                  url: SITE_URL,
                },
                speakable: {
                  '@type': 'SpeakableSpecification',
                  cssSelector: ['h1', '.article-title', '.article-prose p:first-of-type'],
                },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
                  { '@type': 'ListItem', position: 2, name: '뉴스', item: `${SITE_URL}/news` },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: CATEGORY_LABELS[article.category],
                    item: `${SITE_URL}/news?category=${article.category}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: article.title,
                    item: `${SITE_URL}/news/${article.slug}`,
                  },
                ],
              },
            ],
          }),
        }}
      />

      <article className="container-main py-8 lg:py-12">
        <div className="max-w-article mx-auto">
          {/* 브레드크럼 */}
          <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">홈</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-primary transition-colors">뉴스</Link>
            <span>/</span>
            <Link
              href={`/news?category=${article.category}`}
              className="hover:text-primary transition-colors"
            >
              {CATEGORY_LABELS[article.category]}
            </Link>
          </nav>

          {/* 기사 헤더 */}
          <header className="mb-8">
            <span className={`category-badge ${CATEGORY_COLORS[article.category]} mb-4`}>
              {CATEGORY_LABELS[article.category]}
            </span>

            <h1 className="article-title mb-4 text-balance">
              {article.title}
            </h1>

            <p className="text-body-lg text-neutral-600 leading-relaxed mb-6">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-neutral-200">
              <div className="flex items-center gap-3">
                {journalist ? (
                  <Link href={`/journalists/${journalist.slug}`} className="group flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                      <Image src={journalist.photo} alt={journalist.name} fill className="object-cover object-top" sizes="36px" />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                        {article.author}
                      </p>
                      <p className="text-caption text-neutral-400">
                        {journalist.title} · {formatDateKo(article.publishedAt)} · {article.readTime}분 읽기
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-body-sm font-bold text-neutral-600">
                      {article.author[0]}
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-900">{article.author}</p>
                      <p className="text-caption text-neutral-400">
                        {formatDateKo(article.publishedAt)} · {article.readTime}분 읽기
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 공유 버튼 */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors" aria-label="카카오 공유">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 3C6.477 3 2 6.582 2 11c0 2.797 1.693 5.265 4.285 6.79L5.18 21.15a.25.25 0 00.362.28l4.04-2.61A11.06 11.06 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                  </svg>
                </button>
                <button className="p-2 rounded-full text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors" aria-label="링크 복사">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* 대표 이미지 */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-100 mb-8">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>

          {/* 본문 */}
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content, SANITIZE_OPTIONS) }}
          />

          {/* 기사 본문 하단 광고 */}
          <div className="mt-8">
            <AdSlotServer placement="article_inline" />
          </div>

          {/* 태그 */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-neutral-100 text-neutral-600 text-caption font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 저자 소개 */}
          {journalist ? (
            <Link
              href={`/journalists/${journalist.slug}`}
              className="group mt-8 pt-8 border-t border-neutral-200 flex items-center gap-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl p-5 transition-colors block"
            >
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                <Image src={journalist.photo} alt={journalist.name} fill className="object-cover object-top" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                  {journalist.name}
                </p>
                <p className="text-body-sm text-neutral-500 mt-0.5">{journalist.title}</p>
                <p className="text-caption text-neutral-400 mt-1 line-clamp-2">{journalist.bio}</p>
              </div>
              <span className="text-caption font-semibold text-primary shrink-0">프로필 보기 →</span>
            </Link>
          ) : (
            <div className="mt-8 pt-8 border-t border-neutral-200 flex items-center gap-4 bg-neutral-50 rounded-xl p-5">
              <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-heading-4 font-bold text-neutral-600 shrink-0">
                {article.author[0]}
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{article.author}</p>
                <p className="text-body-sm text-neutral-500 mt-0.5">울산매일UTV 기자</p>
              </div>
            </div>
          )}

          {/* 댓글 섹션 */}
          <CommentSection articleSlug={article.slug} />
        </div>
      </article>

      {/* 관련 기사 */}
      {related.length > 0 && (
        <section className="bg-neutral-50 border-t border-neutral-200 py-12">
          <div className="container-main">
            <h2 className="text-heading-2 font-bold text-neutral-900 mb-6">관련 기사</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
