import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import WriteForm from './write-form';

export const metadata: Metadata = { title: '글쓰기' };

export default async function CommunityWritePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=' + encodeURIComponent('https://marathon.iusm.co.kr/community/write'));
  }

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
          <Link href="/marathon/community" className="hover:text-brand-red transition-colors">커뮤니티</Link>
          <span>/</span>
          <span className="text-neutral-600">글쓰기</span>
        </nav>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-8">글쓰기</h1>
        <WriteForm authorName={session.user.name ?? '러너'} />
      </div>
    </div>
  );
}
