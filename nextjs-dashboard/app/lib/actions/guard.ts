import { auth } from '@/auth';
import { can } from '@/app/lib/cms/permissions';
import type { CmsPermission, CmsRole } from '@/app/lib/cms/definitions';

// 서버 액션 진입점에서 호출하는 권한 가드. 미들웨어는 서브도메인 단위로만
// 로그인/역할군을 걸러내고, 실제 기능별 세부 권한(CmsPermission)은 지금까지
// 어떤 서버 액션도 검사하지 않았다 — 이 함수를 각 액션 맨 앞에서 호출해
// 그 공백을 메운다.
export async function requirePermission(permission: CmsPermission) {
  const session = await auth();
  const role = (session?.user?.cmsRole ?? 'viewer') as CmsRole;

  if (!can(role, permission)) {
    throw new Error('권한이 없습니다.');
  }

  // cms_profiles의 정체성 키는 email이다 (Phase 0: cms_profiles 마이그레이션 참고).
  return { role, userEmail: session?.user?.email ?? undefined };
}
