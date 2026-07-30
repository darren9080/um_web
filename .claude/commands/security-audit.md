# /security-audit — 보안 감사 에이전트

울산매일UTV 전 영역(인증, 결제, API, DB, 미들웨어)의 보안 취약점을 점검합니다.

## 점검 범위

### 1. 인증 및 세션 (next-auth v5)
- [ ] `auth.config.ts` — authorized 콜백에서 `/admin/*` 경로 보호 확인
- [ ] `middleware.ts` — matcher 패턴이 `/admin/:path*`, `/membership/checkout/:path*` 포함하는지
- [ ] JWT 토큰 만료 시간 적절한지 (기본 30일)
- [ ] 소셜 로그인 콜백 URL CSRF 보호 활성화 여부
- [ ] `AUTH_SECRET` 환경변수 32바이트 이상 랜덤 값인지

### 2. 결제 보안 (토스페이먼츠)
- [ ] 결제 금액 검증이 **반드시 서버**(`app/api/payments/`)에서 수행되는지
- [ ] 클라이언트에서 amount를 직접 받아 검증 없이 처리하는 코드 없는지
- [ ] `TOSS_SECRET_KEY`가 클라이언트 번들에 포함되지 않는지 (`NEXT_PUBLIC_` 접두사 없어야 함)
- [ ] 웹훅 수신 시 토스 서버 IP 또는 서명 검증하는지

### 3. API Route 보안
- [ ] 모든 `app/api/` Route Handler에서 인증 확인 (`auth()` 호출)
- [ ] 어드민 전용 API(`app/api/admin/`)는 role 확인 후 응답
- [ ] SQL 인젝션 방지 — Supabase 클라이언트 parameterized query 사용 확인
- [ ] 사용자 입력 직접 DB 쿼리 삽입하는 코드 없는지

### 4. 환경변수 / 시크릿
- [ ] `.env.local`이 `.gitignore`에 포함되는지
- [ ] `NEXT_PUBLIC_*` 변수에 시크릿 없는지
- [ ] Supabase `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 번들에 없는지
- [ ] 하드코딩된 API 키, 비밀번호 없는지 (grep으로 확인)

### 5. XSS / CSRF 방지
- [ ] `dangerouslySetInnerHTML` 사용 부분 확인 (기사 본문 렌더링 시 DOMPurify 적용 여부)
- [ ] 사용자 입력을 그대로 렌더링하는 댓글/폼 컴포넌트 검토
- [ ] Next.js 기본 CSRF 보호(Server Actions) 활용 여부

### 6. Supabase RLS (Row Level Security)
- [ ] 모든 테이블에 RLS 활성화 (`supabase/migrations/` 확인)
- [ ] 익명 사용자가 접근해서는 안 되는 데이터에 정책 적용됐는지
- [ ] `cms_profiles` 테이블 — 본인 데이터만 read/update 가능한지
- [ ] `audit_logs` 테이블 — 삽입만 허용, 수정/삭제 차단됐는지

### 7. 헤더 보안
- [ ] `next.config.ts`에 Content-Security-Policy 헤더 설정됐는지
- [ ] X-Frame-Options, X-Content-Type-Options 설정 확인
- [ ] Vercel 자동 적용 헤더와 중복 없는지

## 점검 커맨드
```bash
# 하드코딩된 시크릿 탐지
grep -r "sk_live\|secret_key\|private_key\|password" nextjs-dashboard/app --include="*.ts" --include="*.tsx" | grep -v ".env"

# NEXT_PUBLIC으로 노출된 위험 변수 확인
grep -r "NEXT_PUBLIC_TOSS_SECRET\|NEXT_PUBLIC_SUPABASE_SERVICE" nextjs-dashboard/

# dangerouslySetInnerHTML 사용 위치
grep -r "dangerouslySetInnerHTML" nextjs-dashboard/app --include="*.tsx"

# pnpm audit
cd nextjs-dashboard && pnpm audit
```

## 결과 보고 형식
```
## 보안 감사 보고서 — YYYY-MM-DD

### 심각도별 취약점
| 심각도 | 건수 | 항목 |
|--------|------|------|
| Critical | 0 | |
| High | 0 | |
| Medium | N | ... |
| Low | N | ... |

### 즉시 조치 필요
1. ...

### 권고 사항
1. ...

### 다음 감사 예정: YYYY-MM-DD
```

## 주의사항
- Critical/High 취약점은 발견 즉시 보고하고 핫픽스 브랜치 생성
- 결제 관련 취약점은 토스페이먼츠 기술지원에도 즉시 통보
- 개인정보 관련 취약점은 개인정보보호법 위반 여부 함께 검토
