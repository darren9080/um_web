import { articles, reporterMetrics } from '@/app/lib/cms/sample-data';
import { MetricCard } from '@/app/ui/admin/metric-card';
import { SectionHeader } from '@/app/ui/admin/section-header';
import {
  ArrowTrendingUpIcon,
  EyeIcon,
  HandThumbUpIcon,
  NewspaperIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
const totalLikes = articles.reduce((sum, article) => sum + article.likes, 0);
const averageReadDepth = Math.round(
  articles.reduce((sum, article) => sum + article.readDepth, 0) / articles.length,
);
const averageAwareness = Math.round(
  reporterMetrics.reduce((sum, reporter) => sum + reporter.awarenessScore, 0) / reporterMetrics.length,
);

export default function AnalyticsPage() {
  return (
    <>
      <SectionHeader
        title="성과 대시보드"
        description="기사 조회수, 좋아요, 열독률, 기자 인지도 지표를 편집 판단에 사용할 수 있도록 요약합니다."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="기사 조회수" value={totalViews.toLocaleString('ko-KR')} detail="샘플 기사 합산" icon={EyeIcon} />
        <MetricCard title="좋아요" value={totalLikes.toLocaleString('ko-KR')} detail="사용자 반응 합산" icon={HandThumbUpIcon} />
        <MetricCard title="평균 열독률" value={`${averageReadDepth}%`} detail="본문 스크롤 기반" icon={ArrowTrendingUpIcon} />
        <MetricCard title="기자 인지도" value={`${averageAwareness}`} detail="조회, 공유, 반응 가중 점수" icon={UserCircleIcon} />
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <NewspaperIcon className="h-5 w-5 text-slate-500" />
          <h2 className="font-semibold text-slate-950">기자별 지표</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">기자</th>
                <th className="px-4 py-3">분야</th>
                <th className="px-4 py-3">기사</th>
                <th className="px-4 py-3">조회수</th>
                <th className="px-4 py-3">좋아요</th>
                <th className="px-4 py-3">열독률</th>
                <th className="px-4 py-3">인지도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reporterMetrics.map((reporter) => (
                <tr key={reporter.reporter}>
                  <td className="px-4 py-4 font-medium text-slate-950">{reporter.reporter}</td>
                  <td className="px-4 py-4 text-slate-600">{reporter.beat}</td>
                  <td className="px-4 py-4 text-slate-600">{reporter.articles}</td>
                  <td className="px-4 py-4 text-slate-600">{reporter.views.toLocaleString('ko-KR')}</td>
                  <td className="px-4 py-4 text-slate-600">{reporter.likes.toLocaleString('ko-KR')}</td>
                  <td className="px-4 py-4 text-slate-600">{reporter.avgReadDepth}%</td>
                  <td className="px-4 py-4">
                    <div className="h-2 w-32 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-sky-600"
                        style={{ width: `${reporter.awarenessScore}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
