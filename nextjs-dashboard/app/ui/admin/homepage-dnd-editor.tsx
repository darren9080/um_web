'use client';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowsUpDownIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { reorderSlots, toggleSlotVisibility } from '@/app/lib/actions/homepage';
import type { HomepageSlot } from '@/app/lib/cms/definitions';

const sectionLabels: Record<HomepageSlot['section'], string> = {
  lead: '리드',
  top_grid: '상단 그리드',
  latest: '최신',
  opinion: '오피니언',
  feature: '기획',
};

const sectionColors: Record<HomepageSlot['section'], string> = {
  lead: 'bg-sky-100 text-sky-700',
  top_grid: 'bg-violet-100 text-violet-700',
  latest: 'bg-emerald-100 text-emerald-700',
  opinion: 'bg-amber-100 text-amber-700',
  feature: 'bg-rose-100 text-rose-700',
};

interface SortableSlotProps {
  slot: HomepageSlot;
  onToggleVisibility: (id: string, current: boolean) => void;
}

function SortableSlot({ slot, onToggleVisibility }: SortableSlotProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slot.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-[auto_1fr_auto] md:items-center"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-10 w-10 cursor-grab items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 active:cursor-grabbing"
        aria-label="드래그하여 순서 변경"
      >
        <ArrowsUpDownIcon className="h-5 w-5" />
      </button>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sectionColors[slot.section]}`}>
            {sectionLabels[slot.section]}
          </span>
          <span className="text-xs text-slate-500">위치 {slot.position}</span>
        </div>
        <p className="mt-2 font-medium text-slate-950">{slot.articleTitle}</p>
      </div>

      <button
        onClick={() => onToggleVisibility(slot.id, slot.isVisible)}
        className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors ${
          slot.isVisible
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
        }`}
      >
        {slot.isVisible ? '노출' : '숨김'}
      </button>
    </div>
  );
}

function WireframePreview({ slots }: { slots: HomepageSlot[] }) {
  const visible = slots.filter((s) => s.isVisible);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-4">
        <RectangleGroupIcon className="h-5 w-5 text-slate-500" />
        <h2 className="font-semibold text-slate-950">홈 화면 미리보기</h2>
      </div>
      <div className="flex flex-col gap-3 rounded-md bg-slate-100 p-3 min-h-[460px]">
        {visible.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white p-6">
            <p className="text-sm text-slate-400">노출된 슬롯이 없습니다</p>
          </div>
        ) : visible.map((slot, idx) => (
          <div
            key={slot.id}
            className={`rounded-md bg-white p-4 ${idx === 0 ? 'ring-2 ring-brand-red/30' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sectionColors[slot.section]}`}>
                {sectionLabels[slot.section]}
              </span>
              <span className="text-xs text-slate-400">#{idx + 1}</span>
            </div>
            <p className={`mt-2 line-clamp-2 text-slate-950 ${idx === 0 ? 'font-semibold' : 'text-sm'}`}>
              {slot.articleTitle || '—'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface HomepageDndEditorProps {
  initialSlots: HomepageSlot[];
}

export default function HomepageDndEditor({ initialSlots }: HomepageDndEditorProps) {
  const [slots, setSlots] = useState(initialSlots);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slots.findIndex((s) => s.id === active.id);
    const newIndex = slots.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(slots, oldIndex, newIndex).map((slot, idx) => ({
      ...slot,
      position: idx + 1,
    }));

    setSlots(reordered);
    startTransition(async () => {
      await reorderSlots(reordered.map(({ id, position }) => ({ id, position })));
    });
  }

  function handleToggleVisibility(id: string, current: boolean) {
    const updated = slots.map((s) =>
      s.id === id ? { ...s, isVisible: !current } : s,
    );
    setSlots(updated);
    startTransition(async () => {
      await toggleSlotVisibility(id, !current);
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-slate-950 mb-4">배치 보드</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={slots.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {slots.map((slot) => (
                <SortableSlot
                  key={slot.id}
                  slot={slot}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      <WireframePreview slots={slots} />
    </div>
  );
}
