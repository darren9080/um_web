'use client';

type BreakingTickerProps = {
  items: string[];
};

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div className="bg-primary text-white flex items-center overflow-hidden h-9">
      <div className="shrink-0 bg-accent-news px-4 h-full flex items-center text-caption font-bold tracking-wide whitespace-nowrap z-10">
        속보
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'ticker 40s linear infinite' }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="text-caption shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
