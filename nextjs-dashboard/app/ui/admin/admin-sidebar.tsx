'use client';

import {
  CalendarDaysIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  MegaphoneIcon,
  NewspaperIcon,
  PhotoIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/app/ui/iusm/logo';
import { roleLabels, rolePermissions } from '@/app/lib/cms/permissions';
import type { CmsRole, CmsPermission } from '@/app/lib/cms/definitions';

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: CmsPermission;
};

const links: SidebarLink[] = [
  { name: '개요',      href: '/admin',           icon: HomeIcon },
  { name: '기사 작성', href: '/admin/articles',  icon: NewspaperIcon,              permission: 'articles.create' },
  { name: '광고 배너', href: '/admin/banners',   icon: PhotoIcon,                  permission: 'banners.manage' },
  { name: '이벤트',   href: '/admin/events',    icon: CalendarDaysIcon,           permission: 'events.manage' },
  { name: '메인 배치', href: '/admin/homepage',  icon: RectangleGroupIcon,         permission: 'homepage.manage' },
  { name: '기사 데스크',href: '/admin/desks',     icon: ClipboardDocumentCheckIcon, permission: 'desk.online' },
  { name: '일정관리',  href: '/admin/calendar',  icon: MegaphoneIcon,              permission: 'calendar.manage' },
  { name: '대시보드',  href: '/admin/analytics', icon: ChartBarIcon,               permission: 'analytics.view' },
  { name: '권한/설정', href: '/admin/settings',  icon: Cog6ToothIcon,              permission: 'roles.manage' },
];

interface AdminSidebarProps {
  role: string;
  userName: string;
}

export default function AdminSidebar({ role, userName }: AdminSidebarProps) {
  const pathname = usePathname();

  const cmsRole = role as CmsRole;
  const allowedPermissions: CmsPermission[] = rolePermissions[cmsRole] ?? [];
  const roleLabel = roleLabels[cmsRole] ?? role;

  const visibleLinks = links.filter((link) => {
    if (!link.permission) return true; // 개요는 항상 노출
    return allowedPermissions.includes(link.permission);
  });

  return (
    <aside className="flex h-full flex-col border-r border-neutral-200 bg-white px-3 py-4">
      {/* 헤더: 브랜드 컬러 + Logo 컴포넌트 */}
      <Link
        href="/"
        className="mb-4 flex h-16 items-center gap-3 rounded-md bg-brand-charcoal px-4 hover:bg-primary-dark transition-colors"
      >
        <Logo variant="full" color="white" size="sm" />
        <div className="hidden md:block">
          <p className="text-xs text-neutral-400 leading-none">관리자 콘솔</p>
        </div>
      </Link>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));

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

      {/* 현재 역할 표시 */}
      <div className="mt-4 hidden rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-500 md:block">
        <p className="font-semibold text-neutral-900 mb-0.5">{userName || '관리자'}</p>
        <p>{roleLabel}</p>
      </div>
    </aside>
  );
}
