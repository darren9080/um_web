import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getCurrentRace } from '@/app/lib/marathon-data';
import ApplyForm from './apply-form';

export const metadata: Metadata = { title: '참가신청' };

function formatKoDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function ApplyPage() {
  const race = getCurrentRace();
  if (race.status === 'ended' || race.status === 'closed') {
    redirect(`/marathon/${race.year}`);
  }

  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=' + encodeURIComponent('https://marathon.iusm.co.kr/apply'));
  }

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
          <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
          <span>/</span>
          <span className="text-neutral-600">참가신청</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">참가 신청</h1>
          <p className="text-body text-neutral-500">{race.title} · {formatKoDate(race.date)}</p>
        </div>

        <ApplyForm
          race={JSON.parse(JSON.stringify(race))}
          defaultName={session.user.name ?? ''}
          defaultEmail={session.user.email ?? ''}
        />
      </div>
    </div>
  );
}
