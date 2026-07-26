import Link from 'next/link';
import Image from 'next/image';
import {
  getCurrentRace, getPastRaces, COMMUNITY_POSTS, COURSE_LABELS, COURSE_SHORT,
  POST_CATEGORY_LABELS, POST_CATEGORY_COLORS, totalRegistered, totalCapacity,
} from '@/app/lib/marathon-data';
import { SITE_URL } from '@/app/lib/site-config';

// D-day 카운트다운을 위해 1시간마다 재생성 (ISR)
export const revalidate = 3600;

function dday(dateStr: string): number {
  const race = new Date(dateStr + 'T00:00:00+09:00').getTime();
  const now = Date.now();
  return Math.ceil((race - now) / 86400000);
}

function formatKoDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+09:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

export default function MarathonHubPage() {
  const race = getCurrentRace();
  const past = getPastRaces();
  const remaining = dday(race.date);
  const registered = totalRegistered(race);
  const capacity = totalCapacity(race);
  const fillPct = Math.round((registered / capacity) * 100);
  const recentPosts = [...COMMUNITY_POSTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const raceSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: race.title,
    startDate: race.date,
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: race.location, address: '울산광역시' },
    organizer: { '@type': 'Organization', name: race.organizer, url: SITE_URL },
    url: `${SITE_URL}/marathon`,
    image: race.heroImage,
    description: race.description,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raceSchema) }} />

      {/* 히어로 */}
      <section className="relative bg-brand-charcoal text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src={race.heroImage} alt={race.title} fill className="object-cover opacity-30" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/70 to-brand-charcoal/40" />
        </div>

        <div className="relative container-main py-16 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red text-white text-caption font-bold mb-5">
              {race.status === 'open' ? '참가 접수 중' : '대회 준비 중'}
            </span>
            <h1 className="text-display font-black leading-tight mb-4 text-balance">
              {race.title}
            </h1>
            <p className="text-body-lg text-white/80 mb-8">{formatKoDate(race.date)} · {race.startPoint}</p>

            {/* D-day + 신청현황 */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              {remaining > 0 && (
                <div className="flex items-baseline gap-2">
                  <span className="text-caption text-white/50">대회까지</span>
                  <span className="text-display font-black text-brand-red">D-{remaining}</span>
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-heading-2 font-black">{registered.toLocaleString()}</span>
                  <span className="text-body-sm text-white/50">/ {capacity.toLocaleString()}명 신청</span>
                </div>
                <div className="w-48 h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full" style={{ width: `${fillPct}%` }} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/marathon/apply" className="px-7 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold transition-colors">
                참가 신청하기
              </Link>
              <Link href={`/marathon/${race.year}`} className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors backdrop-blur">
                대회 요강 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 종목 */}
      <section className="container-main py-14">
        <h2 className="text-heading-2 font-bold text-neutral-900 mb-8">참가 종목</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {race.courses.map((course) => {
            const pct = Math.round((course.registered / course.limit) * 100);
            const soldOut = course.registered >= course.limit;
            return (
              <div key={course.type} className="border border-neutral-200 rounded-2xl p-5 hover:shadow-card transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-heading-3 font-black text-brand-red">{COURSE_SHORT[course.type]}</span>
                  {soldOut && <span className="text-caption font-bold text-neutral-400">마감</span>}
                </div>
                <p className="text-body-sm font-semibold text-neutral-800">{COURSE_LABELS[course.type]}</p>
                <p className="text-heading-3 font-bold text-neutral-900 mt-3">{course.price.toLocaleString()}<span className="text-body-sm font-normal text-neutral-400">원</span></p>
                <div className="mt-3">
                  <div className="flex justify-between text-caption text-neutral-400 mb-1">
                    <span>{course.registered.toLocaleString()}명</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${soldOut ? 'bg-neutral-300' : 'bg-brand-red'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 빠른 링크: 기록실 / 커뮤니티 */}
      <section className="container-main pb-14">
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/marathon/records" className="group relative overflow-hidden rounded-2xl bg-neutral-900 text-white p-8 min-h-[180px] flex flex-col justify-between">
            <div>
              <p className="text-caption text-white/50 font-semibold tracking-widest uppercase mb-2">Records</p>
              <h3 className="text-heading-2 font-bold">기록실</h3>
              <p className="text-body-sm text-white/60 mt-2 max-w-xs">이름 또는 배번으로 역대 완주 기록을 조회하세요.</p>
            </div>
            <span className="text-body-sm font-semibold text-brand-red group-hover:translate-x-1 transition-transform inline-block">기록 조회하기 →</span>
          </Link>
          <Link href="/marathon/community" className="group relative overflow-hidden rounded-2xl bg-brand-red text-white p-8 min-h-[180px] flex flex-col justify-between">
            <div>
              <p className="text-caption text-white/60 font-semibold tracking-widest uppercase mb-2">Community</p>
              <h3 className="text-heading-2 font-bold">러너 커뮤니티</h3>
              <p className="text-body-sm text-white/80 mt-2 max-w-xs">완주 후기와 연습 모임을 러너들과 나눠보세요.</p>
            </div>
            <span className="text-body-sm font-semibold text-white group-hover:translate-x-1 transition-transform inline-block">커뮤니티 가기 →</span>
          </Link>
        </div>
      </section>

      {/* 최근 커뮤니티 */}
      <section className="bg-neutral-50 border-t border-neutral-200 py-14">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-2 font-bold text-neutral-900">커뮤니티 최근 글</h2>
            <Link href="/marathon/community" className="text-body-sm font-semibold text-brand-red hover:underline">전체 보기 →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/marathon/community/${post.id}`} className="bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-card transition-shadow flex items-start gap-3">
                <span className={`shrink-0 text-caption font-semibold px-2 py-0.5 rounded-full ${POST_CATEGORY_COLORS[post.category]}`}>
                  {POST_CATEGORY_LABELS[post.category]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-neutral-900 truncate">{post.title}</p>
                  <p className="text-caption text-neutral-400 mt-1">{post.author} · 댓글 {post.commentCount}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 지난 대회 */}
      <section className="container-main py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-2 font-bold text-neutral-900">지난 대회</h2>
          <Link href="/marathon/archive" className="text-body-sm font-semibold text-brand-red hover:underline">전체 보기 →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {past.map((r) => (
            <Link key={r.year} href={`/marathon/${r.year}`} className="group rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-card transition-shadow">
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image src={r.heroImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, 33vw" />
              </div>
              <div className="p-4">
                <p className="text-caption text-neutral-400">{r.year} · 제{r.edition}회</p>
                <p className="text-body font-bold text-neutral-900 group-hover:text-brand-red transition-colors mt-0.5">{r.title}</p>
                {r.finishers && <p className="text-caption text-neutral-500 mt-1">완주 {r.finishers.toLocaleString()}명</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
