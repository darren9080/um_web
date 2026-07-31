import Link from 'next/link';
import type { Metadata } from 'next';
import ArticleCard from '@/app/ui/iusm/article-card';
import EventCard from '@/app/ui/iusm/event-card';
import BreakingTicker from '@/app/ui/iusm/breaking-ticker';
import HeroCarousel from '@/app/ui/iusm/hero-carousel';
import NewsletterSignup from '@/app/ui/iusm/newsletter-signup';
import AdSense from '@/app/ui/iusm/adsense';
import AdSenseRow from '@/app/ui/iusm/adsense-row';
import { ADSENSE_SLOTS } from '@/app/lib/ads';
import { PLACEHOLDER_EVENTS, BREAKING_NEWS } from '@/app/lib/placeholder-data';
import { getArticles } from '@/app/lib/synced-articles';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/app/lib/definitions';
import { formatRelativeTime } from '@/app/lib/utils';
import { SITE_URL, SITE_NAME, ORG_NAME, ORG_PHONE, ORG_FOUNDING_YEAR } from '@/app/lib/site-config';

export const metadata: Metadata = {
  title: '울산매일UTV - 울산 대표 미디어 플랫폼',
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const articles = await getArticles();
  const carouselArticles = articles.slice(0, 3);
  const carouselIds = new Set(carouselArticles.map((a) => a.id));
  const latestArticles = articles.filter((a) => !carouselIds.has(a.id)).slice(0, 3);
  const upcomingEvents = PLACEHOLDER_EVENTS.filter((e) => e.status === 'upcoming').slice(0, 4);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['NewsMediaOrganization', 'Organization'],
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ORG_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
          width: 280,
          height: 60,
        },
        foundingDate: ORG_FOUNDING_YEAR,
        description: '울산 지역 1위 미디어 플랫폼. 사회·문화·스포츠·경제 뉴스와 지역 대표 이벤트를 전달합니다.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '울산',
          addressRegion: '울산광역시',
          addressCountry: 'KR',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: ORG_PHONE,
          contactType: 'customer service',
          availableLanguage: 'Korean',
        },
        sameAs: ['https://twitter.com/ulsanmaeil_utv'],
        publishingPrinciples: `${SITE_URL}/ethics`,
        masthead: `${SITE_URL}/about`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'ko-KR',
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/news?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
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
              <h2 className="text-heading-3 font-bold text-neutral-900">최신 기사</h2>
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

      {/* 메인 광고 (AdSense 3분할, 모바일 세로 스택) */}
      <div className="container-main mt-6">
        <AdSenseRow slots={ADSENSE_SLOTS.homeMain} />
      </div>

      {/* 주요 기사 그리드 */}
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
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>

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
              {articles.slice(3).map((article) => (
                <div key={article.id} className="py-5 first:pt-0">
                  <ArticleCard article={article} variant="horizontal" />
                </div>
              ))}
            </div>
          </div>

          {/* 사이드바 — 멤버십 CTA(헤더에 상시 노출)와 이벤트(위 배너와 중복)는 제거해
              동일한 유도/정보를 페이지 내 반복 노출하지 않도록 함 */}
          <aside className="hidden lg:block">
            <AdSense slot={ADSENSE_SLOTS.sidebar} format="rectangle" />
          </aside>
        </div>
      </section>

      {/* 뉴스레터 구독 */}
      <NewsletterSignup />
    </>
  );
}
