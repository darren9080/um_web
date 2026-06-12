import type { CmsPermission, CmsRole } from './definitions';

export const roleLabels: Record<CmsRole, string> = {
  super_admin: '최고 관리자',
  publisher: '발행 책임자',
  desk_editor: '데스크',
  reporter: '기자',
  ad_manager: '광고 담당자',
  event_manager: '행사 담당자',
  analyst: '분석 담당자',
  viewer: '열람 전용',
};

export const permissionLabels: Record<CmsPermission, string> = {
  'articles.create': '기사 작성',
  'articles.update': '기사 수정',
  'articles.correct': '오탈자 수정',
  'articles.publish': '기사 발행',
  'articles.ai': 'AI 기사 보조',
  'banners.manage': '광고 배너 관리',
  'events.manage': '이벤트 관리',
  'homepage.manage': '메인 기사 배치',
  'desk.online': '온라인 데스크',
  'desk.print': '지면 데스크',
  'desk.video': '화상 데스크',
  'calendar.manage': '일정 관리',
  'analytics.view': '대시보드 조회',
  'roles.manage': '권한 관리',
  'audit.view': '감사 로그 조회',
};

export const rolePermissions: Record<CmsRole, CmsPermission[]> = {
  super_admin: Object.keys(permissionLabels) as CmsPermission[],
  publisher: [
    'articles.create',
    'articles.update',
    'articles.correct',
    'articles.publish',
    'articles.ai',
    'homepage.manage',
    'desk.online',
    'desk.print',
    'desk.video',
    'calendar.manage',
    'analytics.view',
    'audit.view',
  ],
  desk_editor: [
    'articles.create',
    'articles.update',
    'articles.correct',
    'articles.publish',
    'articles.ai',
    'homepage.manage',
    'desk.online',
    'desk.print',
    'desk.video',
    'calendar.manage',
    'analytics.view',
  ],
  reporter: [
    'articles.create',
    'articles.update',
    'articles.correct',
    'articles.ai',
    'calendar.manage',
  ],
  ad_manager: ['banners.manage', 'analytics.view'],
  event_manager: ['events.manage', 'calendar.manage'],
  analyst: ['analytics.view'],
  viewer: [],
};

export function can(role: CmsRole, permission: CmsPermission) {
  return rolePermissions[role].includes(permission);
}
