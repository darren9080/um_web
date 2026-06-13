import { homepageSlots as sampleSlots } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import HomepageDndEditor from '@/app/ui/admin/homepage-dnd-editor';
import { EyeIcon } from '@heroicons/react/24/outline';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { HomepageSlot } from '@/app/lib/cms/definitions';
import Link from 'next/link';

async function fetchSlots(): Promise<HomepageSlot[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('homepage_slots')
      .select('*')
      .order('position', { ascending: true });

    if (error || !data || data.length === 0) return sampleSlots;

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

  return (
    <>
      <SectionHeader
        title="메인페이지 기사 배치"
        description="드래그앤드랍으로 기사 순서와 섹션 노출 여부를 조정합니다. 오른쪽 미리보기에 실시간 반영됩니다."
        action={
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <EyeIcon className="h-5 w-5" />
            홈페이지 보기
          </Link>
        }
      />
      <HomepageDndEditor initialSlots={slots} />
    </>
  );
}
