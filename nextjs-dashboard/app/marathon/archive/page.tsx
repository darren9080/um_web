import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPastRaces, totalRegistered } from '@/app/lib/marathon-data';

export const metadata: Metadata = {
  title: '지난 대회',
  description: '울산매일마라톤 역대 대회 기록 아카이브.',
};

function formatKoDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ArchivePage() {
  const past = getPastRaces();

  return (
    <div className="container-main py-10 lg:py-14">
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
        <span>/</span>
        <span className="text-neutral-600">지난대회</span>
      </nav>

      <div className="mb-10">
        <p className="text-caption font-semibold text-brand-red tracking-widest uppercase mb-2">Archive</p>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">지난 대회 아카이브</h1>
        <p className="text-body text-neutral-500">역대 울산매일마라톤의 기록과 순간을 되돌아봅니다.</p>
      </div>

      <div className="space-y-6">
        {past.map((race) => (
          <Link
            key={race.year}
            href={`/marathon/${race.year}`}
            className="group grid md:grid-cols-[300px_1fr] gap-6 border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-card transition-shadow"
          >
            <div className="relative aspect-[16/10] md:aspect-auto bg-neutral-100">
              <Image src={race.heroImage} alt={race.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 300px" />
            </div>
            <div className="p-5 md:py-6 md:pr-6">
              <p className="text-caption text-neutral-400">{race.year} · 제{race.edition}회</p>
              <h2 className="text-heading-3 font-bold text-neutral-900 group-hover:text-brand-red transition-colors mt-1 mb-3">
                {race.title}
              </h2>
              <p className="text-body-sm text-neutral-600 line-clamp-2 mb-4">{race.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-caption text-neutral-500">
                <span>📅 {formatKoDate(race.date)}</span>
                <span>📍 {race.startPoint}</span>
                {race.finishers && <span>🏃 완주 {race.finishers.toLocaleString()}명</span>}
                {race.weather && <span>🌤 {race.weather}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
