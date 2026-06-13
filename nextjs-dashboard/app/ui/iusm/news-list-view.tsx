'use client';

import { useState } from 'react';
import { ListBulletIcon, Squares2X2Icon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import ArticleCard from './article-card';
import type { Article } from '@/app/lib/definitions';

type ViewMode = 'large' | 'small' | 'list';

const VIEWS: { mode: ViewMode; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { mode: 'large', Icon: RectangleGroupIcon, label: '큰 사진' },
  { mode: 'small', Icon: Squares2X2Icon, label: '작은 사진' },
  { mode: 'list', Icon: ListBulletIcon, label: '목록' },
];

interface NewsListViewProps {
  articles: Article[];
}

export default function NewsListView({ articles }: NewsListViewProps) {
  const [view, setView] = useState<ViewMode>('list');

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      {/* View mode toggle */}
      <div className="flex items-center justify-end gap-1 mb-6">
        {VIEWS.map(({ mode, Icon, label }) => (
          <button
            key={mode}
            onClick={() => setView(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-colors ${
              view === mode
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
            title={label}
            aria-label={label}
            aria-pressed={view === mode}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Large thumbnail view */}
      {view === 'large' && (
        <>
          {featured && (
            <div className="mb-8">
              <ArticleCard article={featured} variant="featured" />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
            </div>
          )}
        </>
      )}

      {/* Small thumbnail view */}
      {view === 'small' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      )}

      {/* List (compact) view — default */}
      {view === 'list' && (
        <div className="divide-y divide-neutral-100">
          {articles.map((article) => (
            <div key={article.id} className="py-3 first:pt-0 last:pb-0">
              <ArticleCard article={article} variant="list" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
