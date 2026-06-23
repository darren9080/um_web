import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PLACEHOLDER_EVENTS } from '@/app/lib/placeholder-data';
import EventRegisterForm from './event-register-form';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: '이벤트를 찾을 수 없습니다' };
  return { title: `${event.title} — 신청` };
}

export default async function EventRegisterPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = PLACEHOLDER_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  if (event.status !== 'upcoming') {
    return (
      <div className="container-main py-16 text-center max-w-lg mx-auto">
        <p className="text-heading-2 font-bold text-neutral-900 mb-3">신청이 마감된 이벤트입니다</p>
        <Link href={`/events/${slug}`} className="btn-outline text-sm py-2.5 px-6">
          이벤트 보기
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-10 max-w-lg mx-auto">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">홈</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-primary transition-colors">이벤트</Link>
        <span>/</span>
        <Link href={`/events/${slug}`} className="hover:text-primary transition-colors truncate max-w-[120px]">
          {event.title}
        </Link>
        <span>/</span>
        <span className="text-neutral-600">신청</span>
      </nav>

      <h1 className="text-heading-1 font-bold text-neutral-900 mb-8">이벤트 신청</h1>

      <EventRegisterForm event={event} />
    </div>
  );
}
