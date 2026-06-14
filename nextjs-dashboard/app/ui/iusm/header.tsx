'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { CATEGORY_LABELS } from '@/app/lib/definitions';
import type { ArticleCategory } from '@/app/lib/definitions';
import { Logo } from '@/app/ui/iusm/logo';

const MAIN_NAV = [
  { label: '뉴스', href: '/news' },
  { label: '이벤트', href: '/events' },
  { label: '멤버십', href: '/membership' },
  { label: '기자 소개', href: '/journalists' },
  { label: '소개', href: '/about' },
];

const CATEGORY_NAV: { label: string; href: string; key: ArticleCategory }[] = [
  { label: CATEGORY_LABELS.society, href: '/news?category=society', key: 'society' },
  { label: CATEGORY_LABELS.culture, href: '/news?category=culture', key: 'culture' },
  { label: CATEGORY_LABELS.humanities, href: '/news?category=humanities', key: 'humanities' },
  { label: CATEGORY_LABELS.sports, href: '/news?category=sports', key: 'sports' },
  { label: CATEGORY_LABELS.startup, href: '/news?category=startup', key: 'startup' },
  { label: CATEGORY_LABELS.business, href: '/news?category=business', key: 'business' },
];

const TIER_LABELS: Record<string, string> = {
  individual: '개인 멤버',
  corporate: '기업 멤버',
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === 'authenticated';
  const isPremium = isLoggedIn && session?.user?.subscriptionTier !== 'free';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-header">
      {/* 메인 헤더 */}
      <div className="container-main">
        <div className="flex items-center justify-between h-[60px]">
          {/* 로고 */}
          <Logo variant="full" color="dark" size="md" href="/" />

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body-sm font-medium text-neutral-600 hover:text-brand-charcoal transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-3">
            {/* 검색 */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full text-neutral-500 hover:text-brand-charcoal hover:bg-neutral-100 transition-colors"
              aria-label="검색"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 로그인 상태별 UI */}
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-neutral-100 rounded-lg animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-neutral-100 transition-colors"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-charcoal text-white text-caption font-bold flex items-center justify-center">
                      {session.user?.name?.[0] ?? 'U'}
                    </div>
                  )}
                  <span className="text-body-sm font-medium text-neutral-700 max-w-[80px] truncate">
                    {session.user?.name}
                  </span>
                  {isPremium && (
                    <span className="text-caption bg-brand-charcoal text-white px-1.5 py-0.5 rounded font-semibold">
                      {TIER_LABELS[session.user.subscriptionTier] ?? '멤버'}
                    </span>
                  )}
                </button>

                {/* 드롭다운 */}
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-card py-1 z-20">
                      {!isPremium && (
                        <Link
                          href="/membership"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-body-sm font-semibold text-primary hover:bg-neutral-50"
                        >
                          멤버십 업그레이드
                        </Link>
                      )}
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                        className="w-full text-left px-4 py-2.5 text-body-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block btn-outline text-xs py-1.5 px-4">
                  로그인
                </Link>
                <Link href="/membership" className="btn-accent text-xs py-1.5 px-4">
                  구독하기
                </Link>
              </>
            )}

            {/* 모바일 햄버거 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-neutral-500 hover:bg-neutral-100"
              aria-label="메뉴"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 서브 네비 */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="container-main">
          <div className="flex items-center gap-0 h-[44px] overflow-x-auto scrollbar-hide">
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="shrink-0 px-4 h-full flex items-center text-caption font-semibold text-neutral-500 hover:text-brand-charcoal border-b-2 border-transparent hover:border-brand-charcoal transition-all duration-150 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <nav className="container-main py-4 flex flex-col gap-1">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-body-sm font-medium text-neutral-700 hover:text-brand-charcoal hover:bg-neutral-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-neutral-100">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-body-sm text-neutral-500">
                    {session.user?.name}
                    {isPremium && (
                      <span className="ml-2 text-caption bg-brand-charcoal text-white px-1.5 py-0.5 rounded font-semibold">
                        {TIER_LABELS[session.user.subscriptionTier] ?? '멤버'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="block w-full text-left px-3 py-2.5 text-body-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-body-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg"
                >
                  로그인
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* 검색 오버레이 */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white w-full p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container-main flex items-center gap-3">
              <svg className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="기사, 이벤트 검색..."
                className="flex-1 border-none outline-none text-body text-neutral-900 placeholder-neutral-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-body-sm text-neutral-500 hover:text-brand-charcoal"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
