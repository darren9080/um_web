'use client';

import { useState } from 'react';

interface Props {
  url: string;
  citationText: string;
}

export default function CiteButton({ url, citationText }: Props) {
  const [copied, setCopied] = useState<'url' | 'text' | null>(null);

  const copy = async (text: string, type: 'url' | 'text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
      <p className="text-body-sm font-bold text-neutral-900">이 데이터 인용하기</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-caption bg-white border border-neutral-200 rounded px-3 py-2 text-neutral-600 truncate">
            {url}
          </code>
          <button
            onClick={() => copy(url, 'url')}
            className="shrink-0 px-3 py-2 text-caption font-semibold border border-neutral-200 rounded-lg bg-white hover:bg-primary/5 hover:border-primary hover:text-primary transition-colors"
          >
            {copied === 'url' ? '복사됨 ✓' : 'URL 복사'}
          </button>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex-1 text-caption bg-white border border-neutral-200 rounded px-3 py-2 text-neutral-500 leading-relaxed">
            {citationText}
          </div>
          <button
            onClick={() => copy(citationText, 'text')}
            className="shrink-0 px-3 py-2 text-caption font-semibold border border-neutral-200 rounded-lg bg-white hover:bg-primary/5 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
          >
            {copied === 'text' ? '복사됨 ✓' : '인용문 복사'}
          </button>
        </div>
      </div>

      <p className="text-caption text-neutral-400">
        이 데이터를 인용할 때는 출처와 기준일을 반드시 명시해주세요.
      </p>
    </div>
  );
}
