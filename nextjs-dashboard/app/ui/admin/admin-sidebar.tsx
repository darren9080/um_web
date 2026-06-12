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
  UsersIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: '개요', href: '/admin', icon: HomeIcon },
  { name: '기사 작성', href: '/admin/articles', icon: NewspaperIcon },
  { name: '광고 배너', href: '/admin/banners', icon: PhotoIcon },
  { name: '이벤트', href: '/admin/events', icon: CalendarDaysIcon },
  { name: '메인 배치', href: '/admin/homepage', icon: RectangleGroupIcon },
  { name: '기사 데스크', href: '/admin/desks', icon: ClipboardDocumentCheckIcon },
  { name: '일정관리', href: '/admin/calendar', icon: MegaphoneIcon },
  { name: '대시보드', href: '/admin/analytics', icon: ChartBarIcon },
  { name: '권한/설정', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white px-3 py-4">
      <Link href="/" className="mb-4 flex h-16 items-center rounded-md bg-slate-950 px-4 text-white">
        <UsersIcon className="mr-2 h-6 w-6" />
        <div>
          <p className="text-sm font-semibold">Newsroom CMS</p>
          <p className="text-xs text-slate-300">관리자 콘솔</p>
        </div>
      </Link>
      <nav className="flex flex-1 flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex h-11 min-w-28 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 md:min-w-0 md:justify-start',
                active && 'bg-sky-100 text-sky-700',
              )}
            >
              <Icon className="h-5 w-5 flex-none" />
              <span className="whitespace-nowrap">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 hidden rounded-md border border-slate-200 p-3 text-xs text-slate-600 md:block">
        <p className="font-semibold text-slate-900">현재 역할</p>
        <p>최고 관리자</p>
      </div>
    </aside>
  );
}
