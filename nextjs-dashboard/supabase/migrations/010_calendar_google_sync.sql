-- Google Calendar 양방향 동기화를 위해 google_event_id에 유니크 제약을 건다.
-- Postgres의 UNIQUE 제약은 NULL을 서로 다른 값으로 취급해 여러 개의 NULL을
-- 허용하므로(Google 연동 없이 수동으로만 만든 일정은 google_event_id가
-- null이다), 부분 인덱스 없이 일반 UNIQUE로 충분하다 — Supabase JS의
-- .upsert(data, { onConflict: 'google_event_id' })가 이 제약을 그대로
-- 충돌 대상으로 사용할 수 있다.

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'editorial_calendar_items_google_event_id_key'
  ) then
    alter table editorial_calendar_items
      add constraint editorial_calendar_items_google_event_id_key unique (google_event_id);
  end if;
end $$;
