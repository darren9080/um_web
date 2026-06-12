import type { ArticleStatus } from '@/app/lib/cms/definitions';
import clsx from 'clsx';

const labels: Record<ArticleStatus, string> = {
  draft: '초안',
  copyediting: '교열',
  desk_review: '데스크 검토',
  scheduled: '예약',
  published: '발행',
  archived: '보관',
};

const colors: Record<ArticleStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  copyediting: 'bg-amber-100 text-amber-800',
  desk_review: 'bg-sky-100 text-sky-800',
  scheduled: 'bg-violet-100 text-violet-800',
  published: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-zinc-100 text-zinc-700',
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={clsx('inline-flex rounded-full px-2 py-1 text-xs font-semibold', colors[status])}>
      {labels[status]}
    </span>
  );
}
