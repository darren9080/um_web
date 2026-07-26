import type { Metadata } from 'next';
import MarathonHeader from '@/app/ui/marathon/marathon-header';
import MarathonFooter from '@/app/ui/marathon/marathon-footer';

export const metadata: Metadata = {
  title: {
    default: '울산매일마라톤',
    template: '%s | 울산매일마라톤',
  },
  description: '태화강을 따라 달리는 울산 대표 시민 마라톤. 참가신청·기록조회·지난대회·커뮤니티.',
};

export default function MarathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MarathonHeader />
      <main className="flex-1">{children}</main>
      <MarathonFooter />
    </div>
  );
}
