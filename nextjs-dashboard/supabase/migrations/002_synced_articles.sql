-- NSP/ND소프트 통합CMS에서 RSS로 동기화된 기사 미러 테이블
create table if not exists synced_articles (
  idxno           integer primary key,         -- NSP 원본 기사 ID (articleView.html?idxno=...)
  title           text not null,
  excerpt         text not null default '',    -- RSS description (요약)
  body_html       text not null default '',    -- 전체 본문 HTML (추후 크롤링 또는 FTP)
  category        text not null default 'society',
  author          text not null default '',    -- 기자명 (e.g. '이미나')
  thumbnail_url   text,
  source_url      text,                        -- 원본 기사 URL
  tags            text[] not null default '{}',
  published_at    timestamptz,
  cms_updated_at  timestamptz,                 -- CMS 마지막 수정 시각
  synced_at       timestamptz not null default now()
);

-- 최신 기사 조회 인덱스
create index if not exists synced_articles_published_at_idx
  on synced_articles (published_at desc);

-- 카테고리 필터 인덱스
create index if not exists synced_articles_category_idx
  on synced_articles (category);

-- 크론 동기화 로그
create table if not exists rss_sync_logs (
  id           uuid primary key default gen_random_uuid(),
  feed_url     text not null,
  total        integer not null default 0,
  upserted     integer not null default 0,
  errors       integer not null default 0,
  error_detail text,
  duration_ms  integer,
  synced_at    timestamptz not null default now()
);
