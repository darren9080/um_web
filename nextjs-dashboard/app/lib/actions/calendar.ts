'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { requirePermission, getCurrentProfileId } from '@/app/lib/actions/guard';
import {
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
} from '@/app/lib/google-calendar';
import { syncGoogleCalendar } from '@/app/lib/cms/calendar-sync';

function parseCalendarFormData(formData: FormData) {
  return {
    title: (formData.get('title') as string) ?? '',
    starts_at: (formData.get('starts_at') as string) ?? '',
    ends_at: (formData.get('ends_at') as string) ?? '',
    item_type: (formData.get('item_type') as string) || 'coverage',
  };
}

export async function createCalendarItem(formData: FormData) {
  const { userEmail } = await requirePermission('calendar.manage');
  const data = parseCalendarFormData(formData);

  if (!data.title || !data.starts_at || !data.ends_at) {
    throw new Error('제목과 일정 시간은 필수 항목입니다.');
  }

  const ownerId = await getCurrentProfileId(userEmail);

  // Google Calendar 연동이 아직 설정되지 않았거나(개발 환경 등) 실패해도
  // 내부 일정 자체는 저장한다 — 연동은 나중에 "동기화"로 다시 시도할 수 있다.
  let googleEventId: string | null = null;
  try {
    googleEventId = await createGoogleCalendarEvent({
      title: data.title,
      startsAt: data.starts_at,
      endsAt: data.ends_at,
    });
  } catch (err) {
    console.warn('Google Calendar 이벤트 생성 실패:', err instanceof Error ? err.message : err);
  }

  const { error } = await getSupabaseAdmin()
    .from('editorial_calendar_items')
    .insert({ ...data, owner_id: ownerId, google_event_id: googleEventId });

  if (error) {
    console.error('Error creating calendar item:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/calendar');
}

export async function updateCalendarItem(id: string, formData: FormData) {
  await requirePermission('calendar.manage');
  const data = parseCalendarFormData(formData);

  if (!data.title || !data.starts_at || !data.ends_at) {
    throw new Error('제목과 일정 시간은 필수 항목입니다.');
  }

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('editorial_calendar_items')
    .select('google_event_id')
    .eq('id', id)
    .single();

  if (existing?.google_event_id) {
    try {
      await updateGoogleCalendarEvent(existing.google_event_id, {
        title: data.title,
        startsAt: data.starts_at,
        endsAt: data.ends_at,
      });
    } catch (err) {
      console.warn('Google Calendar 이벤트 수정 실패:', err instanceof Error ? err.message : err);
    }
  }

  const { error } = await supabase.from('editorial_calendar_items').update(data).eq('id', id);

  if (error) {
    console.error('Error updating calendar item:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/calendar');
}

export async function deleteCalendarItem(id: string) {
  await requirePermission('calendar.manage');

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('editorial_calendar_items')
    .select('google_event_id')
    .eq('id', id)
    .single();

  if (existing?.google_event_id) {
    try {
      await deleteGoogleCalendarEvent(existing.google_event_id);
    } catch (err) {
      console.warn('Google Calendar 이벤트 삭제 실패:', err instanceof Error ? err.message : err);
    }
  }

  const { error } = await supabase.from('editorial_calendar_items').delete().eq('id', id);

  if (error) {
    console.error('Error deleting calendar item:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/calendar');
}

// "동기화" 버튼이 호출하는 수동 트리거 — cron 라우트와 같은 로직을 재사용한다.
export async function syncCalendarNow() {
  await requirePermission('calendar.manage');
  const result = await syncGoogleCalendar();
  revalidatePath('/admin/calendar');
  return result;
}
