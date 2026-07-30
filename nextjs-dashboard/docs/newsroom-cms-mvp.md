# Newsroom CMS MVP

## 1차 개발 범위

- 관리자 로그인과 역할 기반 권한 관리
- 기사 작성, 수정, 오탈자 교정, 초안/교열/데스크/예약/발행 상태 관리
- 보도자료 업로드 후 AI 초안 생성
- 보도자료와 기사 본문 cosine similarity 측정
- 사진 업로드, alt text, caption, credit, copyright 메타 관리
- SEO title, meta description, keyword, canonical URL 추천
- 광고 배너 위치, 링크, 노출 기간, 활성 상태 관리
- 이벤트 등록, 공개 여부, Google Calendar 동기화 준비
- 메인페이지 기사 순서와 위치 관리
- 온라인, 지면, 화상 데스크 대기열
- 조회수, 좋아요, 열독률, 기자 인지도 대시보드

## 권한 설계

- `super_admin`: 모든 기능
- `publisher`: 발행, 데스크, 배치, 일정, 분석
- `desk_editor`: 기사 검토, 발행, 메인 배치, 데스크
- `reporter`: 기사 작성, 수정, 오탈자 수정, AI 보조
- `ad_manager`: 광고 배너와 관련 분석
- `event_manager`: 이벤트와 일정
- `analyst`: 분석 조회
- `viewer`: 읽기 전용

## AI 기능

- 초안 생성은 보도자료 원문을 저장한 뒤 서버에서 OpenAI Responses API를 호출합니다.
- 유사도 측정은 보도자료와 기사 본문 embedding을 각각 만들고 cosine similarity를 계산합니다.
- similarity가 높은 기사에는 "원문 의존도 높음" 경고를 표시합니다.
- 이미지 생성 기능은 실제 취재 사진과 명확히 구분하고 "AI 생성 이미지" 표시를 저장합니다.

## 운영 best practice

- 모든 콘텐츠 테이블은 RLS를 켭니다.
- 삭제는 기본적으로 soft delete 또는 archive로 처리합니다.
- 발행 전 `NewsArticle` 구조화 데이터 필수 필드를 검증합니다.
- 메인 배치 변경, 발행, 권한 변경은 audit log에 남깁니다.
- 지면/화상 데스크는 기존 편집 시스템 연동 범위를 확인한 뒤 2차로 붙입니다.
