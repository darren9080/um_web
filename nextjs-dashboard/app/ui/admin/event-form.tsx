'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createEvent, updateEvent } from '@/app/lib/actions/events';
import { LocationAutocomplete } from './location-autocomplete';

export type EventFormData = {
  id?: string;
  title?: string;
  description?: string;
  event_at?: string;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  location_place_id?: string;
  is_published?: boolean;
  visible_from?: string;
  recurrence_type?: string;
  recurrence_end_date?: string;
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
  const [recurrence, setRecurrence] = useState(initial?.recurrence_type ?? 'none');
  const [locationData, setLocationData] = useState<{
    address: string; lat: number; lng: number; placeId: string;
  } | null>(null);

  const handleLocationSelect = useCallback((data: { address: string; lat: number; lng: number; placeId: string }) => {
    setLocationData(data);
  }, []);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    if (locationData) {
      formData.set('location', locationData.address);
      formData.set('location_lat', String(locationData.lat));
      formData.set('location_lng', String(locationData.lng));
      formData.set('location_place_id', locationData.placeId);
    }
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
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {isEdit ? '이벤트 수정' : '이벤트 추가'}
          </h2>
          <button type="button" onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label="닫기">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 px-6 py-6">

            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input id="title" name="title" type="text" required
                defaultValue={initial?.title ?? ''}
                placeholder="이벤트 제목을 입력하세요"
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            {/* 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">설명</label>
              <textarea id="description" name="description" rows={3}
                defaultValue={initial?.description ?? ''}
                placeholder="이벤트 내용을 입력하세요"
                className="mt-1.5 block w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            {/* 일시 */}
            <div>
              <label htmlFor="event_at" className="block text-sm font-medium text-slate-700">
                시작 일시 <span className="text-rose-500">*</span>
              </label>
              <input id="event_at" name="event_at" type="datetime-local" required
                defaultValue={initial?.event_at ? initial.event_at.slice(0, 16) : ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            {/* 반복 설정 */}
            <div>
              <label className="block text-sm font-medium text-slate-700">반복</label>
              <div className="mt-1.5 flex gap-2">
                {[
                  { value: 'none', label: '반복 없음' },
                  { value: 'weekly', label: '매주' },
                  { value: 'monthly', label: '매월' },
                ].map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => setRecurrence(opt.value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      recurrence === opt.value
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="recurrence_type" value={recurrence} />
            </div>

            {/* 반복 종료일 */}
            {recurrence !== 'none' && (
              <div>
                <label htmlFor="recurrence_end_date" className="block text-sm font-medium text-slate-700">
                  반복 종료일
                </label>
                <input id="recurrence_end_date" name="recurrence_end_date" type="date"
                  defaultValue={initial?.recurrence_end_date ?? ''}
                  className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
              </div>
            )}

            {/* 장소 (Google Maps 자동완성) */}
            <div>
              <label className="block text-sm font-medium text-slate-700">장소</label>
              <LocationAutocomplete
                defaultValue={initial?.location ?? ''}
                onSelect={handleLocationSelect}
              />
              {locationData && (
                <p className="mt-1 text-xs text-slate-400">
                  위도 {locationData.lat.toFixed(5)}, 경도 {locationData.lng.toFixed(5)}
                </p>
              )}
            </div>

            {/* 웹 노출 시작일 */}
            <div>
              <label htmlFor="visible_from" className="block text-sm font-medium text-slate-700">
                웹 노출 시작일
              </label>
              <input id="visible_from" name="visible_from" type="datetime-local"
                defaultValue={initial?.visible_from ? initial.visible_from.slice(0, 16) : ''}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
              <p className="mt-1 text-xs text-slate-400">비워두면 즉시 공개 여부에 따라 결정됩니다</p>
            </div>

            {/* 즉시 공개 */}
            <div className="flex items-center gap-3">
              <input id="is_published" name="is_published" type="checkbox"
                defaultChecked={initial?.is_published ?? false}
                className="h-4 w-4 rounded border-slate-300 accent-slate-900" />
              <label htmlFor="is_published" className="text-sm font-medium text-slate-700">즉시 공개</label>
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
