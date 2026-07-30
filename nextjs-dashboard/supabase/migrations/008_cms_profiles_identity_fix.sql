-- cms_profiles는 애초에 Supabase Auth(auth.users) 사용자를 전제로 설계됐으나,
-- 이 앱은 로그인을 전적으로 NextAuth(Google/Naver/Kakao)로 처리하고 Supabase Auth는
-- 전혀 쓰지 않는다. auth.ts의 jwt() 콜백은 로그인마다
--   cms_profiles.upsert({ email, display_name, role }, { onConflict: 'email' })
-- 를 호출하는데, 원래 스키마에는 email 컬럼도 유니크 제약도 없어 이 upsert가
-- 실패한다(컬럼 없음 + onConflict 대상 제약 없음). 또한 id가 auth.users(id)를
-- 참조하는 FK도 NextAuth 환경에서는 대응되는 auth.users 행이 없으므로 성립하지 않는다.
--
-- 이 마이그레이션은 cms_profiles를 Supabase Auth 의존에서 분리하고,
-- email을 정체성 키로 삼아 auth.ts가 실제로 하는 upsert가 성공하도록 스키마를 맞춘다.
--
-- 참고: RLS의 current_cms_role() 함수는 auth.uid()를 참조하지만, 이 값은 NextAuth
-- 환경에서 항상 null이라 사실상 죽은 코드다. 이 앱은 이미 전 구간에서
-- getSupabaseAdmin()(service-role key, RLS 우회)만으로 DB에 접근하므로, 여기서는
-- RLS 정책을 손대지 않는다 — 권한 검사는 서버 액션 레벨(app/lib/actions/guard.ts의
-- requirePermission())에서 명시적으로 수행한다.
--
-- 실행 전 확인: 이 마이그레이션은 운영 Supabase 프로젝트의 실제 스키마가
-- 리포의 마이그레이션 파일과 다를 가능성(스키마 드리프트)을 고려해 전부
-- IF EXISTS / IF NOT EXISTS로 작성했다 — 이미 email 컬럼이 있다면 해당 구문은
-- 아무 일도 하지 않고 넘어간다.

do $$
declare
  fk_name text;
begin
  -- cms_profiles.id -> auth.users(id) FK를 이름에 의존하지 않고 찾아서 제거
  select tc.constraint_name into fk_name
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
   and tc.table_schema = kcu.table_schema
  where tc.table_name = 'cms_profiles'
    and tc.constraint_type = 'FOREIGN KEY'
    and kcu.column_name = 'id'
    and tc.table_schema = 'public';

  if fk_name is not null then
    execute format('alter table public.cms_profiles drop constraint %I', fk_name);
  end if;
end $$;

alter table cms_profiles alter column id set default gen_random_uuid();

alter table cms_profiles add column if not exists email text;

-- Supabase JS의 .upsert(data, { onConflict: 'email' })는 email에 대한
-- (부분이 아닌) 완전한 유니크 제약/인덱스가 있어야 충돌 대상으로 인식한다.
-- id가 auth.users(id) FK였던 원래 스키마에서는 이 앱(NextAuth만 사용, Supabase
-- Auth 미사용)이 cms_profiles에 정상적으로 행을 쓴 적이 애초에 없었을 것이므로
-- (매 upsert가 email 컬럼 부재로 실패), 기존 행의 email 충돌을 걱정할 필요가
-- 없다고 보고 NOT NULL + 완전 유니크로 건다. 만약 실제 운영 테이블에 이미
-- email이 null인 행이 남아있다면, 이 마이그레이션 실행 전에 수동으로
-- 정리(삭제 또는 email 채우기)해야 한다.
alter table cms_profiles alter column email set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cms_profiles_email_key'
  ) then
    alter table cms_profiles add constraint cms_profiles_email_key unique (email);
  end if;
end $$;
