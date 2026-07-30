'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  COURSE_LABELS, type CourseType, type MarathonRace,
} from '@/app/lib/marathon-data';

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ApplyForm({
  race, defaultName, defaultEmail,
}: {
  race: MarathonRace;
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const available = race.courses.filter((c) => c.registered < c.limit);
  const [course, setCourse] = useState<CourseType>(available[0]?.type ?? race.courses[0].type);
  const [name, setName] = useState(defaultName);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [shirtSize, setShirtSize] = useState('M');
  const [emergency, setEmergency] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedCourse = race.courses.find((c) => c.type === course)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!agree) { setError('참가 규정 및 개인정보 수집에 동의해 주세요.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/marathon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: race.year, course, name, gender, birthDate, phone, email,
          shirtSize, emergencyContact: emergency, totalAmount: selectedCourse.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '신청 처리 중 오류가 발생했습니다'); return; }
      router.push(`/marathon/apply/checkout?orderId=${data.orderId}`);
    } catch {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full border border-neutral-300 rounded-xl px-4 py-3 text-body-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors';
  const labelCls = 'block text-body-sm font-semibold text-neutral-800 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 종목 선택 */}
      <fieldset>
        <legend className={labelCls}>종목 선택</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          {race.courses.map((c) => {
            const soldOut = c.registered >= c.limit;
            return (
              <label
                key={c.type}
                className={`relative flex items-center justify-between border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  course === c.type ? 'border-brand-red bg-brand-red/5' : 'border-neutral-200 hover:border-neutral-300'
                } ${soldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio" name="course" value={c.type} checked={course === c.type}
                  disabled={soldOut}
                  onChange={() => setCourse(c.type)}
                  className="sr-only"
                />
                <div>
                  <p className="text-body-sm font-bold text-neutral-900">{COURSE_LABELS[c.type]}</p>
                  <p className="text-caption text-neutral-500">{c.price.toLocaleString()}원</p>
                </div>
                {soldOut && <span className="text-caption font-bold text-neutral-400">마감</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 참가자 정보 */}
      <div className="space-y-4">
        <div>
          <label className={labelCls}>이름</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="실명" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>성별</label>
            <div className="flex gap-2">
              {(['M', 'F'] as const).map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-xl text-body-sm font-semibold border-2 transition-colors ${
                    gender === g ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-neutral-200 text-neutral-500'
                  }`}>
                  {g === 'M' ? '남' : '여'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>생년월일</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>연락처</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputCls} placeholder="010-0000-0000" />
          </div>
          <div>
            <label className={labelCls}>기념 티셔츠</label>
            <select value={shirtSize} onChange={(e) => setShirtSize(e.target.value)} className={inputCls}>
              {SHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>이메일</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="you@example.com" />
        </div>

        <div>
          <label className={labelCls}>비상 연락처 <span className="text-neutral-400 font-normal">(선택)</span></label>
          <input type="tel" value={emergency} onChange={(e) => setEmergency(e.target.value)} className={inputCls} placeholder="보호자 또는 지인 연락처" />
        </div>
      </div>

      {/* 동의 */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 w-4 h-4 accent-brand-red" />
        <span className="text-body-sm text-neutral-600">
          참가 규정 및 개인정보 수집·이용에 동의합니다. 마라톤은 건강 상태를 반드시 확인 후 참가하시기 바랍니다.
        </span>
      </label>

      {error && <p className="text-body-sm text-red-600">{error}</p>}

      {/* 결제 요약 + 제출 */}
      <div className="border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-body-sm text-neutral-600">결제 금액</span>
          <span className="text-heading-2 font-black text-brand-red">{selectedCourse.price.toLocaleString()}원</span>
        </div>
        <button type="submit" disabled={submitting}
          className="w-full py-4 rounded-xl bg-brand-red text-white font-bold hover:bg-brand-red-dark transition-colors disabled:opacity-60">
          {submitting ? '처리 중...' : '결제하고 신청 완료'}
        </button>
      </div>
    </form>
  );
}
