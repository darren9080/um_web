-- 울산매일마라톤 통합 스키마 (Phase: 마라톤 서브도메인)
-- 기존 ulsanmaeilmara.com 데이터 이관:
--   회원 → 소셜 재가입 유도, 미인증 인원은 기록만 이관(하이브리드)
--   기록 → race_records (데이터룸 철학 계승: 검색·인용 가능)
--   과거 행사 → marathon_races
--   커뮤니티 → community_posts

-- 대회 (회차별)
CREATE TABLE IF NOT EXISTS marathon_races (
  year         INT PRIMARY KEY,
  edition      INT NOT NULL,
  title        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'upcoming',  -- upcoming|open|closed|ended
  race_date    DATE NOT NULL,
  reg_open     DATE,
  reg_deadline DATE,
  location     TEXT NOT NULL,
  start_point  TEXT,
  organizer    TEXT NOT NULL DEFAULT '울산매일신문사',
  hero_image   TEXT,
  description  TEXT,
  courses      JSONB NOT NULL DEFAULT '[]',  -- [{type,price,limit,registered}]
  finishers    INT,
  weather      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 기록실 (완주 기록)
CREATE TABLE IF NOT EXISTS race_records (
  id           BIGSERIAL PRIMARY KEY,
  year         INT NOT NULL REFERENCES marathon_races(year) ON DELETE CASCADE,
  bib          TEXT NOT NULL,               -- 배번
  name         TEXT NOT NULL,
  gender       TEXT,                        -- M|F
  age_group    TEXT,
  course       TEXT NOT NULL,               -- full|half|10km|5km
  record_time  INTERVAL,                    -- 완주 기록
  overall_rank INT,
  course_rank  INT,
  -- 이관 회원 매칭 (하이브리드): 소셜 재가입 시 user_id 연결, 미인증은 NULL
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  migrated     BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, bib)
);

CREATE INDEX IF NOT EXISTS idx_records_year   ON race_records (year);
CREATE INDEX IF NOT EXISTS idx_records_name   ON race_records (name);
CREATE INDEX IF NOT EXISTS idx_records_bib    ON race_records (bib);
CREATE INDEX IF NOT EXISTS idx_records_course ON race_records (year, course, overall_rank);
CREATE INDEX IF NOT EXISTS idx_records_user   ON race_records (user_id);

-- 참가 신청 (언론사 결제 시스템 공유 — event_registrations 패턴 재사용)
CREATE TABLE IF NOT EXISTS marathon_registrations (
  id             BIGSERIAL PRIMARY KEY,
  year           INT NOT NULL REFERENCES marathon_races(year) ON DELETE CASCADE,
  course         TEXT NOT NULL,
  user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  gender         TEXT,
  birth_date     DATE,
  phone          TEXT NOT NULL,
  email          TEXT NOT NULL,
  shirt_size     TEXT,                       -- 기념 티셔츠 사이즈
  emergency_contact TEXT,
  total_amount   INT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',  -- pending|paid|cancelled
  payment_key    TEXT,
  order_id       TEXT UNIQUE,
  bib            TEXT,                        -- 배정 배번 (결제 후)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mreg_year ON marathon_registrations (year);
CREATE INDEX IF NOT EXISTS idx_mreg_user ON marathon_registrations (user_id);

-- 커뮤니티 게시글
CREATE TABLE IF NOT EXISTS community_posts (
  id           BIGSERIAL PRIMARY KEY,
  category     TEXT NOT NULL,               -- review|group|qna|free
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  content      TEXT NOT NULL,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name  TEXT NOT NULL,               -- 이관 글은 원 작성자명 보존
  author_image TEXT,
  views        INT NOT NULL DEFAULT 0,
  likes        INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  is_deleted   BOOLEAN NOT NULL DEFAULT false,
  migrated     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts (category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user     ON community_posts (user_id);

-- 커뮤니티 댓글 (기존 article_comments 패턴 재사용)
CREATE TABLE IF NOT EXISTS community_comments (
  id          BIGSERIAL PRIMARY KEY,
  post_id     BIGINT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  parent_id   BIGINT REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name   TEXT NOT NULL,
  user_image  TEXT,
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ccomments_post ON community_comments (post_id, created_at);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE marathon_races        ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_records          ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments    ENABLE ROW LEVEL SECURITY;

-- 대회·기록은 공개 읽기
CREATE POLICY "races_select"   ON marathon_races FOR SELECT USING (true);
CREATE POLICY "records_select" ON race_records   FOR SELECT USING (true);

-- 커뮤니티: 공개 읽기(삭제글 제외는 앱단 처리), 로그인 작성, 본인만 수정
CREATE POLICY "posts_select" ON community_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update" ON community_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ccomments_select" ON community_comments FOR SELECT USING (true);
CREATE POLICY "ccomments_insert" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ccomments_update" ON community_comments FOR UPDATE USING (auth.uid() = user_id);
