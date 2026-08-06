'use client';

import { useState, useTransition } from 'react';
import {
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  PrinterIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import { approveDeskItems } from '@/app/lib/actions/desk';
import type { DeskQueueItem, DeskType } from '@/app/lib/cms/definitions';

const deskLabels: Record<DeskType, string> = {
  online: '온라인',
  print: '지면',
  video: '화상',
};

const deskIcons: Record<DeskType, typeof ClipboardDocumentCheckIcon> = {
  online: ClipboardDocumentCheckIcon,
  print: PrinterIcon,
  video: VideoCameraIcon,
};

const priorityLabels: Record<DeskQueueItem['priority'], string> = {
  urgent: '긴급',
  high: '높음',
  normal: '보통',
};

interface DeskManagerProps {
  initialItems: DeskQueueItem[];
}

export default function DeskManager({ initialItems }: DeskManagerProps) {
  const [items, setItems] = useState<DeskQueueItem[]>(initialItems);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleApprove(desk: DeskType) {
    const ids = items.filter((item) => item.desk === desk && selected.has(item.id)).map((item) => item.id);
    if (ids.length === 0) {
      setError('승인할 항목을 먼저 선택해주세요.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await approveDeskItems(ids, desk);
        setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
        setSelected((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '승인 중 오류가 발생했습니다.');
      }
    });
  }

  return (
    <>
      {error && (
        <p className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {(['online', 'print', 'video'] as const).map((desk) => {
          const Icon = deskIcons[desk];
          const deskItems = items.filter((item) => item.desk === desk);
          const selectedCount = deskItems.filter((item) => selected.has(item.id)).length;

          return (
            <section key={desk} className="rounded-md border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-slate-500" />
                  <h2 className="font-semibold text-slate-950">{deskLabels[desk]} 데스크</h2>
                </div>
                <button
                  onClick={() => handleApprove(desk)}
                  disabled={isPending || selectedCount === 0}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  선택 승인{selectedCount > 0 ? ` (${selectedCount})` : ''}
                </button>
              </div>
              <div className="space-y-3 p-4">
                {deskItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md bg-slate-50 p-4 hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggle(item.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 accent-slate-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-slate-950">{item.title}</p>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                          {priorityLabels[item.priority]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.owner}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <StatusBadge status={item.status} />
                        <p className="text-xs text-slate-500">{item.deadline.replace('T', ' ').slice(0, 16)}</p>
                      </div>
                    </div>
                  </label>
                ))}
                {deskItems.length === 0 && (
                  <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">
                    대기 중인 기사가 없습니다.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
