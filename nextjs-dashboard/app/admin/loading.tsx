export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* 헤더 스켈레톤 */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="skeleton h-7 w-48 rounded" />
        <div className="skeleton h-4 w-96 rounded" />
      </div>

      {/* 지표 카드 스켈레톤 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-md border border-slate-200 bg-white p-4 space-y-3">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-7 w-16 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="skeleton h-5 w-32 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="space-y-2">
              <div className="skeleton h-4 w-64 rounded" />
              <div className="skeleton h-3 w-40 rounded" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
