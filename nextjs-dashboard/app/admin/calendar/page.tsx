import { calendarItems } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { ArrowPathIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';

const typeLabels = {
  coverage: '취재',
  interview: '인터뷰',
  deadline: '마감',
  meeting: '회의',
};

export default function CalendarPage() {
  return (
    <>
      <SectionHeader
        title="일정관리"
        description="취재 일정, 인터뷰, 편집 마감, 회의를 관리하고 Google Calendar 이벤트와 동기화합니다."
        action={
          <div className="flex gap-2">
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <ArrowPathIcon className="h-5 w-5" />
              동기화
            </button>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
              <PlusIcon className="h-5 w-5" />
              일정 추가
            </button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">Google Calendar 연결</h2>
          <div className="mt-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
            OAuth 연결 후 이벤트 생성, 수정, 삭제를 양방향 동기화합니다.
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">동기화된 일정</dt>
              <dd className="font-semibold text-slate-950">
                {calendarItems.filter((item) => item.googleEventId).length}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">동기화 대기</dt>
              <dd className="font-semibold text-slate-950">
                {calendarItems.filter((item) => !item.googleEventId).length}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <CalendarDaysIcon className="h-5 w-5 text-slate-500" />
            <h2 className="font-semibold text-slate-950">다가오는 일정</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {calendarItems.map((item) => (
              <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-700">
                  {item.startsAt.slice(8, 10)}
                </div>
                <div>
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.startsAt.replace('T', ' ').slice(0, 16)} · {item.owner}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {typeLabels[item.type]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
