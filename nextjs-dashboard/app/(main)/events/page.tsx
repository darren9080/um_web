import type { Metadata } from 'next';
import EventCard from '@/app/ui/iusm/event-card';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import type { EventStatus } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: '이벤트',
  description: 'IUSM이 주최하는 재즈페스티벌, 마라톤, 문학상, 청년박람회, CEO아카데미 등 다양한 이벤트를 확인하세요.',
};

const STATUS_FILTERS: { key: EventStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'upcoming', label: '신청 가능' },
  { key: 'ongoing', label: '진행 중' },
  { key: 'ended', label: '종료' },
];

type SearchParams = Promise<{ status?: string }>;

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeStatus = params.status as EventStatus | 'all' | undefined;

  const filtered =
    !activeStatus || activeStatus === 'all'
      ? PLACEHOLDER_EVENTS
      : PLACEHOLDER_EVENTS.filter((e) => e.status === activeStatus);

  const featured = PLACEHOLDER_EVENTS.filter((e) => e.featured && e.status === 'upcoming');

  return (
    <div className="container-main py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">이벤트</h1>
        <p className="text-body-sm text-neutral-500">
          IUSM이 주최하는 문화·스포츠·비즈니스 이벤트를 한눈에 확인하세요
        </p>
      </div>

      {/* 주요 이벤트 배너 */}
      {featured.length > 0 && !activeStatus && (
        <div className="mb-10">
          <h2 className="text-heading-3 font-semibold text-neutral-900 mb-4">주요 이벤트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* 상태 필터 */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {STATUS_FILTERS.map(({ key, label }) => {
          const isActive = key === (activeStatus ?? 'all');
          const count = key === 'all'
            ? PLACEHOLDER_EVENTS.length
            : PLACEHOLDER_EVENTS.filter((e) => e.status === key).length;
          return (
            <a
              key={key}
              href={key === 'all' ? '/events' : `/events?status=${key}`}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {label}
              <span className={`text-caption ${isActive ? 'text-white/70' : 'text-neutral-400'}`}>
                {count}
              </span>
            </a>
          );
        })}
      </div>

      {/* 이벤트 그리드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-body">해당 조건의 이벤트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
