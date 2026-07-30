'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { label: '대회안내', href: '/marathon' },
  { label: '참가신청', href: '/marathon/apply' },
  { label: '기록실', href: '/marathon/records' },
  { label: '지난대회', href: '/marathon/archive' },
  { label: '커뮤니티', href: '/marathon/community' },
];

export default function MarathonHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/marathon' ? pathname === '/marathon' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-brand-charcoal text-white">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/marathon" className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-red text-white font-black text-body-sm">
              M
            </span>
            <div className="leading-none">
              <p className="font-black text-body tracking-tight">울산매일마라톤</p>
              <p className="text-[10px] text-white/50 tracking-widest mt-0.5">ULSAN MAEIL MARATHON</p>
            </div>
          </Link>

          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 우측: 신청 CTA + 언론사 */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/marathon/apply"
              className="px-4 py-2 rounded-lg bg-brand-red hover:bg-brand-red-dark text-white text-body-sm font-bold transition-colors"
            >
              참가신청
            </Link>
            <a
              href="https://iusm.co.kr"
              className="text-caption text-white/50 hover:text-white/80 transition-colors"
            >
              울산매일 ↗
            </a>
          </div>

          {/* 모바일 토글 */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2"
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav className="md:hidden border-t border-white/10 bg-brand-charcoal">
          <div className="container-main py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-3 rounded-lg text-body-sm font-semibold ${
                  isActive(item.href) ? 'bg-white/10 text-white' : 'text-white/70'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/marathon/apply"
              onClick={() => setOpen(false)}
              className="block mt-2 px-3 py-3 rounded-lg bg-brand-red text-white text-body-sm font-bold text-center"
            >
              참가신청
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
