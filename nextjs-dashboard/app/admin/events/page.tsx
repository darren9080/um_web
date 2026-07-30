import { events as sampleEvents } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import EventsManager from '@/app/ui/admin/events-manager';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import type { EditorialEvent } from '@/app/lib/cms/definitions';

async function fetchEvents(): Promise<EditorialEvent[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('editorial_events')
      .select('*')
      .order('event_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return sampleEvents;
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title ?? '',
      description: row.description ?? '',
      date: row.event_at ?? '',
      location: row.location ?? '',
      isPublished: row.is_published ?? false,
      calendarSynced: row.calendar_synced ?? false,
    }));
  } catch {
    return sampleEvents;
  }
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <>
      <SectionHeader
        title="이벤트 관리"
        description="행사와 취재 이벤트를 등록하고 공개 여부, 일정 동기화, 노출 순서를 관리합니다."
      />
      <EventsManager initialEvents={events} />
    </>
  );
}
