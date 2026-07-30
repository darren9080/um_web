import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/app/lib/definitions';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatDateKo, formatRelativeTime } from '@/app/lib/utils';

type ArticleCardProps = {
  article: Article;
  variant?: 'default' | 'compact' | 'featured' | 'horizontal' | 'list';
};

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const categoryLabel = CATEGORY_LABELS[article.category];
  const categoryColor = CATEGORY_COLORS[article.category];

  if (variant === 'list') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3 card-hover rounded-lg p-2 -mx-2">
        <div className="relative w-[72px] h-12 shrink-0 rounded-md overflow-hidden bg-neutral-100">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="72px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`category-badge ${categoryColor}`}>{categoryLabel}</span>
            {article.premium && (
              <span className="text-caption font-bold text-amber-600">프리미엄</span>
            )}
          </div>
          <h3 className="text-body-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-caption text-neutral-500 line-clamp-1 mt-0.5">
            {article.excerpt}
          </p>
          <p className="text-caption text-neutral-400 mt-1">
            {article.author} · {formatRelativeTime(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-4 card-hover rounded-xl p-3 -mx-3">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="112px"
          />
        </div>
        <div className="flex flex-col justify-between min-w-0">
          <div>
            <span className={`category-badge ${categoryColor} mb-1.5`}>{categoryLabel}</span>
            <h3 className="text-body-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </div>
          <p className="text-caption text-neutral-400 mt-1">
            {formatRelativeTime(article.publishedAt)} · {article.readTime}분
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="group block card-hover rounded-xl overflow-hidden">
        <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {article.premium && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-caption font-bold px-2 py-0.5 rounded">
              프리미엄
            </div>
          )}
        </div>
        <div className="p-4">
          <span className={`category-badge ${categoryColor} mb-2`}>{categoryLabel}</span>
          <h3 className="text-body-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-caption text-neutral-400 mt-2">
            {article.author} · {formatRelativeTime(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/news/${article.slug}`} className="group block card-hover rounded-xl overflow-hidden shadow-card">
        <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {article.premium && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-caption font-bold px-2 py-0.5 rounded">
              프리미엄
            </div>
          )}
        </div>
        <div className="p-5">
          <span className={`category-badge ${categoryColor} mb-2`}>{categoryLabel}</span>
          <h2 className="text-heading-3 font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {article.title}
          </h2>
          <p className="text-body-sm text-neutral-600 line-clamp-2 mt-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 mt-3 text-caption text-neutral-400">
            <span>{article.author}</span>
            <span>·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readTime}분 읽기</span>
          </div>
        </div>
      </Link>
    );
  }

  // default variant
  return (
    <Link href={`/news/${article.slug}`} className="group block card-hover rounded-xl overflow-hidden">
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
        <Image
          src={article.thumbnail}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {article.premium && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-caption font-bold px-2 py-0.5 rounded">
            프리미엄
          </div>
        )}
      </div>
      <div className="pt-4">
        <span className={`category-badge ${categoryColor} mb-2`}>{categoryLabel}</span>
        <h3 className="text-body font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-body-sm text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 mt-3 text-caption text-neutral-400">
          <span>{article.author}</span>
          <span>·</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
