# /review-pr — PR 코드 리뷰 에이전트

Pull Request 코드를 검토하고 울산매일UTV 개발 표준에 맞는 피드백을 제공합니다.

## 사용법

```
/review-pr
```

PR URL 또는 브랜치명을 제공하면 자동으로 diff를 분석합니다.

## 리뷰 체크리스트

### 1. 보안 (최우선)
- [ ] 결제 금액 검증이 서버에서만 수행되는지
- [ ] 새로운 API Route에 인증(`auth()`) 확인이 있는지
- [ ] `NEXT_PUBLIC_` 변수에 시크릿 없는지
- [ ] 사용자 입력이 SQL/XSS 인젝션 없이 처리되는지
- [ ] `dangerouslySetInnerHTML` 사용 시 DOMPurify 적용됐는지

### 2. Next.js 15 패턴 준수
- [ ] `params`, `searchParams`를 `await`로 언래핑하는지
  ```typescript
  // ✅ Next.js 15
  const { id } = await params;
  // ❌ 구버전 패턴
  const { id } = params;
  ```
- [ ] Server Component에 불필요한 `'use client'` 없는지
- [ ] 데이터 패칭이 적절한 캐싱 전략 사용하는지 (`cache`, `revalidate`)
- [ ] `next/image` 사용 (raw `<img>` 지양)

### 3. 타입 안전성
- [ ] `any` 타입 사용 최소화
- [ ] 새로운 타입은 `app/lib/definitions.ts`에 추가됐는지
- [ ] API 응답 타입 정의됐는지

### 4. 브랜드 일관성 (UI 변경 시)
- [ ] 브랜드 차콜 `#231F20` — `bg-brand-charcoal`, `text-brand-charcoal`
- [ ] 브랜드 레드 `#C41230` — `bg-accent`, `text-accent`, `bg-brand-red`
- [ ] 하드코딩된 색상 값 없는지 (Tailwind 토큰 사용)
- [ ] `Logo` 컴포넌트 사용 (인라인 텍스트 로고 지양)

### 5. 성능
- [ ] 불필요한 `useEffect` 없는지 (Server Component로 대체 가능한 경우)
- [ ] 무거운 클라이언트 라이브러리에 `dynamic()` 적용됐는지
- [ ] 이미지에 `width`, `height` 또는 `fill` 속성 있는지
- [ ] 데이터 패칭 폭포수(waterfall) 없는지 (병렬 fetch 사용)

### 6. 코드 품질
- [ ] 함수/변수명이 의미를 명확히 전달하는지
- [ ] 불필요한 주석 없는지 (WHY만 주석으로)
- [ ] 중복 코드 3회 이상 → 컴포넌트/함수 추출 제안
- [ ] console.log 제거됐는지

### 7. 데이터베이스 (Supabase)
- [ ] 새 테이블/컬럼에 RLS 정책 적용됐는지
- [ ] `supabase/migrations/` 마이그레이션 파일 포함됐는지
- [ ] N+1 쿼리 없는지

### 8. 빌드 검증
- [ ] `pnpm build` 통과 여부 확인 요청
- [ ] TypeScript 에러 0건

## 리뷰 우선순위

| 심각도 | 항목 | 처리 |
|--------|------|------|
| 🔴 Blocker | 보안 취약점, 결제 오류, 인증 우회 | 반드시 수정 후 머지 |
| 🟡 Major | 타입 에러, Next.js 패턴 위반, 성능 저하 | 수정 권고 |
| 🟢 Minor | 코드 스타일, 변수명, 주석 | 선택적 수정 |
| 💡 Nit | 개선 제안 (선택) | 무시 가능 |

## 출력 형식

```
## PR 코드 리뷰 — [PR 제목]

### 🔴 Blocker (머지 전 필수 수정)
- [파일명:라인] 문제: ... / 수정 제안: ...

### 🟡 Major (강력 권고)
- [파일명:라인] 문제: ... / 수정 제안: ...

### 🟢 Minor / 💡 Nit
- [파일명:라인] 제안: ...

### ✅ 잘 작성된 부분
- ...

### 종합 의견
- 승인: ✅ / 수정 후 승인: ⚠️ / 변경 요청: ❌
```

## 주의사항
- 개인 코딩 스타일보다 프로젝트 일관성 우선
- Blocker가 없으면 작성자 판단을 존중
- 대규모 리팩토링 제안은 별도 이슈로 등록 권고
