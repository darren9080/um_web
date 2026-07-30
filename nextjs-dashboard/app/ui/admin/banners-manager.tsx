'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  ArrowPathIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { BannerForm, type BannerFormData } from '@/app/ui/admin/banner-form';
import { deleteBanner, toggleBannerActive } from '@/app/lib/actions/banners';
import type { Banner } from '@/app/lib/cms/definitions';

const placementLabels: Record<Banner['placement'], string> = {
  top: '상단',
  main: '메인',
  sidebar: '사이드',
  article_inline: '기사 본문',
};

interface BannersManagerProps {
  initialBanners: Banner[];
}

export default function BannersManager({ initialBanners }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BannerFormData | undefined>(undefined);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function openAdd() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing({
      id: banner.id,
      title: banner.title,
      placement: banner.placement,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      startsAt: banner.startsAt,
      endsAt: banner.endsAt,
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    });
    setFormOpen(true);
  }

  function handleClose() {
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleToggle(banner: Banner) {
    setPendingId(banner.id);
    startTransition(async () => {
      try {
        await toggleBannerActive(banner.id, !banner.isActive);
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b)),
        );
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('이 배너를 삭제하시겠습니까?')) return;
    setPendingId(id);
    startTransition(async () => {
      try {
        await deleteBanner(id);
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={openAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          배너 추가
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {banners.map((banner) => (
          <article key={banner.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" sizes="160px" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {placementLabels[banner.placement]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      banner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {banner.isActive ? '노출 중' : '중지'}
                  </span>
                </div>
                <h2 className="mt-3 font-semibold text-slate-950">{banner.title}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{banner.linkUrl}</p>
                <p className="mt-3 text-sm text-slate-600">
                  {banner.startsAt.slice(0, 10)} - {banner.endsAt.slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                onClick={() => openEdit(banner)}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <PencilSquareIcon className="h-5 w-5" />
                수정
              </button>
              <button
                onClick={() => handleToggle(banner)}
                disabled={pendingId === banner.id}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowPathIcon className="h-5 w-5" />
                상태 전환
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                disabled={pendingId === banner.id}
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-rose-200 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5" />
                삭제
              </button>
            </div>
          </article>
        ))}

        {banners.length === 0 && (
          <p className="col-span-2 py-12 text-center text-sm text-slate-500">
            등록된 배너가 없습니다.
          </p>
        )}
      </div>

      <BannerForm open={formOpen} onClose={handleClose} initial={editing} />
    </>
  );
}
