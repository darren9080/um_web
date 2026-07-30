'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@/app/lib/supabase';
import { requirePermission, getCurrentProfileId } from '@/app/lib/actions/guard';

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

function parseBannerFormData(formData: FormData) {
  return {
    title: (formData.get('title') as string) ?? '',
    placement: (formData.get('placement') as string) || 'main',
    link_url: (formData.get('link_url') as string) ?? '',
    starts_at: (formData.get('starts_at') as string) ?? '',
    ends_at: (formData.get('ends_at') as string) ?? '',
    is_active: formData.get('is_active') === 'on',
    sort_order: formData.get('sort_order') ? Number(formData.get('sort_order')) : 0,
  };
}

// 이 프로젝트 최초의 파일 업로드 서버 액션 — 여기서 만드는 검증(타입/크기)과
// 경로 네이밍 규칙이 향후 다른 이미지 업로드의 기준이 된다.
export async function uploadBannerImage(formData: FormData) {
  await requirePermission('banners.manage');

  const file = formData.get('image') as File | null;
  if (!file || file.size === 0) {
    throw new Error('이미지 파일을 선택해주세요.');
  }
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    throw new Error('JPEG, PNG, WEBP, GIF 형식만 업로드할 수 있습니다.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('이미지 크기는 5MB를 초과할 수 없습니다.');
  }

  // 확장자는 검증된 MIME 타입에서 도출한다 — 사용자가 보낸 file.name은
  // 신뢰 경계 밖의 값이라 그대로 쓰면 임의 문자열이 스토리지 경로에 들어간다.
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await getSupabaseAdmin()
    .storage
    .from('banners')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Error uploading banner image:', error);
    throw new Error(error.message);
  }

  const { data } = getSupabaseAdmin().storage.from('banners').getPublicUrl(path);
  return data.publicUrl;
}

export async function createBanner(formData: FormData) {
  const { userEmail } = await requirePermission('banners.manage');
  const data = parseBannerFormData(formData);
  const imageUrl = (formData.get('image_url') as string) ?? '';

  if (!data.title || !data.link_url || !data.starts_at || !data.ends_at || !imageUrl) {
    throw new Error('제목, 이미지, 링크, 노출 기간은 필수 항목입니다.');
  }

  const createdBy = await getCurrentProfileId(userEmail);

  const { error } = await getSupabaseAdmin()
    .from('banners')
    .insert({ ...data, image_url: imageUrl, created_by: createdBy });

  if (error) {
    console.error('Error creating banner:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/banners');
}

export async function updateBanner(id: string, formData: FormData) {
  await requirePermission('banners.manage');
  const data = parseBannerFormData(formData);
  const imageUrl = (formData.get('image_url') as string) ?? '';

  if (!data.title || !data.link_url || !data.starts_at || !data.ends_at || !imageUrl) {
    throw new Error('제목, 이미지, 링크, 노출 기간은 필수 항목입니다.');
  }

  const { error } = await getSupabaseAdmin()
    .from('banners')
    .update({ ...data, image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating banner:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/banners');
}

export async function deleteBanner(id: string) {
  await requirePermission('banners.manage');

  const { error } = await getSupabaseAdmin().from('banners').delete().eq('id', id);

  if (error) {
    console.error('Error deleting banner:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/banners');
}

export async function toggleBannerActive(id: string, isActive: boolean) {
  await requirePermission('banners.manage');

  const { error } = await getSupabaseAdmin()
    .from('banners')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error toggling banner:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/banners');
}
