'use client';

import { useRef, useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createEvent, updateEvent } from '@/app/lib/actions/events';

export type EventFormData = {
  id?: string;
  title?: string;
  description?: string;
  event_at?: string;
  location?: string;
  is_published?: boolean;
};

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  initial?: EventFormData;
}

export function EventForm({ open, onClose, initial }: EventFormProps) {
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
          await updateEvent(initial.id, formData);
        } else {
          await createEvent(formData);
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
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* drawer panel */}
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {isEdit ? '이벤트 수정' : '이벤트 추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="닫기"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 space-y-5 px-6 py-6">
            {/* title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={initial?.title ?? ''}
                placeholder="이벤트 제목을 입력하세요"
                className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={initial?.description ?? ''}
                placeholder="이벤트 내용을 입력하세요"
                className="mt-1.5 block w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* event_at */}
            <div>
              <label htmlFor="event_at" className="block text-sm font-medium text-slate-700">
                일시 <span className="text-rose-500">*</span>
              </label>
              <input
                id="event_at"
                name="event_at"
                type="datetime-local"
                required
                defaultValue={initial?.event_at ? initial.event_at.slice(0, 16) : ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                장소
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={initial?.location ?? ''}
                placeholder="장소를 입력하세요"
                className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

            {/* is_published */}
            <div className="flex items-center gap-3">
              <input
                id="is_published"
                name="is_published"
                type="checkbox"
                defaultChecked={initial?.is_published ?? false}
                className="h-4 w-4 rounded border-slate-300 accent-slate-900"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                즉시 공개
              </label>
            </div>

            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
          </div>

          {/* footer */}
          <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isPending ? '저장 중…' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
