import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  COMMUNITY_POSTS, getPostById, POST_CATEGORY_LABELS, POST_CATEGORY_COLORS,
} from '@/app/lib/marathon-data';
import LikeButton from './like-button';

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  return COMMUNITY_POSTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) return { title: '글을 찾을 수 없습니다' };
  return { title: post.title, description: post.content.slice(0, 100) };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();

  const related = COMMUNITY_POSTS
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 4);

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="max-w-3xl mx-auto">
        <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
          <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
          <span>/</span>
          <Link href="/marathon/community" className="hover:text-brand-red transition-colors">커뮤니티</Link>
        </nav>

        {/* 헤더 */}
        <header className="pb-6 border-b border-neutral-200 mb-6">
          <span className={`text-caption font-semibold px-2.5 py-1 rounded-full ${POST_CATEGORY_COLORS[post.category]}`}>
            {POST_CATEGORY_LABELS[post.category]}
          </span>
          <h1 className="text-heading-1 font-bold text-neutral-900 mt-3 mb-4 text-balance">{post.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-charcoal text-white text-body-sm font-bold flex items-center justify-center">
                {post.author[0]}
              </div>
              <div>
                <p className="text-body-sm font-semibold text-neutral-900">{post.author}</p>
                <p className="text-caption text-neutral-400">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-4 text-caption text-neutral-400 tabular-nums">
              <span>조회 {post.views.toLocaleString()}</span>
              <span>추천 {post.likes}</span>
              <span>댓글 {post.commentCount}</span>
            </div>
          </div>
        </header>

        {/* 본문 */}
        <div className="text-body text-neutral-700 leading-relaxed whitespace-pre-wrap min-h-[160px]">
          {post.content}
        </div>

        {post.migrated && (
          <p className="mt-6 text-caption text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2">
            이 글은 기존 울산매일마라톤 사이트에서 이관된 글입니다.
          </p>
        )}

        {/* 추천 버튼 */}
        <div className="flex justify-center my-8">
          <LikeButton postId={post.id} initialLikes={post.likes} />
        </div>

        {/* 댓글 (기존 댓글 시스템 재사용 예정 안내) */}
        <div className="border-t border-neutral-200 pt-8">
          <h2 className="text-heading-3 font-bold text-neutral-900 mb-6">
            댓글 <span className="text-body-sm font-normal text-neutral-400">{post.commentCount}</span>
          </h2>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
            <p className="text-body-sm text-neutral-600 mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
            <a href="https://iusm.co.kr/login" className="inline-block px-5 py-2.5 rounded-lg bg-brand-charcoal text-white text-body-sm font-semibold hover:bg-neutral-800 transition-colors">
              소셜 로그인
            </a>
            <p className="text-caption text-neutral-400 mt-3">언론사 웹 계정으로 로그인하면 마라톤 커뮤니티에서도 그대로 사용됩니다.</p>
          </div>
        </div>

        {/* 관련 글 */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-body font-bold text-neutral-900 mb-4">같은 게시판 다른 글</h3>
            <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
              {related.map((p) => (
                <Link key={p.id} href={`/marathon/community/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                  <span className="text-body-sm text-neutral-800 truncate flex-1">{p.title}</span>
                  <span className="text-caption text-neutral-400 shrink-0">{p.author}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/marathon/community" className="text-body-sm font-semibold text-neutral-600 hover:text-brand-red transition-colors">
            ← 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
