'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Event } from '@/app/lib/definitions';
import { formatDateKo } from '@/app/lib/utils';

interface Props {
  event: Event;
}

export default function EventRegisterForm({ event }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', attendees: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFree = !event.price || event.price === 0;
  const totalAmount = isFree ? 0 : event.price! * form.attendees;
  const isFull = event.maxCapacity != null && event.currentRegistrations >= event.maxCapacity;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'attendees' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId:       event.slug,
          eventTitle:    event.title,
          eventDate:     event.startDate,
          eventLocation: event.location,
          name:          form.name,
          email:         form.email,
          phone:         form.phone,
          attendees:     form.attendees,
          totalAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다');
        return;
      }

      if (isFree) {
        router.push(`/events/${event.slug}/register/success`);
      } else {
        // 유료: 토스페이먼츠 결제 페이지로 이동
        router.push(
          `/events/${event.slug}/checkout?orderId=${data.orderId}&amount=${totalAmount}&title=${encodeURIComponent(event.title)}`
        );
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }

  if (isFull) {
    return (
      <div className="text-center py-12">
        <p className="text-heading-3 font-bold text-neutral-900 mb-2">신청이 마감되었습니다</p>
        <p className="text-body-sm text-neutral-500">정원이 모두 찼습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이벤트 요약 */}
      <div className="bg-neutral-50 rounded-2xl p-5 space-y-2">
        <p className="text-body-sm font-semibold text-neutral-900">{event.title}</p>
        <p className="text-caption text-neutral-500">
          {formatDateKo(event.startDate)}
          {event.startDate !== event.endDate && ` ~ ${formatDateKo(event.endDate)}`}
          {' · '}{event.location}
        </p>
        <p className="text-body font-bold text-primary">
          {isFree ? '무료' : `${event.price!.toLocaleString()}원 / 1인`}
        </p>
      </div>

      {/* 참가자 정보 */}
      <div className="space-y-4">
        <h2 className="text-heading-3 font-bold text-neutral-900">참가자 정보</h2>

        <div>
          <label className="block text-body-sm font-semibold text-neutral-700 mb-1.5">
            이름 <span className="text-accent">*</span>
          </label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            required placeholder="홍길동"
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-neutral-700 mb-1.5">
            이메일 <span className="text-accent">*</span>
          </label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            required placeholder="example@email.com"
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          <p className="text-caption text-neutral-400 mt-1">신청 확인 메일이 발송됩니다</p>
        </div>

        <div>
          <label className="block text-body-sm font-semibold text-neutral-700 mb-1.5">
            연락처 <span className="text-accent">*</span>
          </label>
          <input
            type="tel" name="phone" value={form.phone} onChange={handleChange}
            required placeholder="010-0000-0000"
            className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        {!isFree && (
          <div>
            <label className="block text-body-sm font-semibold text-neutral-700 mb-1.5">
              참가 인원
            </label>
            <select
              name="attendees" value={form.attendees} onChange={handleChange}
              className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            >
              {[1,2,3,4,5].map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 결제 금액 (유료) */}
      {!isFree && (
        <div className="border-t border-neutral-200 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-neutral-600">
              {event.price!.toLocaleString()}원 × {form.attendees}명
            </span>
            <span className="text-heading-3 font-bold text-primary">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-body-sm text-red-700">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit" disabled={loading}
        className="w-full btn-accent py-4 rounded-xl text-body font-bold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? '처리 중...' : isFree ? '무료 신청하기' : `${totalAmount.toLocaleString()}원 결제하기`}
      </button>

      <p className="text-caption text-neutral-400 text-center">
        신청 후 이메일로 확인서가 발송됩니다
      </p>
    </form>
  );
}
