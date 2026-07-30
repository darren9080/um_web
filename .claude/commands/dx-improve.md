# /dx-improve — 개발자 경험(DX) 개선 에이전트

코드 품질, 성능, 타입 안전성, 컴포넌트 구조를 개선합니다.

## 점검 항목

### 1. TypeScript 품질
- [ ] `pnpm build` — TypeScript 에러 0건
- [ ] `any` 타입 사용 최소화 — `app/lib/definitions.ts`에 타입 정의 추가
- [ ] Next.js 15 패턴 준수: `params`, `searchParams`는 `Promise<>` 타입으로 `await` 언래핑
  ```typescript
  // ✅ 올바른 방식
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
  }
  ```
- [ ] Server Component에서 불필요한 `'use client'` 지시문 제거

### 2. 성능 최적화
- [ ] `next/image` 사용 — `<img>` 태그 직접 사용 코드 없는지
- [ ] 동적 import (`dynamic()`) — 무거운 클라이언트 컴포넌트에 적용됐는지
- [ ] ISR / 캐싱 전략: 기사 페이지 `revalidate` 설정 확인
- [ ] `loading.tsx` — 각 라우트 세그먼트에 스켈레톤 UI 있는지
- [ ] `Suspense` 경계 — 데이터 패칭 컴포넌트에 적용됐는지

### 3. 컴포넌트 구조
- [ ] `app/ui/iusm/` — 재사용 컴포넌트 일관성 검토
- [ ] 중복 코드 제거 — 동일 UI 패턴이 3곳 이상이면 컴포넌트 추출
- [ ] props 과다 전달 (prop drilling) — Context 또는 컴포넌트 합성으로 개선
- [ ] 큰 컴포넌트 파일 (300줄 이상) 분리 검토

### 4. 접근성 (A11y)
- [ ] 모든 `<img>`에 의미 있는 `alt` 텍스트
- [ ] 폼 요소에 `<label>` 연결 (htmlFor + id 쌍)
- [ ] 키보드 네비게이션 가능한지 (Tab, Enter, Escape 동작)
- [ ] `aria-label`, `role` 속성 적절히 적용됐는지
- [ ] 색상 대비 최소 4.5:1 (WCAG AA) — brand-charcoal #231F20 배경에 흰 텍스트 ✅

### 5. 코드 정리
- [ ] 미사용 import, 변수, 함수 제거
- [ ] console.log 프로덕션 코드에 없는지
- [ ] TODO/FIXME 주석 처리 현황 파악
- [ ] 주석은 WHY를 설명하는 것만 유지 (WHAT 설명은 제거)

### 6. 폴더 구조 일관성
```
app/
├── (main)/          ← 사용자 페이지
│   ├── page.tsx     ← 홈
│   ├── loading.tsx  ← 스켈레톤
│   ├── error.tsx    ← 에러 바운더리
│   └── not-found.tsx
├── admin/           ← CMS 어드민
├── api/             ← Route Handlers
└── ui/
    ├── iusm/        ← 사용자 UI 컴포넌트
    └── admin/       ← 어드민 UI 컴포넌트
```

### 7. SEO / 메타데이터
- [ ] 모든 `(main)` 하위 페이지에 `export const metadata: Metadata` 정의
- [ ] OG 이미지 (`opengraph-image.tsx`) 생성됐는지
- [ ] 동적 라우트(`/news/[slug]`)에 `generateMetadata()` 구현됐는지

## 자주 하는 개선 패턴

### 기사 카드 컴포넌트 성능
```typescript
// Suspense로 데이터 패칭 분리
<Suspense fallback={<ArticleCardSkeleton />}>
  <ArticleCardList category={category} />
</Suspense>
```

### 서버 컴포넌트에서 데이터 패칭
```typescript
// ✅ Server Component — fetch 직접 사용
async function ArticleList() {
  const articles = await getArticles(); // DB 직접 쿼리
  return <ul>{articles.map(a => <li key={a.id}>{a.title}</li>)}</ul>;
}
```

## 결과 보고 형식
```
## DX 개선 보고서 — YYYY-MM-DD

### 적용된 개선사항
1. ...

### 성능 지표 변화
- Lighthouse Performance: 이전 → 이후
- 번들 크기: 이전 → 이후

### 권고 사항 (미적용)
1. ...
```
