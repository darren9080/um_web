import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';
import ArticleCard from '@/app/ui/iusm/article-card';

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
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.thumbnail],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

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
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.excerpt,
            image: article.thumbnail,
            datePublished: article.publishedAt,
            author: { '@type': 'Person', name: article.author },
            publisher: {
              '@type': 'Organization',
              name: 'IUSM',
              url: 'https://iusm.co.kr',
            },
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
          <div className="mt-8 pt-8 border-t border-neutral-200 flex items-center gap-4 bg-neutral-50 rounded-xl p-5">
            <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-heading-4 font-bold text-neutral-600 shrink-0">
              {article.author[0]}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{article.author}</p>
              <p className="text-body-sm text-neutral-500 mt-0.5">IUSM 기자</p>
            </div>
          </div>

          {/* 댓글 섹션 (소셜 로그인 필요) */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <h2 className="text-heading-3 font-bold text-neutral-900 mb-6">댓글</h2>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center">
              <p className="text-body-sm text-neutral-600 mb-4">
                댓글을 작성하려면 로그인이 필요합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-400 text-neutral-900 font-semibold text-body-sm rounded-lg hover:bg-yellow-500 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 3C6.477 3 2 6.582 2 11c0 2.797 1.693 5.265 4.285 6.79L5.18 21.15a.25.25 0 00.362.28l4.04-2.61A11.06 11.06 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                  </svg>
                  카카오로 로그인
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold text-body-sm rounded-lg hover:bg-green-600 transition-colors">
                  N 네이버로 로그인
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-semibold text-body-sm rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google로 로그인
                </button>
              </div>
            </div>
          </div>
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
