'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface Comment {
  id: string;
  parent_id: string | null;
  user_id: string;
  user_name: string;
  user_image: string | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
}

interface Props {
  articleSlug: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <Image src={image} alt={name} width={32} height={32}
        className="rounded-full object-cover shrink-0" />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-brand-charcoal text-white text-caption font-bold flex items-center justify-center shrink-0">
      {name?.[0] ?? '?'}
    </div>
  );
}

function CommentItem({
  comment, currentUserId, onReply, onDelete, replies,
}: {
  comment: Comment;
  currentUserId?: string;
  onReply: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  replies: Comment[];
}) {
  const isDeleted = comment.is_deleted;
  const isOwner = currentUserId === comment.user_id;

  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar name={comment.user_name} image={comment.user_image} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            {!isDeleted && (
              <span className="text-body-sm font-semibold text-neutral-900">{comment.user_name}</span>
            )}
            <span className="text-caption text-neutral-400">{timeAgo(comment.created_at)}</span>
          </div>
          <p className={`text-body-sm leading-relaxed ${isDeleted ? 'text-neutral-400 italic' : 'text-neutral-700'}`}>
            {comment.content}
          </p>
          {!isDeleted && (
            <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onReply(comment.id, comment.user_name)}
                className="text-caption text-neutral-400 hover:text-primary transition-colors"
              >
                답글
              </button>
              {isOwner && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-caption text-neutral-400 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 답글 */}
      {replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 pl-3 border-l-2 border-neutral-100">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              replies={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ articleSlug }: Props) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          content: content.trim(),
          parentId: replyTo?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '오류가 발생했습니다'); return; }
      setComments((prev) => [...prev, data.comment]);
      setContent('');
      setReplyTo(null);
    } catch {
      setError('네트워크 오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => c.id === id ? { ...c, is_deleted: true, content: '삭제된 댓글입니다.' } : c),
      );
    }
  }

  // 최상위 댓글과 답글 분리
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesMap = comments
    .filter((c) => c.parent_id)
    .reduce<Record<string, Comment[]>>((acc, c) => {
      (acc[c.parent_id!] ??= []).push(c);
      return acc;
    }, {});

  const totalCount = comments.filter((c) => !c.is_deleted).length;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <h2 className="text-heading-3 font-bold text-neutral-900 mb-6">
        댓글
        {totalCount > 0 && (
          <span className="ml-2 text-body-sm font-normal text-neutral-400">{totalCount}</span>
        )}
      </h2>

      {/* 댓글 입력 */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-caption text-neutral-500">
              <span>@{replyTo.name}에게 답글</span>
              <button type="button" onClick={() => setReplyTo(null)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>
          )}
          <div className="flex gap-3">
            <Avatar name={session.user?.name ?? ''} image={session.user?.image} />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={replyTo ? `@${replyTo.name}에게 답글...` : '댓글을 입력하세요...'}
                rows={3}
                maxLength={1000}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-body-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
              />
              {error && <p className="text-caption text-red-600 mt-1">{error}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-caption text-neutral-400">{content.length}/1000</span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="btn-accent text-xs py-2 px-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
          <p className="text-body-sm text-neutral-600 mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => signIn('kakao')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-400 text-neutral-900 font-semibold text-body-sm rounded-lg hover:bg-yellow-500 transition-colors"
            >
              카카오로 로그인
            </button>
            <button
              onClick={() => signIn('naver')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold text-body-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              N 네이버로 로그인
            </button>
            <button
              onClick={() => signIn('google')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-semibold text-body-sm rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Google로 로그인
            </button>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-body-sm text-neutral-400 text-center py-10">첫 번째 댓글을 남겨보세요</p>
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={session?.user?.id}
              onReply={(id, name) => setReplyTo({ id, name })}
              onDelete={handleDelete}
              replies={repliesMap[comment.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
