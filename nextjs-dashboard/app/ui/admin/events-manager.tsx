'use client';

import { useState, useTransition } from 'react';
import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { EventForm, type EventFormData } from '@/app/ui/admin/event-form';
import { deleteEvent } from '@/app/lib/actions/events';
import type { EditorialEvent } from '@/app/lib/cms/definitions';

interface EventsManagerProps {
  initialEvents: EditorialEvent[];
}

export default function EventsManager({ initialEvents }: EventsManagerProps) {
  const [events, setEvents] = useState<EditorialEvent[]>(initialEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventFormData | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function openAdd() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(event: EditorialEvent) {
    setEditing({
      id: event.id,
      title: event.title,
      description: event.description,
      event_at: event.date,
      location: event.location,
      is_published: event.isPublished,
    });
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleDelete(id: string) {
    if (!confirm('이 이벤트를 삭제하시겠습니까?')) return;
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteEvent(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <>
      {/* "이벤트 추가" trigger — rendered by the parent's SectionHeader action slot */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={openAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          이벤트 추가
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <CalendarDaysIcon className="h-6 w-6 flex-none text-sky-600" />
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  event.isPublished
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {event.isPublished ? '공개' : '비공개'}
              </span>
            </div>
            <h2 className="mt-4 font-semibold text-slate-950">{event.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{event.description}</p>
            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p>{event.date.replace('T', ' ').slice(0, 16)}</p>
              {event.location && <p>{event.location}</p>}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <CheckBadgeIcon className="h-5 w-5 text-emerald-600" />
              {event.calendarSynced ? 'Google Calendar 동기화됨' : '동기화 대기'}
            </div>
            {/* edit / delete */}
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => openEdit(event)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <PencilSquareIcon className="h-4 w-4" />
                수정
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                disabled={deletingId === event.id}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <TrashIcon className="h-4 w-4" />
                {deletingId === event.id ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </article>
        ))}

        {events.length === 0 && (
          <p className="col-span-3 py-12 text-center text-sm text-slate-500">
            등록된 이벤트가 없습니다.
          </p>
        )}
      </div>

      <EventForm open={formOpen} onClose={handleClose} initial={editing} />
    </>
  );
}
