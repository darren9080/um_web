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
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useOptimistic, useTransition } from 'react';
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
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${sectionColors[slot.section]}`}
          >
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

interface HomepageDndEditorProps {
  initialSlots: HomepageSlot[];
}

export default function HomepageDndEditor({ initialSlots }: HomepageDndEditorProps) {
  const [optimisticSlots, setOptimisticSlots] = useOptimistic(initialSlots);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = optimisticSlots.findIndex((s) => s.id === active.id);
    const newIndex = optimisticSlots.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(optimisticSlots, oldIndex, newIndex).map((slot, idx) => ({
      ...slot,
      position: idx + 1,
    }));

    startTransition(async () => {
      setOptimisticSlots(reordered);
      await reorderSlots(reordered.map(({ id, position }) => ({ id, position })));
    });
  }

  function handleToggleVisibility(id: string, current: boolean) {
    const updated = optimisticSlots.map((s) =>
      s.id === id ? { ...s, isVisible: !current } : s,
    );
    startTransition(async () => {
      setOptimisticSlots(updated);
      await toggleSlotVisibility(id, !current);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={optimisticSlots.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {optimisticSlots.map((slot) => (
            <SortableSlot
              key={slot.id}
              slot={slot}
              onToggleVisibility={handleToggleVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
