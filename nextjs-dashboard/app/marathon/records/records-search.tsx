'use client';

import { useState, useMemo } from 'react';
import {
  RACE_RECORDS, COURSE_LABELS, COURSE_SHORT,
  type RaceRecord, type CourseType,
} from '@/app/lib/marathon-data';

const YEARS = [...new Set(RACE_RECORDS.map((r) => r.year))].sort((a, b) => b - a);
const COURSES: CourseType[] = ['full', 'half', '10km', '5km'];

export default function RecordsSearch() {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState<number | 'all'>('all');
  const [course, setCourse] = useState<CourseType | 'all'>('all');
  const [searched, setSearched] = useState(false);

  const results = useMemo<RaceRecord[]>(() => {
    const kw = keyword.trim();
    return RACE_RECORDS
      .filter((r) => {
        if (year !== 'all' && r.year !== year) return false;
        if (course !== 'all' && r.course !== course) return false;
        if (kw && !r.name.includes(kw) && !r.bib.includes(kw)) return false;
        return true;
      })
      .sort((a, b) => (a.year !== b.year ? b.year - a.year : a.overallRank - b.overallRank));
  }, [keyword, year, course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div>
      {/* 검색 폼 */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8">
        <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="이름 또는 배번 검색"
            className="border border-neutral-300 rounded-xl px-4 py-3 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors"
          />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-neutral-300 rounded-xl px-4 py-3 text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          >
            <option value="all">전체 연도</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}년</option>)}
          </select>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value as CourseType | 'all')}
            className="border border-neutral-300 rounded-xl px-4 py-3 text-body-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          >
            <option value="all">전체 종목</option>
            {COURSES.map((c) => <option key={c} value={c}>{COURSE_SHORT[c]}</option>)}
          </select>
          <button type="submit" className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-body-sm font-bold transition-colors">
            검색
          </button>
        </div>
      </form>

      {/* 결과 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-body-sm text-neutral-500">
          {searched || keyword || year !== 'all' || course !== 'all'
            ? <>총 <span className="font-bold text-neutral-900">{results.length}</span>건</>
            : <>전체 기록 {RACE_RECORDS.length}건</>}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-caption">
                <th className="text-left font-semibold px-4 py-3">연도</th>
                <th className="text-left font-semibold px-4 py-3">배번</th>
                <th className="text-left font-semibold px-4 py-3">이름</th>
                <th className="text-left font-semibold px-4 py-3">종목</th>
                <th className="text-right font-semibold px-4 py-3 tabular-nums">기록</th>
                <th className="text-right font-semibold px-4 py-3">종합</th>
                <th className="text-right font-semibold px-4 py-3">부문</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500">{r.year}</td>
                  <td className="px-4 py-3 font-mono text-neutral-600">{r.bib}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900">
                    {r.name}
                    <span className="ml-2 text-caption text-neutral-400">{r.gender === 'M' ? '남' : '여'}·{r.ageGroup}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">{COURSE_SHORT[r.course]}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-neutral-900 tabular-nums">{r.recordTime}</td>
                  <td className="px-4 py-3 text-right text-neutral-600 tabular-nums">{r.overallRank}위</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {r.courseRank === 1
                      ? <span className="font-bold text-brand-red">🥇 1위</span>
                      : <span className="text-neutral-600">{r.courseRank}위</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-50 rounded-2xl">
          <p className="text-body-sm text-neutral-500">
            검색 결과가 없습니다. 이름 또는 배번을 다시 확인해 주세요.
          </p>
        </div>
      )}

      <p className="text-caption text-neutral-400 mt-4">
        · 기록은 공인 계측 기준이며, 이관된 과거 기록도 포함됩니다.
        본인 기록에 계정을 연결하려면 <a href="https://iusm.co.kr/login" className="text-brand-red hover:underline">소셜 로그인</a> 후 마이페이지에서 인증하세요.
      </p>
    </div>
  );
}
