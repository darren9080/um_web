'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { requirePermission } from '@/app/lib/actions/guard';
import type { DeskType } from '@/app/lib/cms/definitions';

const DESK_PERMISSION: Record<DeskType, 'desk.online' | 'desk.print' | 'desk.video'> = {
  online: 'desk.online',
  print: 'desk.print',
  video: 'desk.video',
};

// 승인 시 기사가 다음으로 넘어가는 상태. articles.ts의 ALLOWED_TRANSITIONS와
// 반드시 일치해야 한다 — draft/copyediting에서 desk_review로 넘어가는 것만
// 유효한 전이다.
const APPROVAL_NEXT_STATUS = 'desk_review';

export async function approveDeskItems(ids: string[], desk: DeskType) {
  await requirePermission(DESK_PERMISSION[desk]);

  if (ids.length === 0) {
    throw new Error('승인할 항목을 선택해주세요.');
  }

  const supabase = getSupabaseAdmin();

  const { data: items, error: fetchError } = await supabase
    .from('desk_queue')
    .select('id, article_id, desk')
    .in('id', ids);

  if (fetchError || !items || items.length === 0) {
    throw new Error('데스크 항목을 찾을 수 없습니다.');
  }

  // 온라인 데스크 담당자가 지면/화상 데스크 항목을 승인하지 못하도록,
  // 요청한 desk와 실제 항목의 desk가 전부 일치하는지 재확인한다
  // (requirePermission만으로는 항목 자체의 소속 데스크까지는 못 걸러낸다).
  const mismatched = items.filter((item) => item.desk !== desk);
  if (mismatched.length > 0) {
    throw new Error('다른 데스크에 속한 항목은 이 데스크 권한으로 승인할 수 없습니다.');
  }

  const { error: updateError } = await supabase
    .from('desk_queue')
    .update({ completed_at: new Date().toISOString() })
    .in('id', ids);

  if (updateError) {
    console.error('Error approving desk items:', updateError);
    throw new Error(updateError.message);
  }

  const articleIds = items.map((item) => item.article_id);
  const { error: articleError } = await supabase
    .from('articles')
    .update({ status: APPROVAL_NEXT_STATUS })
    .in('id', articleIds)
    .not('status', 'in', '(published,archived)');

  if (articleError) {
    // 데스크 승인 자체는 이미 기록됐으므로, 기사 상태 갱신 실패는 throw하지
    // 않고 경고만 남긴다 — 필요하면 기사 페이지에서 수동으로 상태를 맞춘다.
    console.warn('데스크 승인 후 기사 상태 갱신 실패:', articleError.message);
  }

  revalidatePath('/admin/desks');
  revalidatePath('/admin/articles');
}
