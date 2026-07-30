'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { POST_CATEGORY_LABELS, type PostCategory } from '@/app/lib/marathon-data';

const CATEGORIES: PostCategory[] = ['review', 'group', 'qna', 'free'];

export default function WriteForm({ authorName }: { authorName: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<PostCategory>('review');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) { setError('제목과 내용을 입력해 주세요.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/marathon/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title: title.trim(), content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '등록 중 오류가 발생했습니다'); return; }
      router.push(`/marathon/community/${data.id}`);
    } catch {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-body-sm font-semibold text-neutral-800 mb-2">게시판</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-body-sm font-semibold border-2 transition-colors ${
                category === c ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-neutral-200 text-neutral-500'
              }`}>
              {POST_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-body-sm font-semibold text-neutral-800 mb-1.5">제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200}
          className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors"
          placeholder="제목을 입력하세요" />
      </div>

      <div>
        <label className="block text-body-sm font-semibold text-neutral-800 mb-1.5">내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12}
          className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-colors"
          placeholder="내용을 입력하세요" />
      </div>

      <p className="text-caption text-neutral-400">작성자: {authorName}</p>
      {error && <p className="text-body-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-neutral-300 text-body-sm font-semibold hover:bg-neutral-50 transition-colors">
          취소
        </button>
        <button type="submit" disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-brand-red text-white font-bold hover:bg-brand-red-dark transition-colors disabled:opacity-60">
          {submitting ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  );
}
