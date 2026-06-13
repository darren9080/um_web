import { events } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { CalendarDaysIcon, CheckBadgeIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function EventsPage() {
  return (
    <>
      <SectionHeader
        title="이벤트 관리"
        description="행사와 취재 이벤트를 등록하고 공개 여부, 일정 동기화, 노출 순서를 관리합니다."
        action={
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <PlusIcon className="h-5 w-5" />
            이벤트 추가
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <CalendarDaysIcon className="h-6 w-6 text-sky-600" />
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {event.isPublished ? '공개' : '비공개'}
              </span>
            </div>
            <h2 className="mt-4 font-semibold text-slate-950">{event.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{event.description}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>{event.date.replace('T', ' ').slice(0, 16)}</p>
              <p>{event.location}</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
              {event.calendarSynced ? 'Google Calendar 동기화됨' : '동기화 대기'}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
