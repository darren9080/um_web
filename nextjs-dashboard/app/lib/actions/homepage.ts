'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';

export async function reorderSlots(slots: { id: string; position: number }[]) {
  const supabase = getSupabaseAdmin();

  const updates = slots.map(({ id, position }) =>
    supabase
      .from('homepage_slots')
      .update({ position })
      .eq('id', id),
  );

  const results = await Promise.all(updates);

  for (const result of results) {
    if (result.error) {
      console.error('Error updating slot position:', result.error);
      throw new Error(result.error.message);
    }
  }

  revalidatePath('/admin/homepage');
}

export async function toggleSlotVisibility(id: string, isVisible: boolean) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('homepage_slots')
    .update({ is_visible: isVisible })
    .eq('id', id);

  if (error) {
    console.error('Error toggling slot visibility:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/homepage');
}
