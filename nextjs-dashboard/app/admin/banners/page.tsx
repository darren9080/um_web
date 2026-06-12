import { banners } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { ArrowPathIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const placementLabels = {
  top: '상단',
  main: '메인',
  sidebar: '사이드',
  article_inline: '기사 본문',
};

export default function BannersPage() {
  return (
    <>
      <SectionHeader
        title="광고 배너 관리"
        description="권한이 있는 담당자가 배너 이미지, 링크, 위치, 노출 기간, 활성 상태를 웹에서 직접 조정합니다."
        action={
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <PlusIcon className="h-5 w-5" />
            배너 추가
          </button>
        }
      />

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
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
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
              <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <PhotoIcon className="h-5 w-5" />
                이미지
              </button>
              <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <ArrowPathIcon className="h-5 w-5" />
                상태 전환
              </button>
              <button className="h-10 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                수정
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
