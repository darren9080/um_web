'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="bg-primary text-white py-14">
      <div className="container-main text-center">
        <p className="text-caption font-semibold tracking-widest text-neutral-400 uppercase mb-3">
          뉴스레터
        </p>
        <h2 className="text-heading-2 font-bold mb-3 text-balance">
          울산매일UTV의 중요한 소식을<br />
          먼저 받아보세요
        </h2>
        <p className="text-body-sm text-neutral-400 mb-8 max-w-md mx-auto">
          매주 엄선된 문화·사회·스포츠 소식과 이벤트 정보를
          이메일로 전달해 드립니다.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-3 rounded-xl text-body-sm font-semibold">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            구독이 완료되었습니다!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-body-sm
                         focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-accent shrink-0 py-3 px-6 rounded-xl disabled:opacity-60"
            >
              {loading ? '처리 중...' : '구독하기'}
            </button>
          </form>
        )}

        <p className="text-caption text-neutral-500 mt-4">
          언제든지 구독을 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.
        </p>
      </div>
    </section>
  );
}
