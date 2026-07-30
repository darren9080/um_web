-- 배너 이미지 업로드를 위한 Supabase Storage 버킷.
-- 이 프로젝트에 파일 업로드 전례가 전혀 없었다 — 지금까지 모든 이미지는
-- 외부 URL 문자열(Unsplash 등)뿐이었다. 여기서 만드는 버킷/정책 패턴이
-- 이후 다른 이미지 업로드(기사 히어로 이미지 등)의 기준이 된다.

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- 공개 읽기: 배너는 공개 웹사이트에 노출되므로 누구나 볼 수 있어야 한다.
drop policy if exists "banners public read" on storage.objects;
create policy "banners public read"
  on storage.objects for select
  using (bucket_id = 'banners');

-- 쓰기(insert/update/delete)는 이 앱이 항상 service-role 키(getSupabaseAdmin())로만
-- 접근하므로 RLS를 우회한다. anon/authenticated 키를 통한 직접 쓰기를 막기 위해
-- 별도 write 정책은 만들지 않는다 — 정책이 없으면 기본적으로 거부된다.
