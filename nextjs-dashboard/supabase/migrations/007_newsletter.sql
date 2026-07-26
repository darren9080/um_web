-- 뉴스레터 구독자
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           BIGSERIAL PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  source       TEXT DEFAULT 'web',   -- web|event|import
  active       BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers (active);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- 서버(서비스 롤)에서만 접근. 공개 정책 없음 (이메일 목록 노출 방지)
