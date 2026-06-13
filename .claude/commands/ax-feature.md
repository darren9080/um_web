# /ax-feature — AI 기능 개발 에이전트 (AX 전환)

울산매일UTV의 AI 기능 개발 및 CMS AI 연동을 담당합니다.
뉴스룸 AI 워크플로우(보도자료 → 초안 → 검수 → 발행) 구현에 집중합니다.

## 현재 AI 인프라

```
app/lib/cms/ai.ts
├── cosineSimilarity()        — 보도자료-기사 유사도 계산
├── buildPressReleaseDraftPrompt() — Claude/OpenAI 초안 생성 프롬프트
├── buildSeoPrompt()          — SEO 메타데이터 추천 프롬프트
├── createEmbedding()         — OpenAI text-embedding-ada-002
└── measurePressReleaseSimilarity() — 유사도 파이프라인

supabase/migrations/001_newsroom_cms.sql
└── pgvector extension (vector(1536)) — 임베딩 저장
```

## 구현 가능한 AI 기능

### 1. 보도자료 → 기사 초안 생성
```typescript
// app/api/ai/draft/route.ts
POST /api/ai/draft
Body: { pressReleaseId: string, style: 'straight' | 'feature' | 'editorial' }
Response: { draft: string, similarity: number, seoSuggestions: SeoMetadata }
```
- 기자 윤리강령 준수 시스템 프롬프트 포함
- 유사도 70% 이상 시 추가 취재 권고 플래그 반환

### 2. 기사 SEO 자동 최적화
```typescript
// app/api/ai/seo/route.ts
POST /api/ai/seo
Body: { title: string, body: string, category: string }
Response: { metaTitle: string, metaDescription: string, keywords: string[], slug: string }
```

### 3. 기사 유사도 검색 (pgvector)
```typescript
// app/api/search/semantic/route.ts
POST /api/search/semantic
Body: { query: string, limit?: number }
// 벡터 임베딩 생성 → Supabase pgvector HNSW 인덱스 검색
```

### 4. 자동 카테고리 분류
```typescript
POST /api/ai/classify
Body: { title: string, body: string }
Response: { category: '사회' | '문화' | '스포츠' | '인문학' | '스타트업', confidence: number }
```

### 5. 댓글 자동 모더레이션
```typescript
POST /api/ai/moderate
Body: { comment: string, articleId: string }
Response: { approved: boolean, reason?: string, severity?: 'spam' | 'hate' | 'misinformation' }
```

## Claude API 연동 패턴

```typescript
// 모델: claude-sonnet-4-6 (기본), claude-opus-4-8 (고품질)
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: JOURNALISM_SYSTEM_PROMPT, // 언론 윤리 + 울산매일 스타일 가이드
  messages: [{ role: 'user', content: userPrompt }],
});
```

## 시스템 프롬프트 기준 (JOURNALISM_SYSTEM_PROMPT)
- 울산매일UTV AI 활용 가이드라인(`/ai-guidelines`) 준수
- 사실 확인 없이 단정적 표현 금지
- 출처 불명확한 내용 생성 금지
- 생성 결과에 AI 사용 표시 메타데이터 포함

## 환경변수 추가 필요
```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...          # 임베딩 전용 (ada-002)
```

## 구현 우선순위
1. **보도자료 초안 생성** — 가장 높은 편집 생산성 향상
2. **SEO 자동화** — 트래픽 증가 효과 즉시 측정 가능
3. **유사도 검색** — 독자 retention 향상
4. **카테고리 분류** — CMS 편집 워크플로우 자동화
5. **댓글 모더레이션** — 커뮤니티 활성화 후 도입

## 주의사항
- AI 생성 콘텐츠는 반드시 기자 검토 단계(`desk_review`) 포함
- AI 도구 사용 여부 `articles.ai_assisted` 컬럼에 기록
- 개인정보 포함 자료를 외부 AI API에 전송하지 않음 (AI 가이드라인 제5조)
