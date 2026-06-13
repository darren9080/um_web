'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';

export async function createEvent(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const event_at = formData.get('event_at') as string;
  const location = formData.get('location') as string;
  const is_published = formData.get('is_published') === 'on';

  if (!title || !event_at) {
    throw new Error('제목과 일시는 필수 항목입니다.');
  }

  const { error } = await supabase.from('editorial_events').insert({
    title,
    description,
    event_at,
    location,
    is_published,
  });

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const event_at = formData.get('event_at') as string;
  const location = formData.get('location') as string;
  const is_published = formData.get('is_published') === 'on';

  if (!title || !event_at) {
    throw new Error('제목과 일시는 필수 항목입니다.');
  }

  const { error } = await supabase
    .from('editorial_events')
    .update({
      title,
      description,
      event_at,
      location,
      is_published,
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}

export async function deleteEvent(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from('editorial_events').delete().eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/events');
}
