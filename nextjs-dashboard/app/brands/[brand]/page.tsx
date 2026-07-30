import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBrand, EVENT_BRANDS } from '@/app/lib/event-brands';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import { SITE_URL } from '@/app/lib/site-config';

type Params = Promise<{ brand: string }>;

export async function generateStaticParams() {
  return EVENT_BRANDS.map((b) => ({ brand: b.slug }));
}

function formatKoDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  if (isNaN(d.getTime())) return dateStr;
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default async function BrandHubPage({ params }: { params: Params }) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();

  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === b.eventSlug);

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: b.name,
    description: b.description,
    ...(event ? { startDate: event.startDate, location: { '@type': 'Place', name: event.location } } : {}),
    organizer: { '@type': 'Organization', name: '울산매일신문사', url: SITE_URL },
    image: b.heroImage,
    url: `${SITE_URL}/brands/${b.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />

      {/* 히어로 */}
      <section className="relative text-white overflow-hidden" style={{ background: 'var(--brand)' }}>
        <div className="absolute inset-0">
          <Image src={b.heroImage} alt={b.name} fill className="object-cover opacity-25" priority sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--brand), transparent)' }} />
        </div>
        <div className="relative container-main py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-caption font-semibold tracking-widest uppercase text-white/70 mb-3">{b.shortName}</p>
            <h1 className="text-display font-black leading-tight mb-4 text-balance">{b.tagline}</h1>
            {event && (
              <p className="text-body-lg text-white/85 mb-8">
                {formatKoDate(event.startDate)} · {event.location}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/events/${b.eventSlug}/register`}
                className="px-7 py-3.5 rounded-xl bg-white font-bold transition-opacity hover:opacity-90"
                style={{ color: 'var(--brand)' }}
              >
                {b.applyLabel}
              </Link>
              {event && (
                <Link
                  href={`/events/${b.eventSlug}`}
                  className="px-7 py-3.5 rounded-xl bg-white/15 text-white font-bold hover:bg-white/25 transition-colors backdrop-blur"
                >
                  자세히 보기
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 지표 */}
      <section className="container-main -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
          {b.highlights.map((h) => (
            <div key={h.label} className="text-center">
              <p className="text-heading-3 font-black" style={{ color: 'var(--brand)' }}>{h.value}</p>
              <p className="text-caption text-neutral-400 mt-1">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 소개 */}
      <section className="container-main py-14">
        <div className="max-w-3xl">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-4">소개</h2>
          <p className="text-body-lg text-neutral-700 leading-relaxed">{b.description}</p>
        </div>
      </section>

      {/* 프로그램 */}
      <section className="bg-neutral-50 border-y border-neutral-200 py-14">
        <div className="container-main">
          <h2 className="text-heading-2 font-bold text-neutral-900 mb-8">{b.infoTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {b.program.map((p) => (
              <div key={p.step} className="bg-white border border-neutral-200 rounded-2xl p-6 flex gap-4">
                <span
                  className="shrink-0 h-10 px-3 inline-flex items-center rounded-lg text-white text-body-sm font-bold"
                  style={{ background: 'var(--brand)' }}
                >
                  {p.step}
                </span>
                <div>
                  <p className="text-body font-bold text-neutral-900">{p.title}</p>
                  <p className="text-body-sm text-neutral-500 mt-1 leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신청 CTA */}
      <section className="container-main py-16 text-center">
        <h2 className="text-heading-1 font-bold text-neutral-900 mb-3">{b.shortName}, 지금 참여하세요</h2>
        {event?.price ? (
          <p className="text-body text-neutral-500 mb-8">참가비 {event.price.toLocaleString()}원 · 온라인 신청 후 결제</p>
        ) : (
          <p className="text-body text-neutral-500 mb-8">온라인으로 간편하게 신청하세요</p>
        )}
        <Link
          href={`/events/${b.eventSlug}/register`}
          className="inline-block px-10 py-4 rounded-xl text-white font-bold transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand)' }}
        >
          {b.applyLabel}
        </Link>
      </section>
    </>
  );
}
