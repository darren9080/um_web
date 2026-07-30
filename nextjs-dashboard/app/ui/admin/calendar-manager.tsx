'use client';

import { useState, useTransition } from 'react';
import { ArrowPathIcon, CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CalendarForm, type CalendarFormData } from '@/app/ui/admin/calendar-form';
import { syncCalendarNow } from '@/app/lib/actions/calendar';
import type { CalendarItem } from '@/app/lib/cms/definitions';

const typeLabels: Record<CalendarItem['type'], string> = {
  coverage: '취재',
  interview: '인터뷰',
  deadline: '마감',
  meeting: '회의',
};

interface CalendarManagerProps {
  initialItems: CalendarItem[];
}

export default function CalendarManager({ initialItems }: CalendarManagerProps) {
  const [items, setItems] = useState<CalendarItem[]>(initialItems);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarFormData | undefined>(undefined);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const syncedCount = items.filter((i) => i.googleEventId).length;
  const pendingCount = items.length - syncedCount;

  function openAdd() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleSync() {
    setError(null);
    setSyncMessage(null);
    startTransition(async () => {
      try {
        const result = await syncCalendarNow();
        setSyncMessage(`동기화 완료 — 총 ${result.total}건 중 ${result.upserted}건 반영, ${result.skipped}건 건너뜀`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Google Calendar 동기화 중 오류가 발생했습니다.');
      }
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end gap-2">
        <button
          onClick={handleSync}
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowPathIcon className="h-5 w-5" />
          {isPending ? '동기화 중…' : '동기화'}
        </button>
        <button
          onClick={openAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          일정 추가
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}
      {syncMessage && (
        <p className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{syncMessage}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">Google Calendar 연결</h2>
          <div className="mt-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
            OAuth 연결 후 이벤트 생성, 수정, 삭제를 양방향 동기화합니다.
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">동기화된 일정</dt>
              <dd className="font-semibold text-slate-950">{syncedCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">동기화 대기</dt>
              <dd className="font-semibold text-slate-950">{pendingCount}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <CalendarDaysIcon className="h-5 w-5 text-slate-500" />
            <h2 className="font-semibold text-slate-950">다가오는 일정</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setEditing({
                    id: item.id,
                    title: item.title,
                    startsAt: item.startsAt,
                    endsAt: item.endsAt,
                    type: item.type,
                  });
                  setFormOpen(true);
                }}
                className="grid w-full gap-3 px-4 py-4 text-left md:grid-cols-[auto_1fr_auto] md:items-center hover:bg-slate-50"
              >
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
              </button>
            ))}
            {items.length === 0 && (
              <p className="px-4 py-12 text-center text-sm text-slate-500">등록된 일정이 없습니다.</p>
            )}
          </div>
        </section>
      </div>

      <CalendarForm open={formOpen} onClose={handleClose} initial={editing} />
    </>
  );
}
