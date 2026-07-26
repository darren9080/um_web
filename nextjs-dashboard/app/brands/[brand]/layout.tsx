import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBrand, EVENT_BRANDS } from '@/app/lib/event-brands';

type Params = Promise<{ brand: string }>;

export async function generateStaticParams() {
  return EVENT_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) return { title: '이벤트' };
  return {
    title: { default: b.name, template: `%s | ${b.name}` },
    description: b.description,
  };
}

export default async function BrandLayout({
  children, params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { brand } = await params;
  const b = getBrand(brand);
  if (!b) notFound();

  const brandStyle = { '--brand': b.accent, '--brand-dark': b.accentDark } as React.CSSProperties;

  return (
    <div style={brandStyle} className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 text-white" style={{ background: 'var(--brand)' }}>
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <Link href={`/brands/${b.slug}`} className="font-black text-body tracking-tight">
              {b.name}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={`/events/${b.eventSlug}/register`}
                className="px-4 py-2 rounded-lg bg-white text-body-sm font-bold transition-opacity hover:opacity-90"
                style={{ color: 'var(--brand)' }}
              >
                {b.applyLabel}
              </Link>
              <a href="https://iusm.co.kr" className="text-caption text-white/70 hover:text-white transition-colors">
                울산매일 ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* 푸터 */}
      <footer className="text-white/70 mt-20" style={{ background: 'var(--brand-dark)' }}>
        <div className="container-main py-10">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <p className="font-black text-white text-body">{b.name}</p>
              <p className="text-caption text-white/50 mt-2">주최 (주)울산매일신문사 · 문의 052-243-1001</p>
            </div>
            <div className="flex gap-6 text-caption">
              <Link href={`/brands/${b.slug}`} className="hover:text-white transition-colors">대회안내</Link>
              <Link href={`/events/${b.eventSlug}/register`} className="hover:text-white transition-colors">{b.applyLabel}</Link>
              <a href="https://iusm.co.kr" className="hover:text-white transition-colors">울산매일</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-caption text-white/40">
            © {2026} 울산매일신문사. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
