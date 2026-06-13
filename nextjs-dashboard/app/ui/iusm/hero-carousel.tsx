'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Article } from '@/app/lib/definitions';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatRelativeTime } from '@/app/lib/utils';

interface HeroCarouselProps {
  articles: Article[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({ articles, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + articles.length) % articles.length);
  const next = useCallback(() => setCurrent((c) => (c + 1) % articles.length), [articles.length]);

  useEffect(() => {
    if (paused || articles.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [paused, next, autoPlayInterval, articles.length]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-neutral-900 h-[220px] sm:h-[260px] lg:h-full shadow-card-hover"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {articles.map((a, idx) => (
        <Link
          key={a.id}
          href={`/news/${a.slug}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
          tabIndex={idx === current ? 0 : -1}
        >
          <Image
            src={a.thumbnail}
            alt={a.title}
            fill
            className="object-cover opacity-70"
            priority={idx === 0}
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span className={`category-badge ${CATEGORY_COLORS[a.category]} mb-2`}>
              {CATEGORY_LABELS[a.category]}
            </span>
            <h2
              className="text-white font-bold leading-tight line-clamp-2"
              style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 'clamp(0.95rem, 2.5vw, 1.4rem)' }}
            >
              {a.title}
            </h2>
            <p className="text-neutral-300 text-caption mt-1 line-clamp-1 hidden sm:block">
              {a.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-2 text-caption text-neutral-400">
              <span>{a.author}</span>
              <span>·</span>
              <span>{formatRelativeTime(a.publishedAt)}</span>
            </div>
          </div>
        </Link>
      ))}

      {articles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="이전 기사"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="다음 기사"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1.5 items-center">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-white w-5' : 'bg-white/50 w-1.5'
            }`}
            aria-label={`슬라이드 ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
