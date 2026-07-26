import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  MARATHON_RACES, getRaceByYear, COURSE_LABELS,
  totalRegistered, totalCapacity, searchRecords,
} from '@/app/lib/marathon-data';

type Params = Promise<{ year: string }>;

export async function generateStaticParams() {
  return MARATHON_RACES.map((r) => ({ year: String(r.year) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year } = await params;
  const race = getRaceByYear(Number(year));
  if (!race) return { title: '대회를 찾을 수 없습니다' };
  return { title: race.title, description: race.description };
}

function formatKoDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default async function RaceDetailPage({ params }: { params: Params }) {
  const { year } = await params;
  const race = getRaceByYear(Number(year));
  if (!race) notFound();

  const isEnded = race.status === 'ended';
  const registered = totalRegistered(race);
  const capacity = totalCapacity(race);
  const topRecords = isEnded ? searchRecords({ year: race.year }).slice(0, 5) : [];

  return (
    <div>
      {/* 히어로 */}
      <div className="relative bg-brand-charcoal text-white">
        <div className="absolute inset-0">
          <Image src={race.heroImage} alt={race.title} fill className="object-cover opacity-25" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-brand-charcoal/50" />
        </div>
        <div className="relative container-main py-14">
          <nav className="flex items-center gap-2 text-caption text-white/50 mb-6">
            <Link href="/marathon" className="hover:text-white transition-colors">대회안내</Link>
            <span>/</span>
            {isEnded && <><Link href="/marathon/archive" className="hover:text-white transition-colors">지난대회</Link><span>/</span></>}
            <span className="text-white/80">{race.year}</span>
          </nav>
          <span className={`inline-block px-3 py-1 rounded-full text-caption font-bold mb-4 ${isEnded ? 'bg-white/15' : 'bg-brand-red'}`}>
            {isEnded ? '종료된 대회' : '접수 중'}
          </span>
          <h1 className="text-display font-black mb-3 text-balance">{race.title}</h1>
          <p className="text-body-lg text-white/80">{formatKoDate(race.date)} · {race.startPoint}</p>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* 좌 */}
          <div>
            <section className="mb-10">
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-4">대회 소개</h2>
              <p className="text-body text-neutral-700 leading-relaxed">{race.description}</p>
            </section>

            {/* 종목·요강 */}
            <section className="mb-10">
              <h2 className="text-heading-3 font-bold text-neutral-900 mb-4">종목 안내</h2>
              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 text-caption">
                      <th className="text-left font-semibold px-4 py-3">종목</th>
                      <th className="text-right font-semibold px-4 py-3">참가비</th>
                      <th className="text-right font-semibold px-4 py-3">정원</th>
                      <th className="text-right font-semibold px-4 py-3">{isEnded ? '참가' : '신청'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {race.courses.map((c) => (
                      <tr key={c.type}>
                        <td className="px-4 py-3 font-semibold text-neutral-900">{COURSE_LABELS[c.type]}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-neutral-700">{c.price.toLocaleString()}원</td>
                        <td className="px-4 py-3 text-right tabular-nums text-neutral-500">{c.limit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold text-neutral-900">{c.registered.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 종료 대회: 상위 기록 */}
            {isEnded && topRecords.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-heading-3 font-bold text-neutral-900">종합 상위 기록</h2>
                  <Link href={`/marathon/records`} className="text-body-sm font-semibold text-brand-red hover:underline">전체 기록 →</Link>
                </div>
                <div className="space-y-2">
                  {topRecords.map((r) => (
                    <div key={r.id} className="flex items-center gap-4 border border-neutral-200 rounded-xl px-4 py-3">
                      <span className="text-heading-3 font-black text-brand-red w-8 tabular-nums">{r.overallRank}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900">{r.name} <span className="text-caption text-neutral-400 ml-1">{r.gender === 'M' ? '남' : '여'}·{r.ageGroup}</span></p>
                        <p className="text-caption text-neutral-400">배번 {r.bib}</p>
                      </div>
                      <span className="font-bold text-neutral-900 tabular-nums">{r.recordTime}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 우: 신청 위젯 */}
          <aside>
            <div className="sticky top-24 border border-neutral-200 rounded-2xl p-6">
              {isEnded ? (
                <>
                  <p className="text-body-sm text-neutral-500 mb-1">종료된 대회입니다</p>
                  <p className="text-heading-3 font-bold text-neutral-900 mb-4">완주 {race.finishers?.toLocaleString()}명</p>
                  <Link href="/marathon/records" className="block text-center py-3.5 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-colors">
                    기록 조회하기
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-body-sm text-neutral-500">신청 현황</span>
                    <span className="text-caption text-neutral-400">{Math.round((registered / capacity) * 100)}%</span>
                  </div>
                  <p className="text-heading-2 font-black text-neutral-900 mb-1">{registered.toLocaleString()}<span className="text-body-sm font-normal text-neutral-400"> / {capacity.toLocaleString()}명</span></p>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-5">
                    <div className="h-full bg-brand-red rounded-full" style={{ width: `${(registered / capacity) * 100}%` }} />
                  </div>
                  {race.registrationDeadline && (
                    <p className="text-caption text-neutral-400 mb-4">접수 마감 {formatKoDate(race.registrationDeadline)}</p>
                  )}
                  <Link href="/marathon/apply" className="block text-center py-3.5 rounded-xl bg-brand-red text-white font-bold hover:bg-brand-red-dark transition-colors">
                    참가 신청하기
                  </Link>
                </>
              )}
              <div className="mt-5 pt-5 border-t border-neutral-100 space-y-2 text-caption text-neutral-500">
                <p>📍 {race.location}</p>
                <p>🏁 출발 {race.startPoint}</p>
                <p>🏛 주최 {race.organizer}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
