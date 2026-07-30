import { banners as sampleBanners } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import BannersManager from '@/app/ui/admin/banners-manager';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { Banner } from '@/app/lib/cms/definitions';

async function fetchBanners(): Promise<Banner[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleBanners;
    }

    return data.map((row): Banner => ({
      id: row.id,
      title: row.title ?? '',
      placement: row.placement ?? 'main',
      imageUrl: row.image_url ?? '',
      linkUrl: row.link_url ?? '',
      startsAt: row.starts_at ?? '',
      endsAt: row.ends_at ?? '',
      isActive: row.is_active ?? false,
      sortOrder: row.sort_order ?? 0,
      ownerRole: 'ad_manager',
    }));
  } catch {
    return sampleBanners;
  }
}

export default async function BannersPage() {
  const banners = await fetchBanners();

  return (
    <>
      <SectionHeader
        title="광고 배너 관리"
        description="권한이 있는 담당자가 배너 이미지, 링크, 위치, 노출 기간, 활성 상태를 웹에서 직접 조정합니다."
      />
      <BannersManager initialBanners={banners} />
    </>
  );
}
