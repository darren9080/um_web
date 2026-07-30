export default function Loading() {
  return (
    <div className="container-main py-8">
      {/* 히어로 스켈레톤 */}
      <div className="grid grid-cols-1 lg:grid-cols-news-featured gap-6 mb-10">
        <div className="skeleton rounded-2xl aspect-[16/10] lg:min-h-[480px]" />
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* 뉴스 그리드 스켈레톤 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-48 rounded-xl" />
            <div className="skeleton h-4 w-1/4 rounded" />
            <div className="skeleton h-5 rounded" />
            <div className="skeleton h-5 w-4/5 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
