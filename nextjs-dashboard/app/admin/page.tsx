import { articles, banners, cmsFeatures, deskQueue, events } from '@/app/lib/cms/sample-data';
import { MetricCard } from '@/app/ui/admin/metric-card';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  MegaphoneIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const publishedArticles = articles.filter((article) => article.status === 'published').length;
const activeBanners = banners.filter((banner) => banner.isActive).length;
const pendingDeskItems = deskQueue.filter((item) => item.status !== 'published').length;
const publishedEvents = events.filter((event) => event.isPublished).length;

export default function AdminPage() {
  return (
    <>
      <SectionHeader
        title="뉴스룸 CMS 개요"
        description="기사 작성부터 데스크 검토, 광고 배너, 이벤트, 메인 배치, 일정, 성과 분석까지 한 콘솔에서 운영하도록 잡은 MVP 화면입니다."
        action={
          <Link
            href="/admin/articles"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <NewspaperIcon className="h-5 w-5" />
            기사 작성
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="전체 기사"
          value={`${articles.length}`}
          detail={`발행 ${publishedArticles}건, 검토 ${pendingDeskItems}건`}
          icon={NewspaperIcon}
        />
        <MetricCard
          title="활성 배너"
          value={`${activeBanners}`}
          detail="예약 노출과 위치 관리 대상"
          icon={MegaphoneIcon}
        />
        <MetricCard
          title="공개 이벤트"
          value={`${publishedEvents}`}
          detail="Google Calendar 연동 준비"
          icon={CalendarDaysIcon}
        />
        <MetricCard
          title="평균 열독률"
          value={`${Math.round(
            articles.reduce((sum, article) => sum + article.readDepth, 0) / articles.length,
          )}%`}
          detail="기사 본문 스크롤 기반 지표"
          icon={ArrowTrendingUpIcon}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-md border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-950">데스크 대기 기사</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {articles.slice(0, 4).map((article) => (
              <div key={article.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-medium text-slate-950">{article.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {article.section} · {article.author} · 열독률 {article.readDepth}%
                  </p>
                </div>
                <StatusBadge status={article.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-950">MVP 개발 결정</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {cmsFeatures.slice(0, 6).map((feature) => (
              <div key={feature.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">{feature.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{feature.rationale}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                    {feature.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-slate-500" />
          <h2 className="font-semibold text-slate-950">운영 흐름</h2>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-5">
          {['초안', '교열', '데스크 검토', '예약 발행', '성과 분석'].map((step, index) => (
            <div key={step} className="rounded-md bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">STEP {index + 1}</p>
              <p className="mt-2 font-semibold text-slate-950">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
