import type { Metadata } from 'next';
import Link from 'next/link';
import {
  COMMUNITY_POSTS, POST_CATEGORY_LABELS, POST_CATEGORY_COLORS, type PostCategory,
} from '@/app/lib/marathon-data';

export const metadata: Metadata = {
  title: '커뮤니티',
  description: '울산매일마라톤 러너 커뮤니티 — 완주후기·함께달려요·질문답변.',
};

const CATEGORIES: (PostCategory | 'all')[] = ['all', 'review', 'group', 'qna', 'free'];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return '오늘';
  if (days < 30) return `${days}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}

type SearchParams = Promise<{ category?: string }>;

export default async function CommunityPage({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  const active = (CATEGORIES.includes(category as PostCategory) ? category : 'all') as PostCategory | 'all';

  const posts = [...COMMUNITY_POSTS]
    .filter((p) => active === 'all' || p.category === active)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container-main py-10 lg:py-14">
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
        <span>/</span>
        <span className="text-neutral-600">커뮤니티</span>
      </nav>

      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-caption font-semibold text-brand-red tracking-widest uppercase mb-2">Community</p>
          <h1 className="text-heading-1 font-bold text-neutral-900">러너 커뮤니티</h1>
        </div>
        <Link href="/marathon/community/write" className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-body-sm font-bold hover:bg-brand-red-dark transition-colors">
          글쓰기
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={c === 'all' ? '/marathon/community' : `/marathon/community?category=${c}`}
            className={`px-4 py-2 rounded-full text-body-sm font-semibold transition-colors ${
              active === c ? 'bg-brand-charcoal text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {c === 'all' ? '전체' : POST_CATEGORY_LABELS[c]}
          </Link>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
        {posts.map((post) => (
          <Link key={post.id} href={`/marathon/community/${post.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors">
            <span className={`shrink-0 text-caption font-semibold px-2.5 py-1 rounded-full ${POST_CATEGORY_COLORS[post.category]}`}>
              {POST_CATEGORY_LABELS[post.category]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-semibold text-neutral-900 truncate">
                {post.title}
                {post.commentCount > 0 && <span className="ml-2 text-brand-red">[{post.commentCount}]</span>}
                {post.migrated && <span className="ml-2 text-caption font-normal text-neutral-300">이관글</span>}
              </p>
              <p className="text-caption text-neutral-400 mt-0.5">{post.author} · {timeAgo(post.createdAt)}</p>
            </div>
            <div className="shrink-0 text-right text-caption text-neutral-400 tabular-nums hidden sm:block">
              <p>조회 {post.views.toLocaleString()}</p>
              <p>추천 {post.likes}</p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-neutral-50 rounded-2xl mt-4">
          <p className="text-body-sm text-neutral-500">아직 글이 없습니다. 첫 글을 남겨보세요.</p>
        </div>
      )}
    </div>
  );
}
