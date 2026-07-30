import { articles } from '@/app/lib/cms/sample-data';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { StatusBadge } from '@/app/ui/admin/status-badge';
import {
  CheckCircleIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function ArticlesPage() {
  return (
    <>
      <SectionHeader
        title="기사 작성"
        description="기사 작성, 수정, 오탈자 교정, 보도자료 기반 초안 생성, 유사도 측정, SEO 추천을 한 화면에서 처리하는 편집 워크스페이스입니다."
        action={
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800">
            <PencilSquareIcon className="h-5 w-5" />
            새 기사
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">보도자료 업로드</h2>
          <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-700">PDF, DOCX, TXT 원문 업로드</p>
            <p className="mt-1 text-sm text-slate-500">업로드 후 초안, 팩트체크 질문, SEO 키워드를 생성합니다.</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <SparklesIcon className="h-5 w-5" />
              초안 작성
            </button>
            <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <MagnifyingGlassCircleIcon className="h-5 w-5" />
              유사도 측정
            </button>
            <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <CheckCircleIcon className="h-5 w-5" />
              오탈자 점검
            </button>
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-950">AI 편집 보조 결과</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">추천 SEO 키워드</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['지역 의료', '응급의료센터', '예산 심의', '공공의료'].map((keyword) => (
                  <span key={keyword} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">사진 메타 태그</p>
              <p className="mt-3 text-sm text-slate-600">
                alt: 시의회 예산 심의 현장에서 관계자가 자료를 확인하는 모습
              </p>
              <p className="mt-2 text-sm text-slate-600">credit: 편집국 사진팀</p>
            </div>
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="max-w-lg px-4 py-4 font-medium text-slate-950">{article.title}</td>
                  <td className="px-4 py-4 text-slate-600">{article.section}</td>
                  <td className="px-4 py-4 text-slate-600">{article.author}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {article.similarityScore ? `${Math.round(article.similarityScore * 100)}%` : '미측정'}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{article.seoKeywords.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
