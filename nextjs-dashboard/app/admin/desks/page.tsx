import { deskQueue } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import {
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  PrinterIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const deskLabels = {
  online: '온라인',
  print: '지면',
  video: '화상',
};

const deskIcons = {
  online: ClipboardDocumentCheckIcon,
  print: PrinterIcon,
  video: VideoCameraIcon,
};

const priorityLabels = {
  urgent: '긴급',
  high: '높음',
  normal: '보통',
};

export default function DesksPage() {
  return (
    <>
      <SectionHeader
        title="기사 데스크"
        description="온라인 데스크, 지면 데스크, 화상 데스크의 검토 대기열과 마감 상태를 한 화면에서 관리합니다."
        action={
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <CheckCircleIcon className="h-5 w-5" />
            선택 승인
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {(['online', 'print', 'video'] as const).map((desk) => {
          const Icon = deskIcons[desk];
          const items = deskQueue.filter((item) => item.desk === desk);

          return (
            <section key={desk} className="rounded-md border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                <Icon className="h-5 w-5 text-slate-500" />
                <h2 className="font-semibold text-slate-950">{deskLabels[desk]} 데스크</h2>
              </div>
              <div className="space-y-3 p-4">
                {items.map((item) => (
                  <article key={item.id} className="rounded-md bg-slate-50 p-4">
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
                  </article>
                ))}
                {items.length === 0 ? (
                  <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">대기 중인 기사가 없습니다.</div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
