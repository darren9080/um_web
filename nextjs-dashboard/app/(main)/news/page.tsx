import type { Metadata } from 'next';
import ArticleCard from '@/app/ui/iusm/article-card';
import { PLACEHOLDER_ARTICLES } from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS } from '@/app/lib/definitions';
import type { ArticleCategory } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: '뉴스',
  description: 'IUSM의 사회·문화·인문·스포츠·스타트업·비즈니스 뉴스를 만나보세요.',
};

const CATEGORIES: { key: ArticleCategory | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'society', label: CATEGORY_LABELS.society },
  { key: 'culture', label: CATEGORY_LABELS.culture },
  { key: 'humanities', label: CATEGORY_LABELS.humanities },
  { key: 'sports', label: CATEGORY_LABELS.sports },
  { key: 'startup', label: CATEGORY_LABELS.startup },
  { key: 'business', label: CATEGORY_LABELS.business },
];

type SearchParams = Promise<{ category?: string }>;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeCategory = params.category as ArticleCategory | 'all' | undefined;

  const filtered =
    !activeCategory || activeCategory === 'all'
      ? PLACEHOLDER_ARTICLES
      : PLACEHOLDER_ARTICLES.filter((a) => a.category === activeCategory);

  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  return (
    <div className="container-main py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">뉴스</h1>
        <p className="text-body-sm text-neutral-500">
          사회·문화·인문학·스포츠·스타트업·비즈니스 뉴스를 한곳에서
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {CATEGORIES.map(({ key, label }) => {
          const isActive = key === (activeCategory ?? 'all');
          return (
            <a
              key={key}
              href={key === 'all' ? '/news' : `/news?category=${key}`}
              className={`shrink-0 px-4 py-2 rounded-full text-body-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-body">해당 카테고리의 기사가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 피처드 기사 */}
          {featured && (
            <div className="mb-10">
              <ArticleCard article={featured} variant="featured" />
            </div>
          )}

          {/* 기사 그리드 */}
          {rest.length > 0 && (
            <div>
              <div className="section-divider mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
