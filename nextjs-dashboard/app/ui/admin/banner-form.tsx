'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createBanner, updateBanner, uploadBannerImage } from '@/app/lib/actions/banners';

export type BannerFormData = {
  id?: string;
  title?: string;
  placement?: string;
  imageUrl?: string;
  linkUrl?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
  sortOrder?: number;
};

interface BannerFormProps {
  open: boolean;
  onClose: () => void;
  initial?: BannerFormData;
}

const PLACEMENTS = [
  { value: 'top', label: '상단' },
  { value: 'main', label: '메인' },
  { value: 'sidebar', label: '사이드' },
  { value: 'article_inline', label: '기사 본문' },
];

export function BannerForm({ open, onClose, initial }: BannerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');

  if (!open) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsUploading(true);
    const fileFormData = new FormData();
    fileFormData.set('image', file);
    startTransition(async () => {
      try {
        const url = await uploadBannerImage(fileFormData);
        setImageUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set('image_url', imageUrl);

    startTransition(async () => {
      try {
        if (initial?.id) {
          await updateBanner(initial.id, formData);
        } else {
          await createBanner(formData);
        }
        formRef.current?.reset();
        setImageUrl('');
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
            {isEdit ? '배너 수정' : '배너 추가'}
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
              <label className="block text-sm font-medium text-slate-700">
                이미지 <span className="text-rose-500">*</span>
              </label>
              {imageUrl && (
                <div className="relative mt-2 aspect-[4/3] w-40 overflow-hidden rounded-md bg-slate-100">
                  <Image src={imageUrl} alt="미리보기" fill className="object-cover" sizes="160px" />
                </div>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-200 file:bg-slate-50 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-100" />
              {isUploading && <p className="mt-1 text-xs text-slate-400">업로드 중…</p>}
            </div>

            <div>
              <label htmlFor="placement" className="block text-sm font-medium text-slate-700">위치</label>
              <select id="placement" name="placement"
                defaultValue={initial?.placement ?? 'main'}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-slate-700">
                링크 URL <span className="text-rose-500">*</span>
              </label>
              <input id="link_url" name="link_url" type="url" required
                defaultValue={initial?.linkUrl ?? ''}
                placeholder="https://"
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="starts_at" className="block text-sm font-medium text-slate-700">
                  노출 시작 <span className="text-rose-500">*</span>
                </label>
                <input id="starts_at" name="starts_at" type="date" required
                  defaultValue={initial?.startsAt ? initial.startsAt.slice(0, 10) : ''}
                  className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
              </div>
              <div>
                <label htmlFor="ends_at" className="block text-sm font-medium text-slate-700">
                  노출 종료 <span className="text-rose-500">*</span>
                </label>
                <input id="ends_at" name="ends_at" type="date" required
                  defaultValue={initial?.endsAt ? initial.endsAt.slice(0, 10) : ''}
                  className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-slate-700">노출 순서</label>
              <input id="sort_order" name="sort_order" type="number" min={0}
                defaultValue={initial?.sortOrder ?? 0}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>

            <div className="flex items-center gap-3">
              <input id="is_active" name="is_active" type="checkbox"
                defaultChecked={initial?.isActive ?? false}
                className="h-4 w-4 rounded border-slate-300 accent-slate-900" />
              <label htmlFor="is_active" className="text-sm font-medium text-slate-700">즉시 노출</label>
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
            <button type="submit" disabled={isPending || isUploading}
              className="flex-1 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
              {isPending ? '저장 중…' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
