'use client';

import { useRef, useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createCalendarItem, updateCalendarItem } from '@/app/lib/actions/calendar';

export type CalendarFormData = {
  id?: string;
  title?: string;
  startsAt?: string;
  endsAt?: string;
  type?: string;
};

interface CalendarFormProps {
  open: boolean;
  onClose: () => void;
  initial?: CalendarFormData;
}

const TYPES = [
  { value: 'coverage', label: '취재' },
  { value: 'interview', label: '인터뷰' },
  { value: 'deadline', label: '마감' },
  { value: 'meeting', label: '회의' },
];

export function CalendarForm({ open, onClose, initial }: CalendarFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (initial?.id) {
          await updateCalendarItem(initial.id, formData);
        } else {
          await createCalendarItem(formData);
        }
        formRef.current?.reset();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      }
    });
  }

  const isEdit = Boolean(initial?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {isEdit ? '일정 수정' : '일정 추가'}
          </h2>
          <button type="button" onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label="닫기">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 px-6 py-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input id="title" name="title" type="text" required
                defaultValue={initial?.title ?? ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            <div>
              <label htmlFor="item_type" className="block text-sm font-medium text-slate-700">유형</label>
              <select id="item_type" name="item_type"
                defaultValue={initial?.type ?? 'coverage'}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="starts_at" className="block text-sm font-medium text-slate-700">
                시작 일시 <span className="text-rose-500">*</span>
              </label>
              <input id="starts_at" name="starts_at" type="datetime-local" required
                defaultValue={initial?.startsAt ? initial.startsAt.slice(0, 16) : ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            <div>
              <label htmlFor="ends_at" className="block text-sm font-medium text-slate-700">
                종료 일시 <span className="text-rose-500">*</span>
              </label>
              <input id="ends_at" name="ends_at" type="datetime-local" required
                defaultValue={initial?.endsAt ? initial.endsAt.slice(0, 16) : ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
          </div>

          <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              취소
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
              {isPending ? '저장 중…' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
