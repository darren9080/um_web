'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, updateArticle, updateArticleStatus } from '@/app/lib/actions/articles';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import { CATEGORY_LABELS } from '@/app/lib/definitions';
import type { Article, ArticleStatus } from '@/app/lib/cms/definitions';

const SECTIONS = Object.values(CATEGORY_LABELS);

// articles.ts의 ALLOWED_TRANSITIONS와 동일한 상태 머신을 프론트에서도
// 반영해, 실제로 전환 가능한 다음 상태만 버튼으로 보여준다.
const NEXT_STATUS_LABELS: Record<ArticleStatus, { status: ArticleStatus; label: string }[]> = {
  draft: [{ status: 'copyediting', label: '교열로 넘기기' }],
  copyediting: [{ status: 'desk_review', label: '데스크 검토 요청' }],
  desk_review: [
    { status: 'scheduled', label: '예약 발행' },
    { status: 'published', label: '즉시 발행' },
  ],
  scheduled: [{ status: 'published', label: '즉시 발행' }],
  published: [],
  archived: [{ status: 'draft', label: '초안으로 복원' }],
};

interface ArticleEditorFormProps {
  initial?: Article;
}

export default function ArticleEditorForm({ initial }: ArticleEditorFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ArticleStatus>(initial?.status ?? 'draft');

  const isEdit = Boolean(initial?.id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (initial?.id) {
          await updateArticle(initial.id, formData);
        } else {
          const newId = await createArticle(formData);
          router.push(`/admin/articles/${newId}/edit`);
          return;
        }
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.');
      }
    });
  }

  function handleStatusChange(next: ArticleStatus) {
    if (!initial?.id) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateArticleStatus(initial.id, next);
        setStatus(next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : '상태 변경 중 오류가 발생했습니다.');
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">현재 상태</span>
          <StatusBadge status={status} />
        </div>
        {isEdit && (
          <div className="flex gap-2">
            {NEXT_STATUS_LABELS[status].map((next) => (
              <button
                key={next.status}
                type="button"
                onClick={() => handleStatusChange(next.status)}
                disabled={isPending}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {next.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-md border border-slate-200 bg-white p-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              제목 <span className="text-rose-500">*</span>
            </label>
            <input
              id="title" name="title" type="text" required
              defaultValue={initial?.title ?? ''}
              className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-slate-700">리드(요약)</label>
            <textarea
              id="summary" name="summary" rows={2}
              defaultValue={initial?.summary ?? ''}
              className="mt-1.5 block w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-700">본문</label>
            <textarea
              id="body" name="body" rows={20}
              defaultValue={initial?.body ?? ''}
              className="mt-1.5 block w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-relaxed focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>

          {error && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isPending ? '저장 중…' : isEdit ? '저장' : '기사 만들기'}
          </button>
        </div>

        <div className="space-y-5">
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <label htmlFor="section" className="block text-sm font-medium text-slate-700">
              섹션 <span className="text-rose-500">*</span>
            </label>
            <select
              id="section" name="section" required
              defaultValue={initial?.section ?? SECTIONS[0]}
              className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label htmlFor="desk" className="mt-4 block text-sm font-medium text-slate-700">데스크</label>
            <select
              id="desk" name="desk"
              defaultValue={initial?.desk ?? 'online'}
              className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              <option value="online">온라인</option>
              <option value="print">지면</option>
              <option value="video">화상</option>
            </select>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-950">SEO</h3>
            <label htmlFor="seo_keywords" className="mt-3 block text-sm font-medium text-slate-700">
              키워드 (쉼표로 구분)
            </label>
            <input
              id="seo_keywords" name="seo_keywords" type="text"
              defaultValue={initial?.seoKeywords?.join(', ') ?? ''}
              className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />

            <label htmlFor="hero_image_url" className="mt-3 block text-sm font-medium text-slate-700">
              대표 이미지 URL
            </label>
            <input
              id="hero_image_url" name="hero_image_url" type="text"
              defaultValue={initial?.heroImage ?? ''}
              className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
