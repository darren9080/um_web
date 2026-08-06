import { deskQueue as sampleDeskQueue } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import DeskManager from '@/app/ui/admin/desk-manager';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { DeskQueueItem } from '@/app/lib/cms/definitions';

async function fetchDeskQueue(): Promise<DeskQueueItem[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('desk_queue')
      .select(
        '*, article:articles!article_id(title, status), assignee:cms_profiles!assignee_id(display_name)',
      )
      .is('completed_at', null)
      .order('deadline_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleDeskQueue;
    }

    return data.map((row): DeskQueueItem => ({
      id: row.id,
      desk: row.desk,
      title: row.article?.title ?? '',
      owner: row.assignee?.display_name ?? '미배정',
      status: row.article?.status ?? 'draft',
      deadline: row.deadline_at ?? '',
      priority: row.priority ?? 'normal',
    }));
  } catch {
    return sampleDeskQueue;
  }
}

export default async function DesksPage() {
  const items = await fetchDeskQueue();

  return (
    <>
      <SectionHeader
        title="기사 데스크"
        description="온라인 데스크, 지면 데스크, 화상 데스크의 검토 대기열과 마감 상태를 한 화면에서 관리합니다."
      />
      <DeskManager initialItems={items} />
    </>
  );
}
