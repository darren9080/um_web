import { getSupabaseAdmin } from '@/app/lib/supabase';
import { listGoogleCalendarEvents } from '@/app/lib/google-calendar';

// Google Calendar → editorial_calendar_items 역방향 동기화. cron 라우트와
// "동기화" 버튼(수동 트리거) 양쪽에서 재사용한다. app/lib/cms/rss-sync.ts와
// 동일한 upsert 구조를 따른다.
export async function syncGoogleCalendar() {
  const events = await listGoogleCalendarEvents(new Date().toISOString());
  const supabase = getSupabaseAdmin();

  let upserted = 0;
  let skipped = 0;

  for (const event of events) {
    if (!event.id || !event.summary || !event.start?.dateTime || !event.end?.dateTime) {
      skipped += 1;
      continue;
    }

    const { error } = await supabase.from('editorial_calendar_items').upsert(
      {
        google_event_id: event.id,
        title: event.summary,
        starts_at: event.start.dateTime,
        ends_at: event.end.dateTime,
        item_type: 'coverage',
      },
      { onConflict: 'google_event_id' },
    );

    if (error) {
      console.warn('캘린더 이벤트 동기화 실패:', event.id, error.message);
      skipped += 1;
    } else {
      upserted += 1;
    }
  }

  return { total: events.length, upserted, skipped };
}
