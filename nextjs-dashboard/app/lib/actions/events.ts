'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';

function parseEventFormData(formData: FormData) {
  return {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    event_at: formData.get('event_at') as string,
    location: (formData.get('location') as string) || null,
    location_lat: formData.get('location_lat') ? Number(formData.get('location_lat')) : null,
    location_lng: formData.get('location_lng') ? Number(formData.get('location_lng')) : null,
    location_place_id: (formData.get('location_place_id') as string) || null,
    is_published: formData.get('is_published') === 'on',
    visible_from: (formData.get('visible_from') as string) || null,
    recurrence_type: (formData.get('recurrence_type') as string) || 'none',
    recurrence_end_date: (formData.get('recurrence_end_date') as string) || null,
  };
}

export async function createEvent(formData: FormData) {
  const data = parseEventFormData(formData);

  if (!data.title || !data.event_at) {
    throw new Error('제목과 일시는 필수 항목입니다.');
  }

  const { error } = await getSupabaseAdmin().from('editorial_events').insert(data);

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}

export async function updateEvent(id: string, formData: FormData) {
  const data = parseEventFormData(formData);

  if (!data.title || !data.event_at) {
    throw new Error('제목과 일시는 필수 항목입니다.');
  }

  const { error } = await getSupabaseAdmin()
    .from('editorial_events')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}

export async function deleteEvent(id: string) {
  const { error } = await getSupabaseAdmin().from('editorial_events').delete().eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}
