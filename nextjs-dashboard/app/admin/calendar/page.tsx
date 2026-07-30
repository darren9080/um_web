import { calendarItems as sampleCalendarItems } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import CalendarManager from '@/app/ui/admin/calendar-manager';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { CalendarItem } from '@/app/lib/cms/definitions';

async function fetchCalendarItems(): Promise<CalendarItem[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('editorial_calendar_items')
      .select('*, owner:cms_profiles!owner_id(display_name)')
      .order('starts_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleCalendarItems;
    }

    return data.map((row): CalendarItem => ({
      id: row.id,
      title: row.title ?? '',
      startsAt: row.starts_at ?? '',
      endsAt: row.ends_at ?? '',
      owner: row.owner?.display_name ?? '미배정',
      type: row.item_type ?? 'coverage',
      googleEventId: row.google_event_id ?? undefined,
    }));
  } catch {
    return sampleCalendarItems;
  }
}

export default async function CalendarPage() {
  const items = await fetchCalendarItems();

  return (
    <>
      <SectionHeader
        title="일정관리"
        description="취재 일정, 인터뷰, 편집 마감, 회의를 관리하고 Google Calendar 이벤트와 동기화합니다."
      />
      <CalendarManager initialItems={items} />
    </>
  );
}
