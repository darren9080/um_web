# 울산매일UTV — 프로젝트 컨텍스트

## 서비스 개요
울산 지역 1위 미디어 플랫폼. 1992년 창간 조간신문 울산매일 + 영상미디어 UTV 통합.
- **사이트**: https://um.co.kr (예정) / 현재 Vercel 프리뷰
- **운영사**: (주)울산매일신문사 · 052-243-1001

## 기술 스택
```
Next.js 15.5+ (App Router, Server Components)
React 19 · TypeScript · Tailwind CSS v3
next-auth v5 beta (구글/네이버/카카오 OAuth)
토스페이먼츠 SDK v2
Supabase (PostgreSQL + pgvector)
Vercel 배포 (모노레포: rootDirectory = nextjs-dashboard)
pnpm 10.33.0
```

## 디렉토리 구조
```
um_web/
├── design-system/tokens.json   ← 전 채널 디자인 토큰 (웹·인쇄·소셜·차량래핑)
├── nextjs-dashboard/           ← Next.js 앱 루트 (Vercel rootDirectory)
│   ├── app/
│   │   ├── (main)/            ← 사용자 대면 페이지 (Header+Footer 포함)
│   │   ├── admin/             ← 뉴스룸 CMS 어드민 (/admin/*)
│   │   ├── api/               ← Route Handlers (auth, payments)
│   │   ├── lib/
│   │   │   ├── cms/           ← CMS 타입·권한·AI 유틸리티·샘플데이터
│   │   │   ├── definitions.ts ← 공통 TypeScript 타입
│   │   │   ├── placeholder-data.ts
│   │   │   └── utils.ts
│   │   └── ui/
│   │       ├── iusm/          ← 사용자 UI 컴포넌트 (Header, Footer, Logo 등)
│   │       └── admin/         ← 어드민 UI 컴포넌트
│   ├── supabase/migrations/   ← DB 스키마 (pgvector, RLS, audit log)
│   ├── auth.ts / auth.config.ts / middleware.ts
│   ├── tailwind.config.ts     ← 브랜드 컬러: #231F20(차콜) / #C41230(레드)
│   └── .env.example           ← 필요한 환경변수 목록
```

## 자주 쓰는 커맨드
```bash
cd nextjs-dashboard
pnpm dev          # 개발 서버 (Turbopack)
NODE_ENV=production pnpm build   # 프로덕션 빌드 (배포 전 항상 실행, NODE_ENV 명시 필수)
pnpm install      # 패키지 설치
```

## 브랜드 컬러
- 브랜드 차콜: `#231F20` (Tailwind: `brand-charcoal`, `primary`)
- 브랜드 레드: `#C41230` (Tailwind: `brand-red`, `accent`)

## 환경변수 (Vercel 설정 필요)
`.env.example` 참고. 필수: AUTH_SECRET, AUTH_GOOGLE_ID/SECRET,
NAVER_CLIENT_ID/SECRET, KAKAO_CLIENT_ID/SECRET,
NEXT_PUBLIC_TOSS_CLIENT_KEY, TOSS_SECRET_KEY,
NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

## 배포
- 브랜치: `claude/iusm-website-redesign-xt9zg9` → Vercel PR 프리뷰 자동 배포
- 메인 배포: PR 머지 후 `main` 브랜치 → 프로덕션

## 개발 원칙
- Server Component 우선, Client Component는 `'use client'` 명시적 사용
- Next.js 15: `params`, `searchParams`는 `Promise<>` 타입 — `await`로 언래핑
- 결제 금액 검증은 반드시 서버에서 수행
- `/admin/*` 경로는 middleware로 로그인 보호됨
- 커밋 후 반드시 `NODE_ENV=production pnpm build` 통과 확인 (NODE_ENV=development로 실행하면 404 prerender 에러 발생)

## 관련 에이전트 커맨드
| 커맨드 | 역할 |
|--------|------|
| `/maintain` | 의존성·보안 점검·빌드 검증 |
| `/security-audit` | 보안 취약점 전수 검토 |
| `/dx-improve` | 코드 품질·성능·DX 개선 |
| `/ax-feature` | AI 기능 개발·CMS AI 연동 |
| `/draft-article` | 보도자료 → 기사 초안 생성 |
| `/review-article` | 기사 교열·팩트체크·SEO |
| `/review-pr` | PR 코드 리뷰 |
