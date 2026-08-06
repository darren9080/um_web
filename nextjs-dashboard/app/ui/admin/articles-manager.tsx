'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import { deleteArticle, checkArticleProofreading } from '@/app/lib/actions/articles';
import {
  uploadPressRelease,
  generateDraftFromPressRelease,
  measureArticleSimilarity,
} from '@/app/lib/actions/press-releases';
import { CATEGORY_LABELS } from '@/app/lib/definitions';
import type { Article, PressRelease } from '@/app/lib/cms/definitions';
import type { ProofreadResult } from '@/app/lib/cms/ai';

const SECTIONS = Object.values(CATEGORY_LABELS);

interface ArticlesManagerProps {
  initialArticles: Article[];
  initialPressReleases: PressRelease[];
}

export default function ArticlesManager({ initialArticles, initialPressReleases }: ArticlesManagerProps) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [pressReleases, setPressReleases] = useState(initialPressReleases);
  const [selectedPressReleaseId, setSelectedPressReleaseId] = useState<string>(
    initialPressReleases[0]?.id ?? '',
  );
  const [section, setSection] = useState(SECTIONS[0] ?? '');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadBody, setUploadBody] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [proofreadResult, setProofreadResult] = useState<ProofreadResult | null>(null);
  const [proofreadArticleId, setProofreadArticleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const id = await uploadPressRelease(formData);
        setPressReleases((prev) => [
          { id, title: uploadTitle, body: uploadBody, createdAt: new Date().toISOString() },
          ...prev,
        ]);
        setSelectedPressReleaseId(id);
        setUploadTitle('');
        setUploadBody('');
      } catch (err) {
        setError(err instanceof Error ? err.message : '보도자료 업로드 중 오류가 발생했습니다.');
      }
    });
  }

  function handleGenerateDraft() {
    if (!selectedPressReleaseId) {
      setError('먼저 보도자료를 업로드하거나 선택해주세요.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await generateDraftFromPressRelease(selectedPressReleaseId, section);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : '초안 생성 중 오류가 발생했습니다.');
      }
    });
  }

  function handleMeasureSimilarity(articleId: string) {
    if (!selectedPressReleaseId) {
      setError('비교할 보도자료를 먼저 선택해주세요.');
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const similarity = await measureArticleSimilarity(articleId, selectedPressReleaseId);
        setArticles((prev) =>
          prev.map((a) => (a.id === articleId ? { ...a, similarityScore: similarity } : a)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : '유사도 측정 중 오류가 발생했습니다.');
      }
    });
  }

  function handleProofread(articleId: string) {
    setError(null);
    setProofreadArticleId(articleId);
    startTransition(async () => {
      try {
        const result = await checkArticleProofreading(articleId);
        setProofreadResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오탈자 점검 중 오류가 발생했습니다.');
      } finally {
        setProofreadArticleId(null);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('이 기사를 삭제하시겠습니까?')) return;
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteArticle(id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/articles/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <PencilSquareIcon className="h-5 w-5" />
          새 기사
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">보도자료 업로드</h2>
          <form onSubmit={handleUpload} className="mt-4 space-y-3">
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              name="title"
              placeholder="보도자료 제목"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <textarea
              required
              value={uploadBody}
              onChange={(e) => setUploadBody(e.target.value)}
              name="body"
              rows={5}
              placeholder="보도자료 원문을 붙여넣으세요 (텍스트만 지원 — PDF/DOCX는 추후 지원 예정)"
              className="block w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
            <button
              type="submit"
              disabled={isPending}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              업로드
            </button>
          </form>

          {pressReleases.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <label className="block text-sm font-medium text-slate-700">
                대상 보도자료
              </label>
              <select
                value={selectedPressReleaseId}
                onChange={(e) => setSelectedPressReleaseId(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                {pressReleases.map((pr) => (
                  <option key={pr.id} value={pr.id}>{pr.title}</option>
                ))}
              </select>

              <label className="mt-3 block text-sm font-medium text-slate-700">섹션</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={handleGenerateDraft}
                disabled={isPending}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <SparklesIcon className="h-5 w-5" />
                {isPending ? '생성 중…' : '초안 작성'}
              </button>
              <p className="mt-2 text-xs text-slate-400">
                선택한 보도자료로 OpenAI를 호출해 새 기사 초안(제목/리드/본문/팩트체크 질문/SEO 키워드)을 생성합니다.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">오탈자 점검 결과</h2>
          {proofreadResult ? (
            proofreadResult.issues.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {proofreadResult.issues.map((issue, i) => (
                  <li key={i} className="rounded-md bg-slate-50 p-3 text-sm">
                    <p className="text-slate-500 line-through">{issue.original}</p>
                    <p className="mt-1 font-semibold text-slate-900">{issue.suggestion}</p>
                    <p className="mt-1 text-xs text-slate-400">{issue.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">발견된 오류가 없습니다.</p>
            )
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              아래 기사 목록에서 &ldquo;오탈자 점검&rdquo;을 눌러 결과를 확인하세요.
            </p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-slate-950">기사 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3">섹션</th>
                <th className="px-4 py-3">작성자</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">유사도</th>
                <th className="px-4 py-3">SEO</th>
                <th className="px-4 py-3 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="max-w-lg px-4 py-4 font-medium text-slate-950">
                    <Link href={`/admin/articles/${article.id}/edit`} className="hover:underline">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{article.section}</td>
                  <td className="px-4 py-4 text-slate-600">{article.author}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {article.similarityScore != null ? `${Math.round(article.similarityScore * 100)}%` : '미측정'}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{article.seoKeywords.join(', ')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleMeasureSimilarity(article.id)}
                        disabled={isPending}
                        title="유사도 측정"
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                      >
                        <MagnifyingGlassCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleProofread(article.id)}
                        disabled={isPending}
                        title="오탈자 점검"
                        className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {proofreadArticleId === article.id ? (
                          <span className="block h-4 w-4 animate-pulse rounded-full bg-slate-300" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        title="삭제"
                        className="rounded-md border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    등록된 기사가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
