import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ArticleCard from '@/app/ui/iusm/article-card';
import EventCard from '@/app/ui/iusm/event-card';
import BreakingTicker from '@/app/ui/iusm/breaking-ticker';
import HeroCarousel from '@/app/ui/iusm/hero-carousel';
import NewsletterSignup from '@/app/ui/iusm/newsletter-signup';
import {
  PLACEHOLDER_ARTICLES,
  PLACEHOLDER_EVENTS,
  BREAKING_NEWS,
} from '@/app/lib/placeholder-data';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatRelativeTime } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: '울산매일UTV - 울산 대표 미디어 플랫폼',
};

export default function HomePage() {
  const carouselArticles = PLACEHOLDER_ARTICLES.slice(0, 3);
  const carouselIds = new Set(carouselArticles.map((a) => a.id));
  const latestArticles = PLACEHOLDER_ARTICLES.filter((a) => !carouselIds.has(a.id)).slice(0, 4);
  const upcomingEvents = PLACEHOLDER_EVENTS.filter((e) => e.status === 'upcoming').slice(0, 4);

  return (
    <>
      {/* 속보 티커 */}
      <BreakingTicker items={BREAKING_NEWS} />

      {/* 히어로 섹션 */}
      <section className="container-main pt-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-news-featured gap-6">
          {/* 캐러셀 히어로 */}
          <HeroCarousel articles={carouselArticles} />

          {/* 사이드 최신 기사 목록 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-4 font-bold text-neutral-900">최신 기사</h2>
              <Link href="/news" className="text-caption text-accent-event hover:underline font-semibold">
                전체 보기 →
              </Link>
            </div>
            <div className="flex flex-col gap-1 divide-y divide-neutral-100">
              {latestArticles.map((article) => (
                <div key={article.id} className="pt-4 first:pt-0">
                  <ArticleCard article={article} variant="horizontal" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 배너 광고 */}
      <div className="container-main mt-6">
        <div className="h-24 rounded-xl bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center">
          <span className="text-body-sm text-neutral-400">광고 영역 (728×90)</span>
        </div>
      </div>

      {/* 최신 기사 그리드 */}
      <section className="container-main section-gap">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-2 font-bold text-neutral-900">
            주요 기사
          </h2>
          <Link href="/news" className="text-body-sm text-accent-event hover:underline font-semibold">
            더 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDER_ARTICLES.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>

      {/* 스폰서 배너 (플레이스홀더) */}
      <div className="container-main mb-8">
        <div className="h-24 rounded-xl bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center">
          <span className="text-body-sm text-neutral-400">광고 영역 (728×90)</span>
        </div>
      </div>

      {/* 다가오는 이벤트 */}
      <section className="bg-neutral-50 border-y border-neutral-200 py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-1">Events</p>
              <h2 className="text-heading-2 font-bold text-neutral-900">다가오는 이벤트</h2>
            </div>
            <Link href="/events" className="text-body-sm text-accent-event hover:underline font-semibold">
              전체 이벤트 →
            </Link>
          </div>

          {/* 수평 스크롤 이벤트 카드 */}
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-2 xl:grid-cols-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 추가 기사 목록 */}
      <section className="container-main section-gap">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* 기사 목록 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-2 font-bold text-neutral-900">더 많은 기사</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {PLACEHOLDER_ARTICLES.slice(3).map((article) => (
                <div key={article.id} className="py-5 first:pt-0">
                  <ArticleCard article={article} variant="horizontal" />
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 */}
          <aside className="hidden lg:block">
            {/* 멤버십 CTA */}
            <div className="bg-primary rounded-2xl p-6 text-white mb-6">
              <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-2">멤버십</p>
              <h3 className="text-heading-3 font-bold mb-3">
                IUSM 구독으로<br />더 깊게 읽으세요
              </h3>
              <p className="text-body-sm text-neutral-400 mb-5 leading-relaxed">
                프리미엄 기사, 이벤트 우선 신청권, 매주 뉴스레터까지.
              </p>
              <Link href="/membership" className="block text-center bg-white text-primary font-semibold text-body-sm py-3 rounded-xl hover:bg-neutral-100 transition-colors">
                구독 플랜 보기
              </Link>
            </div>

            {/* 이벤트 위젯 */}
            <div>
              <h3 className="text-heading-4 font-bold text-neutral-900 mb-4">이번 주 이벤트</h3>
              <div className="space-y-4">
                {PLACEHOLDER_EVENTS.filter((e) => e.status === 'upcoming').slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group flex gap-3 hover:bg-neutral-50 rounded-lg p-2 -mx-2 transition-colors"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {event.title}
                      </p>
                      <p className="text-caption text-neutral-400 mt-1">{event.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 뉴스레터 구독 */}
      <NewsletterSignup />
    </>
  );
}
