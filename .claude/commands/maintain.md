# /maintain — 유지보수 에이전트

울산매일UTV 웹 서비스의 의존성 업데이트, 보안 패치, 빌드 검증을 수행합니다.

## 실행 절차

### 1. 현재 상태 점검
```bash
cd nextjs-dashboard
pnpm outdated          # 업데이트 가능한 패키지 목록
pnpm audit             # 보안 취약점 스캔
git status             # 미커밋 변경사항 확인
```

### 2. 의존성 업데이트
- **패치/마이너 업데이트** (안전): `pnpm update` 실행 후 빌드 확인
- **메이저 업데이트** (주의): 변경 로그 확인 후 개별 적용
- **next-auth v5 beta**: 항상 changelog 확인 (breaking changes 잦음)
- **Next.js**: 15.x 내 마이너는 자동, 16.x 이상은 수동 검토

### 3. 빌드 검증
```bash
pnpm build             # TypeScript 컴파일 + 번들 생성
# 빌드 성공 후 커밋 진행
```

### 4. 체크리스트

**의존성**
- [ ] `pnpm outdated` 결과 검토
- [ ] `pnpm audit` 취약점 0건 확인
- [ ] next-auth, Next.js, Supabase 클라이언트 최신 안정 버전 확인
- [ ] 토스페이먼츠 SDK 업데이트 확인

**코드 품질**
- [ ] TypeScript 에러 0건 (`pnpm build` 통과)
- [ ] 미사용 import, 변수 제거
- [ ] `app/(main)/` 페이지별 metadata 누락 없는지 확인
- [ ] Server Component / Client Component 경계 적절한지 확인

**환경 설정**
- [ ] `.env.example` 과 실제 Vercel 환경변수 동기화 확인
- [ ] `next.config.ts` 이미지 도메인 whitelist 최신화

**데이터베이스**
- [ ] Supabase RLS 정책 검토 (신규 테이블 있으면)
- [ ] `supabase/migrations/` 미적용 마이그레이션 확인

### 5. 결과 보고 형식
```
## 유지보수 보고서 — YYYY-MM-DD

### 업데이트된 패키지
| 패키지 | 이전 버전 | 새 버전 | 비고 |
|--------|-----------|---------|------|

### 보안 취약점
- 발견: N건 / 해결: N건 / 잔여: N건

### 빌드 상태
- ✅ 성공 / ❌ 실패 (원인: ...)

### 다음 점검 예정
- 날짜: ...
- 주요 항목: ...
```

## 주의사항
- `pnpm audit --fix`는 lockfile을 변경하므로 반드시 빌드 검증 후 커밋
- Vercel 프리뷰 배포로 실제 동작 확인 후 main 머지
- 결제(토스페이먼츠) 관련 패키지 업데이트 시 sandbox 환경에서 테스트 필수
