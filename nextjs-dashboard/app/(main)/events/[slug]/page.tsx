import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { EVENT_TYPE_LABELS } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';
import { SITE_URL, SITE_NAME } from '@/app/lib/site-config';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: '이벤트를 찾을 수 없습니다' };
  const canonicalUrl = `${SITE_URL}/events/${event.slug}`;
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.thumbnail, width: 1200, height: 630, alt: event.title }],
      type: 'website',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: [event.thumbnail],
    },
  };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const capacityPercent = event.maxCapacity
    ? Math.min((event.currentRegistrations / event.maxCapacity) * 100, 100)
    : 0;
  const isAlmostFull = capacityPercent >= 80;

  const eventSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        '@id': `${SITE_URL}/events/${event.slug}#event`,
        name: event.title,
        description: event.description,
        image: event.heroImage ?? event.thumbnail,
        startDate: event.startDate,
        endDate: event.endDate ?? event.startDate,
        eventStatus:
          event.status === 'ended'
            ? 'https://schema.org/EventCancelled'
            : 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: event.location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: '울산',
            addressCountry: 'KR',
          },
        },
        organizer: {
          '@type': 'Organization',
          name: event.organizer,
          url: SITE_URL,
        },
        offers: {
          '@type': 'Offer',
          price: event.price ?? 0,
          priceCurrency: 'KRW',
          availability:
            event.status === 'upcoming'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
          url: `${SITE_URL}/events/${event.slug}`,
          ...(event.registrationDeadline ? { validThrough: event.registrationDeadline } : {}),
        },
        url: `${SITE_URL}/events/${event.slug}`,
        inLanguage: 'ko-KR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: '이벤트', item: `${SITE_URL}/events` },
          { '@type': 'ListItem', position: 3, name: event.title, item: `${SITE_URL}/events/${event.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {/* 이벤트 히어로 */}
      <div className="relative h-64 md:h-96 bg-neutral-900 overflow-hidden">
        <Image
          src={event.heroImage ?? event.thumbnail}
          alt={event.title}
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-main pb-8">
          <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-white transition-colors">이벤트</Link>
          </nav>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-caption font-semibold px-2.5 py-1 rounded">
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            {event.status === 'upcoming' && (
              <span className="bg-blue-500 text-white text-caption font-semibold px-2.5 py-1 rounded">
                신청 가능
              </span>
            )}
            {event.status === 'ended' && (
              <span className="bg-neutral-600 text-white text-caption font-semibold px-2.5 py-1 rounded">
                종료
              </span>
            )}
          </div>
          <h1 className="text-white font-bold text-balance" style={{ fontFamily: 'Noto Serif KR, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* 이벤트 정보 바 */}
      <div className="bg-white border-b border-neutral-200 py-4">
        <div className="container-main">
          <div className="flex flex-wrap gap-6 text-body-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatDateKo(event.startDate)}
                {event.startDate !== event.endDate && ` ~ ${formatDateKo(event.endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{event.organizer}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-primary">
                {event.price ? `${event.price.toLocaleString()}원` : '무료'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 + 사이드바 */}
      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* 이벤트 상세 내용 */}
          <div>
            <h2 className="text-heading-2 font-bold text-neutral-900 mb-4">이벤트 소개</h2>
            <p className="text-body text-neutral-700 leading-relaxed mb-8">
              {event.description}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-neutral-100 text-neutral-600 text-caption font-medium rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 지도 플레이스홀더 */}
            <div className="mt-10">
              <h3 className="text-heading-3 font-bold text-neutral-900 mb-4">장소</h3>
              <div className="h-48 bg-neutral-100 rounded-xl flex items-center justify-center border border-neutral-200">
                <div className="text-center text-neutral-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-body-sm">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 신청 위젯 (sticky) */}
          <aside>
            <div className="sticky top-28">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-card">
                <div className="text-center mb-6">
                  <p className="text-heading-2 font-bold text-primary">
                    {event.price ? `${event.price.toLocaleString()}원` : '무료'}
                  </p>
                  {event.price && (
                    <p className="text-caption text-neutral-400 mt-0.5">1인 기준</p>
                  )}
                </div>

                {/* 정원 현황 */}
                {event.maxCapacity && (
                  <div className="mb-5">
                    <div className="flex justify-between text-body-sm text-neutral-600 mb-1.5">
                      <span>신청 현황</span>
                      <span className={`font-semibold ${isAlmostFull ? 'text-orange-600' : ''}`}>
                        {event.currentRegistrations.toLocaleString()} / {event.maxCapacity.toLocaleString()}명
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isAlmostFull ? 'bg-orange-500' : 'bg-blue-500'}`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                    {isAlmostFull && (
                      <p className="text-caption text-orange-600 font-semibold mt-1.5">
                        마감 임박! 잔여 {event.maxCapacity - event.currentRegistrations}자리
                      </p>
                    )}
                  </div>
                )}

                {/* 신청 기한 */}
                {event.registrationDeadline && event.status === 'upcoming' && (
                  <div className="flex items-center justify-between text-body-sm text-neutral-600 mb-5 py-3 border-y border-neutral-100">
                    <span>신청 마감</span>
                    <span className="font-semibold">{formatDateKo(event.registrationDeadline)}</span>
                  </div>
                )}

                {/* CTA 버튼 */}
                {event.status === 'upcoming' ? (
                  <button className="w-full btn-accent py-3.5 rounded-xl text-body font-bold">
                    {event.price ? '유료 신청하기' : '무료 신청하기'}
                  </button>
                ) : (
                  <div className="w-full py-3.5 text-center text-body-sm text-neutral-400 bg-neutral-100 rounded-xl font-semibold">
                    이벤트가 종료되었습니다
                  </div>
                )}

                {/* 공유 */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 btn-outline py-2.5 text-xs">카카오 공유</button>
                  <button className="flex-1 btn-outline py-2.5 text-xs">링크 복사</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
