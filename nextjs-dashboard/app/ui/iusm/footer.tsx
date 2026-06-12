import Link from 'next/link';

const FOOTER_LINKS = {
  뉴스: [
    { label: '사회', href: '/news?category=society' },
    { label: '문화', href: '/news?category=culture' },
    { label: '인문학', href: '/news?category=humanities' },
    { label: '스포츠', href: '/news?category=sports' },
    { label: '스타트업', href: '/news?category=startup' },
  ],
  이벤트: [
    { label: '전체 이벤트', href: '/events' },
    { label: '재즈 페스티벌', href: '/events/iusm-jazz-festival-2026' },
    { label: '마라톤', href: '/events/seoul-marathon-2026' },
    { label: 'CEO 아카데미', href: '/events/ceo-academy-summer-2026' },
    { label: '청년 창업 박람회', href: '/events/youth-startup-fair-2026' },
  ],
  IUSM: [
    { label: '소개', href: '/about' },
    { label: '편집 원칙', href: '/about#editorial' },
    { label: '광고/제휴 문의', href: '/about#contact' },
    { label: '채용', href: '/about#careers' },
  ],
  구독: [
    { label: '멤버십 안내', href: '/membership' },
    { label: '뉴스레터 구독', href: '#newsletter' },
    { label: '이용약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: '카카오',
    href: 'https://kakao.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 3C6.477 3 2 6.582 2 11c0 2.797 1.693 5.265 4.285 6.79L5.18 21.15a.25.25 0 00.362.28l4.04-2.61A11.06 11.06 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
      </svg>
    ),
  },
  {
    label: '인스타그램',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: '유튜브',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      {/* 메인 푸터 */}
      <div className="container-main py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white text-body-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-caption hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-neutral-800">
        <div className="container-main py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 로고 + 사업자 정보 */}
          <div>
            <span className="text-white font-black text-xl tracking-tighter">IUSM</span>
            <p className="text-caption mt-1">
              (주)아이유에스엠 · 대표: 홍길동 · 사업자등록번호: 000-00-00000
            </p>
            <p className="text-caption">
              서울특별시 강남구 테헤란로 000 · 문의: contact@iusm.co.kr
            </p>
          </div>

          {/* SNS */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-neutral-500 hover:text-white transition-colors duration-150"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 저작권 */}
      <div className="bg-neutral-950">
        <div className="container-main py-3">
          <p className="text-caption text-neutral-600 text-center">
            © 2026 IUSM. All rights reserved. 무단 전재 및 재배포 금지.
          </p>
        </div>
      </div>
    </footer>
  );
}
