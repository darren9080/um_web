'use client';

import { useState } from 'react';

interface Props {
  url: string;
  title: string;
  /** 'icon' — small circular icon buttons (article header). 'button' — full-width labeled buttons (sidebar widgets). */
  variant?: 'icon' | 'button';
}

export default function ShareActions({ url, title, variant = 'icon' }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 사용자가 공유 시트를 취소한 경우 — 별도 처리 불필요
      }
      return;
    }
    copyLink();
  }

  if (variant === 'button') {
    return (
      <div className="flex gap-2">
        <button onClick={share} className="flex-1 btn-outline py-2.5 text-xs">
          공유하기
        </button>
        <button onClick={copyLink} className="flex-1 btn-outline py-2.5 text-xs">
          {copied ? '복사됨 ✓' : '링크 복사'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={share}
        className="p-2 rounded-full text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors"
        aria-label="공유하기"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342a4 4 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a4 4 0 105.367-1.652 4 4 0 00-5.367 1.652zm0 12.632a4 4 0 105.367 1.652 4 4 0 00-5.367-1.652z" />
        </svg>
      </button>
      <button
        onClick={copyLink}
        className="p-2 rounded-full text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors"
        aria-label={copied ? '링크가 복사되었습니다' : '링크 복사'}
      >
        {copied ? (
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
      </button>
    </div>
  );
}
