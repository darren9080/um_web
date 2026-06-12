import Link from 'next/link';
import Image from 'next/image';
import type { Event } from '@/app/lib/definitions';
import { EVENT_TYPE_LABELS } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';

type EventCardProps = {
  event: Event;
  variant?: 'default' | 'compact';
};

function StatusBadge({ status }: { status: Event['status'] }) {
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-caption font-semibold rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        신청 가능
      </span>
    );
  }
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-caption font-semibold rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        진행 중
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-caption font-semibold rounded">
      종료
    </span>
  );
}

function CapacityBar({ current, max }: { current: number; max: number }) {
  const percent = Math.min((current / max) * 100, 100);
  const isAlmostFull = percent >= 80;
  return (
    <div>
      <div className="flex justify-between text-caption text-neutral-500 mb-1">
        <span>신청 현황</span>
        <span className={isAlmostFull ? 'text-orange-600 font-semibold' : ''}>
          {current.toLocaleString()} / {max.toLocaleString()}명
        </span>
      </div>
      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isAlmostFull ? 'bg-orange-500' : 'bg-blue-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  const typeLabel = EVENT_TYPE_LABELS[event.type];

  if (variant === 'compact') {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="group shrink-0 w-64 sm:w-72 block card-hover rounded-xl overflow-hidden shadow-card"
      >
        <div className="relative h-40 bg-neutral-100 overflow-hidden">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="288px"
          />
          <div className="absolute top-2 left-2">
            <StatusBadge status={event.status} />
          </div>
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-caption font-semibold text-neutral-700 px-2 py-0.5 rounded">
            {typeLabel}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-body-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {event.title}
          </h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-caption text-neutral-500">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDateKo(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-caption text-neutral-500">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-body-sm font-bold text-primary">
              {event.price ? `${event.price.toLocaleString()}원` : '무료'}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block card-hover rounded-xl overflow-hidden shadow-card bg-white"
    >
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden">
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-caption font-semibold text-neutral-700 px-2.5 py-1 rounded">
          {typeLabel}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-heading-4 font-bold text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {event.title}
        </h3>
        <p className="text-body-sm text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-body-sm text-neutral-600">
            <svg className="w-4 h-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {formatDateKo(event.startDate)}
              {event.startDate !== event.endDate && ` ~ ${formatDateKo(event.endDate)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-body-sm text-neutral-600">
            <svg className="w-4 h-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        {event.maxCapacity && event.status !== 'ended' && (
          <div className="mt-4">
            <CapacityBar current={event.currentRegistrations} max={event.maxCapacity} />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-heading-4 font-bold text-primary">
            {event.price ? `${event.price.toLocaleString()}원` : '무료'}
          </span>
          {event.status === 'upcoming' && (
            <span className="text-caption font-semibold text-accent-event bg-blue-50 px-3 py-1.5 rounded-lg">
              신청하기 →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
