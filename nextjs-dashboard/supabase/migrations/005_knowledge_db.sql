-- 울산 지식 데이터베이스 스키마 (Phase 1)
-- 기존 스키마와 충돌 없도록 IF NOT EXISTS 사용

-- 주제(현안): 기사가 누적 편입되는 영구 페이지
CREATE TABLE IF NOT EXISTS topics (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  summary         TEXT,
  hero_dataset_id BIGINT,
  status          TEXT NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_topics_status ON topics (status);

-- 데이터셋: 데이터룸의 정량 데이터
CREATE TABLE IF NOT EXISTS datasets (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  domain          TEXT NOT NULL,  -- population|industry|realestate|traffic|environment|living
  source_name     TEXT NOT NULL,
  source_url      TEXT,
  method_note     TEXT,
  unit            TEXT,
  update_cycle    TEXT NOT NULL,  -- monthly|quarterly|yearly|daily
  reference_date  DATE,
  is_provisional  BOOLEAN NOT NULL DEFAULT false,
  last_ingested_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_datasets_domain ON datasets (domain);

-- 데이터 포인트 (시계열)
CREATE TABLE IF NOT EXISTS dataset_points (
  id          BIGSERIAL PRIMARY KEY,
  dataset_id  BIGINT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  period      DATE NOT NULL,
  dimensions  JSONB NOT NULL DEFAULT '{}',
  value       NUMERIC,
  is_provisional BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (dataset_id, period, dimensions)
);

CREATE INDEX IF NOT EXISTS idx_points_dataset_period ON dataset_points (dataset_id, period);
CREATE INDEX IF NOT EXISTS idx_points_dimensions ON dataset_points USING GIN (dimensions);

-- 인물/기관 (기자 포함)
CREATE TABLE IF NOT EXISTS persons (
  id         BIGSERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'journalist',  -- journalist|official|org|figure
  role       TEXT,
  bio        TEXT,
  expertise  TEXT[],
  email      TEXT,
  photo_url  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_persons_kind ON persons (kind);

-- 기사 확장 컬럼 (기존 synced_articles에 추가)
ALTER TABLE synced_articles ADD COLUMN IF NOT EXISTS author_id BIGINT REFERENCES persons(id);
ALTER TABLE synced_articles ADD COLUMN IF NOT EXISTS ai_usage_note TEXT;

-- 정정 이력 (공개)
CREATE TABLE IF NOT EXISTS corrections (
  id           BIGSERIAL PRIMARY KEY,
  article_slug TEXT NOT NULL,
  reason       TEXT NOT NULL,
  corrected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corrections_slug ON corrections (article_slug);

-- 기사 ↔ 주제 다대다
CREATE TABLE IF NOT EXISTS article_topics (
  article_slug TEXT NOT NULL,
  topic_id     BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  PRIMARY KEY (article_slug, topic_id)
);

-- 기사 ↔ 데이터셋 다대다 (기사가 인용한 데이터)
CREATE TABLE IF NOT EXISTS article_datasets (
  article_slug TEXT NOT NULL,
  dataset_id   BIGINT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  PRIMARY KEY (article_slug, dataset_id)
);

-- 주제 ↔ 데이터셋 다대다
CREATE TABLE IF NOT EXISTS topic_datasets (
  topic_id   BIGINT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  dataset_id BIGINT NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
  PRIMARY KEY (topic_id, dataset_id)
);

-- RLS 정책 (공개 읽기)
ALTER TABLE topics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topics_select"     ON topics     FOR SELECT USING (true);
CREATE POLICY "datasets_select"   ON datasets   FOR SELECT USING (true);
CREATE POLICY "points_select"     ON dataset_points FOR SELECT USING (true);
CREATE POLICY "persons_select"    ON persons    FOR SELECT USING (true);
CREATE POLICY "corrections_select" ON corrections FOR SELECT USING (true);
