'use client';

import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  NewspaperIcon,
  PhotoIcon,
  RectangleGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/app/ui/iusm/logo';
import { roleLabels, rolePermissions } from '@/app/lib/cms/permissions';
import type { CmsRole, CmsPermission } from '@/app/lib/cms/definitions';

type SidebarLink = {
  name: string;
  href: string;           // 사용자에게 보이는 URL 경로
  matchPath: string;      // usePathname() 비교용 내부 경로
  icon: React.ElementType;
  permission?: CmsPermission;
};

// cms.iusm.co.kr — 뉴스룸 편집 메뉴
// 미들웨어가 /articles → /admin/articles 로 rewrite하므로
// usePathname()은 /admin/articles를 반환 → matchPath로 비교
const CMS_LINKS: SidebarLink[] = [
  { name: '기사 작성',  href: '/articles',  matchPath: '/admin/articles', icon: NewspaperIcon,              permission: 'articles.create' },
  { name: '이벤트',    href: '/events',    matchPath: '/admin/events',   icon: CalendarDaysIcon,           permission: 'events.manage' },
  { name: '기사 데스크', href: '/desks',     matchPath: '/admin/desks',    icon: ClipboardDocumentCheckIcon, permission: 'desk.online' },
  { name: '일정관리',   href: '/calendar',  matchPath: '/admin/calendar', icon: CalendarIcon,               permission: 'calendar.manage' },
];

// admin.iusm.co.kr — 운영 관리 메뉴
const ADMIN_LINKS: SidebarLink[] = [
  { name: '개요',      href: '/',          matchPath: '/admin',           icon: HomeIcon },
  { name: '메인 배치', href: '/homepage',  matchPath: '/admin/homepage',  icon: RectangleGroupIcon, permission: 'homepage.manage' },
  { name: '광고 배너', href: '/banners',   matchPath: '/admin/banners',   icon: PhotoIcon,          permission: 'banners.manage' },
  { name: '대시보드',  href: '/analytics', matchPath: '/admin/analytics', icon: ChartBarIcon,       permission: 'analytics.view' },
  { name: '권한/설정', href: '/settings',  matchPath: '/admin/settings',  icon: Cog6ToothIcon,      permission: 'roles.manage' },
];

// 기존 /admin/* 직접 접근 시 (서브도메인 없음) — 모든 메뉴 표시
const ALL_LINKS: SidebarLink[] = [
  { name: '개요',       href: '/admin',          matchPath: '/admin',           icon: HomeIcon },
  { name: '기사 작성',  href: '/admin/articles', matchPath: '/admin/articles',  icon: NewspaperIcon,              permission: 'articles.create' },
  { name: '이벤트',    href: '/admin/events',   matchPath: '/admin/events',    icon: CalendarDaysIcon,           permission: 'events.manage' },
  { name: '기사 데스크', href: '/admin/desks',    matchPath: '/admin/desks',     icon: ClipboardDocumentCheckIcon, permission: 'desk.online' },
  { name: '일정관리',   href: '/admin/calendar', matchPath: '/admin/calendar',  icon: CalendarIcon,               permission: 'calendar.manage' },
  { name: '메인 배치',  href: '/admin/homepage', matchPath: '/admin/homepage',  icon: RectangleGroupIcon,         permission: 'homepage.manage' },
  { name: '광고 배너',  href: '/admin/banners',  matchPath: '/admin/banners',   icon: PhotoIcon,                  permission: 'banners.manage' },
  { name: '대시보드',   href: '/admin/analytics',matchPath: '/admin/analytics', icon: ChartBarIcon,               permission: 'analytics.view' },
  { name: '권한/설정',  href: '/admin/settings', matchPath: '/admin/settings',  icon: Cog6ToothIcon,              permission: 'roles.manage' },
];

export type SidebarMode = 'cms' | 'admin' | 'all';

interface AdminSidebarProps {
  role: string;
  userName: string;
  mode?: SidebarMode;
}

const MODE_LABEL: Record<SidebarMode, string> = {
  cms: '뉴스룸 CMS',
  admin: '운영 관리',
  all: '관리자 콘솔',
};

export default function AdminSidebar({ role, userName, mode = 'all' }: AdminSidebarProps) {
  const pathname = usePathname();

  const cmsRole = role as CmsRole;
  const allowedPermissions: CmsPermission[] = rolePermissions[cmsRole] ?? [];
  const roleLabel = roleLabels[cmsRole] ?? role;

  const linkSet = mode === 'cms' ? CMS_LINKS : mode === 'admin' ? ADMIN_LINKS : ALL_LINKS;

  const visibleLinks = linkSet.filter((link) => {
    if (!link.permission) return true;
    return allowedPermissions.includes(link.permission);
  });

  const modeLabel = MODE_LABEL[mode];

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-white px-3 py-4">
      {/* 헤더 */}
      <Link
        href="/"
        className="mb-4 flex h-16 items-center gap-3 rounded-md bg-brand-charcoal px-4 hover:bg-primary-dark transition-colors"
      >
        <Logo variant="full" color="white" size="sm" />
        <div className="hidden md:block">
          <p className="text-xs text-neutral-400 leading-none">{modeLabel}</p>
        </div>
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.matchPath ||
            (link.matchPath !== '/admin' && pathname.startsWith(`${link.matchPath}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex h-11 min-w-28 items-center justify-center gap-2 rounded-md px-3 text-body-sm font-medium transition-colors duration-150 md:min-w-0 md:justify-start',
                active
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              )}
            >
              <Icon className="h-5 w-5 flex-none" />
              <span className="whitespace-nowrap">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 서브도메인 전환 링크 (super_admin/publisher/desk_editor만 표시) */}
      {mode !== 'all' && ['super_admin', 'publisher', 'desk_editor'].includes(cmsRole) && (
        <div className="mt-2 hidden md:block">
          {mode === 'cms' ? (
            <a
              href="https://admin.iusm.co.kr"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-caption text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <RectangleGroupIcon className="h-4 w-4" />
              운영 관리로 전환 →
            </a>
          ) : (
            <a
              href="https://cms.iusm.co.kr"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-caption text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <NewspaperIcon className="h-4 w-4" />
              뉴스룸으로 전환 →
            </a>
          )}
        </div>
      )}

      {/* 현재 역할 표시 */}
      <div className="mt-4 hidden rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500 md:block">
        <p className="font-semibold text-neutral-900 mb-0.5">{userName || '관리자'}</p>
        <p>{roleLabel}</p>
      </div>
    </aside>
  );
}
