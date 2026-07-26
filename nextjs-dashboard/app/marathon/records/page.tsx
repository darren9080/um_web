import type { Metadata } from 'next';
import Link from 'next/link';
import RecordsSearch from './records-search';

export const metadata: Metadata = {
  title: '기록실',
  description: '울산매일마라톤 역대 완주 기록을 이름·배번으로 조회하세요.',
};

export default function RecordsPage() {
  return (
    <div className="container-main py-10 lg:py-14">
      <nav className="flex items-center gap-2 text-caption text-neutral-400 mb-8">
        <Link href="/marathon" className="hover:text-brand-red transition-colors">대회안내</Link>
        <span>/</span>
        <span className="text-neutral-600">기록실</span>
      </nav>

      <div className="mb-8">
        <p className="text-caption font-semibold text-brand-red tracking-widest uppercase mb-2">Records</p>
        <h1 className="text-heading-1 font-bold text-neutral-900 mb-2">기록실</h1>
        <p className="text-body text-neutral-500">
          역대 울산매일마라톤 완주 기록을 이름 또는 배번으로 조회할 수 있습니다.
        </p>
      </div>

      <RecordsSearch />
    </div>
  );
}
