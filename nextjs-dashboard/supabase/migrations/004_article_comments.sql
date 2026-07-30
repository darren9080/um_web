-- 기사 댓글 테이블
create table if not exists article_comments (
  id          uuid primary key default gen_random_uuid(),
  article_slug text not null,
  parent_id   uuid references article_comments(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  user_name   text not null,
  user_image  text,
  content     text not null check (char_length(content) between 1 and 1000),
  is_deleted  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists article_comments_slug_idx     on article_comments (article_slug, created_at desc);
create index if not exists article_comments_parent_idx   on article_comments (parent_id);
create index if not exists article_comments_user_idx     on article_comments (user_id);

-- RLS 정책
alter table article_comments enable row level security;

-- 모든 사람이 읽기 가능 (삭제된 댓글도 구조는 노출, content만 치환)
create policy "comments_select" on article_comments
  for select using (true);

-- 로그인한 사용자만 작성
create policy "comments_insert" on article_comments
  for insert with check (auth.uid() = user_id);

-- 본인 댓글만 수정/삭제
create policy "comments_update" on article_comments
  for update using (auth.uid() = user_id);
