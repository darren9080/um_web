import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { getArticles } from '@/app/lib/synced-articles';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { EVENT_TYPE_LABELS } from '@/app/lib/definitions';
import type { Article } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';
import ArticleCard from '@/app/ui/iusm/article-card';
import { SITE_URL } from '@/app/lib/site-config';

type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" 검색 결과` : '검색',
    alternates: { canonical: `${SITE_URL}/search` },
  };
}

function searchArticles(articles: Article[], query: string) {
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      CATEGORY_LABELS[a.category].includes(q),
  );
}

function searchEvents(query: string) {
  const q = query.toLowerCase();
  return PLACEHOLDER_EVENTS.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();

  const articles = query ? await getArticles() : [];
  const articleResults = query ? searchArticles(articles, query) : [];
  const eventResults   = query ? searchEvents(query) : [];
  const total = articleResults.length + eventResults.length;

  return (
    <div className="container-main py-10 lg:py-14">
      {/* 검색 헤더 */}
      <div className="max-w-2xl mb-10">
        {query ? (
          <>
            <p className="text-caption text-neutral-400 mb-1">검색 결과</p>
            <h1 className="text-heading-1 font-bold text-neutral-900">
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-body text-neutral-500 mt-2">
              총 {total}건 — 기사 {articleResults.length}건, 이벤트 {eventResults.length}건
            </p>
          </>
        ) : (
          <>
            <h1 className="text-heading-1 font-bold text-neutral-900 mb-3">검색</h1>
            <p className="text-body text-neutral-500">위 검색창에 키워드를 입력하세요</p>
          </>
        )}
      </div>

      {query && total === 0 && (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl">
          <p className="text-heading-3 font-bold text-neutral-900 mb-2">검색 결과가 없습니다</p>
          <p className="text-body-sm text-neutral-500 mb-6">
            &ldquo;{query}&rdquo;에 대한 결과를 찾을 수 없습니다.<br />
            다른 키워드로 검색해보세요.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-caption">
            {['울산', '이벤트', '문화', '스포츠', '창업'].map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${kw}`}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 기사 결과 */}
      {articleResults.length > 0 && (
        <section className="mb-12">
          <h2 className="text-heading-3 font-bold text-neutral-900 mb-5 flex items-center gap-2">
            기사
            <span className="text-body-sm font-normal text-neutral-400">{articleResults.length}건</span>
          </h2>
          <div className="divide-y divide-neutral-100">
            {articleResults.map((article) => (
              <div key={article.id} className="py-4 first:pt-0">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            ))}
          </div>
          {articleResults.length > 0 && (
            <div className="mt-6">
              <Link
                href={`/news?search=${encodeURIComponent(query)}`}
                className="text-body-sm font-semibold text-primary hover:underline"
              >
                기사 전체 보기 →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* 이벤트 결과 */}
      {eventResults.length > 0 && (
        <section>
          <h2 className="text-heading-3 font-bold text-neutral-900 mb-5 flex items-center gap-2">
            이벤트
            <span className="text-body-sm font-normal text-neutral-400">{eventResults.length}건</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventResults.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-card transition-shadow"
              >
                <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <span className="text-caption font-semibold text-accent">
                    {EVENT_TYPE_LABELS[event.type]}
                  </span>
                  <h3 className="text-body font-bold text-neutral-900 mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-caption text-neutral-500">
                    {formatDateKo(event.startDate)} · {event.location}
                  </p>
                  <p className="text-caption font-semibold text-primary mt-2">
                    {event.price ? `${event.price.toLocaleString()}원` : '무료'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 빈 상태 — 쿼리 없을 때 인기 키워드 */}
      {!query && (
        <div className="max-w-lg">
          <p className="text-body-sm font-semibold text-neutral-700 mb-3">인기 검색어</p>
          <div className="flex flex-wrap gap-2">
            {['울산 재즈', '마라톤', '청년창업', '문학상', '골프', 'CEO 아카데미', '울산 문화'].map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 text-body-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
