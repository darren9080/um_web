import { homepageSlots } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { ArrowsUpDownIcon, EyeIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';

const sectionLabels = {
  lead: '리드',
  top_grid: '상단 그리드',
  latest: '최신',
  opinion: '오피니언',
  feature: '기획',
};

export default function HomepagePage() {
  return (
    <>
      <SectionHeader
        title="메인페이지 기사 배치"
        description="메인 기사 순서, 위치, 섹션 노출 여부를 데스크가 직접 조정할 수 있도록 구성한 배치 관리 화면입니다."
        action={
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <EyeIcon className="h-5 w-5" />
            미리보기
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">배치 보드</h2>
          <div className="mt-4 space-y-3">
            {homepageSlots.map((slot) => (
              <div
                key={slot.id}
                className="grid gap-3 rounded-md border border-slate-200 p-4 md:grid-cols-[auto_1fr_auto] md:items-center"
              >
                <button className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                  <ArrowsUpDownIcon className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                      {sectionLabels[slot.section]}
                    </span>
                    <span className="text-xs text-slate-500">위치 {slot.position}</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-950">{slot.articleTitle}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {slot.isVisible ? '노출' : '숨김'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <RectangleGroupIcon className="h-5 w-5 text-slate-500" />
            <h2 className="font-semibold text-slate-950">홈 화면 와이어프레임</h2>
          </div>
          <div className="mt-4 grid min-h-[460px] gap-3 rounded-md bg-slate-100 p-3">
            <div className="rounded-md bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">LEAD</p>
              <p className="mt-2 font-semibold text-slate-950">{homepageSlots[0]?.articleTitle}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">TOP GRID</p>
                <p className="mt-2 text-sm text-slate-800">{homepageSlots[1]?.articleTitle}</p>
              </div>
              <div className="rounded-md bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">LATEST</p>
                <p className="mt-2 text-sm text-slate-800">{homepageSlots[2]?.articleTitle}</p>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">FEATURE</p>
              <p className="mt-2 text-sm text-slate-800">{homepageSlots[3]?.articleTitle}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
