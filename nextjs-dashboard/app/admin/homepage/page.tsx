import { homepageSlots as sampleSlots } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import HomepageDndEditor from '@/app/ui/admin/homepage-dnd-editor';
import { EyeIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { HomepageSlot } from '@/app/lib/cms/definitions';

const sectionLabels = {
  lead: '리드',
  top_grid: '상단 그리드',
  latest: '최신',
  opinion: '오피니언',
  feature: '기획',
};

async function fetchSlots(): Promise<HomepageSlot[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('homepage_slots')
      .select('*')
      .order('position', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleSlots;
    }

    return data.map((row) => ({
      id: row.id,
      section: row.section,
      label: row.label ?? '',
      articleId: row.article_id ?? '',
      articleTitle: row.article_title ?? '',
      position: row.position,
      isVisible: row.is_visible ?? true,
    }));
  } catch {
    return sampleSlots;
  }
}

export default async function HomepagePage() {
  const slots = await fetchSlots();

  const leadSlot = slots.find((s) => s.section === 'lead');
  const topGridSlot = slots.find((s) => s.section === 'top_grid');
  const latestSlot = slots.find((s) => s.section === 'latest');
  const featureSlot = slots.find((s) => s.section === 'feature');

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
          <div className="mt-4">
            <HomepageDndEditor initialSlots={slots} />
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <RectangleGroupIcon className="h-5 w-5 text-slate-500" />
            <h2 className="font-semibold text-slate-950">홈 화면 와이어프레임</h2>
          </div>
          <div className="mt-4 grid min-h-[460px] gap-3 rounded-md bg-slate-100 p-3">
            <div className="rounded-md bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">
                {sectionLabels.lead.toUpperCase()}
              </p>
              <p className="mt-2 font-semibold text-slate-950">{leadSlot?.articleTitle}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  {sectionLabels.top_grid.toUpperCase()}
                </p>
                <p className="mt-2 text-sm text-slate-800">{topGridSlot?.articleTitle}</p>
              </div>
              <div className="rounded-md bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  {sectionLabels.latest.toUpperCase()}
                </p>
                <p className="mt-2 text-sm text-slate-800">{latestSlot?.articleTitle}</p>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">
                {sectionLabels.feature.toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-slate-800">{featureSlot?.articleTitle}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
