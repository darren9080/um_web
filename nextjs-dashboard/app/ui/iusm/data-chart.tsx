import type { DatasetPoint } from '@/app/lib/definitions';

interface Props {
  points: DatasetPoint[];
  unit: string;
  width?: number;
  height?: number;
  compact?: boolean;
}

function formatLabel(period: string): string {
  if (/^\d{4}-Q\d$/.test(period)) return period.replace('-', '\n');
  if (/^\d{4}-\d{2}$/.test(period)) {
    const [y, m] = period.split('-');
    return `${y.slice(2)}.${m}`;
  }
  return period;
}

function formatYTick(v: number, unit: string): string {
  if (unit === '%') return v.toFixed(1);
  if (v >= 10000) return `${(v / 10000).toFixed(0)}만`;
  return v.toLocaleString();
}

export default function DataChart({ points, unit, width = 640, height = 220, compact = false }: Props) {
  if (points.length < 2) return null;

  const PAD = compact
    ? { top: 12, right: 16, bottom: 32, left: 48 }
    : { top: 20, right: 24, bottom: 44, left: 72 };

  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;

  const values = points.map((p) => p.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const toX = (i: number) => PAD.left + (i / (points.length - 1)) * W;
  const toY = (v: number) => PAD.top + H - ((v - minV) / range) * H;

  const linePoints = points.map((p, i) => `${toX(i)},${toY(p.value)}`).join(' ');
  const fillPath = [
    `M ${toX(0)},${toY(points[0].value)}`,
    ...points.slice(1).map((p, i) => `L ${toX(i + 1)},${toY(p.value)}`),
    `L ${toX(points.length - 1)},${PAD.top + H}`,
    `L ${toX(0)},${PAD.top + H} Z`,
  ].join(' ');

  const TICK_COUNT = compact ? 3 : 5;
  const yTicks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const v = minV + (range * i) / (TICK_COUNT - 1);
    return { v, y: toY(v) };
  });

  const xStep = Math.max(1, Math.ceil(points.length / (compact ? 4 : 7)));
  const xLabels = points
    .map((p, i) => ({ ...p, i }))
    .filter(({ i }) => i % xStep === 0 || i === points.length - 1);

  const gradId = `chartGrad-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label="시계열 데이터 차트"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C41230" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C41230" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Y축 그리드 */}
      {yTicks.map(({ v, y }, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={y} x2={width - PAD.right} y2={y}
            stroke="#E5E5E5" strokeWidth="1" strokeDasharray={i === 0 ? 'none' : '4,4'}
          />
          {!compact && (
            <text
              x={PAD.left - 8} y={y}
              textAnchor="end" dominantBaseline="middle"
              fontSize="11" fill="#A3A3A3"
            >
              {formatYTick(v, unit)}
            </text>
          )}
        </g>
      ))}

      {/* 채우기 영역 */}
      <path d={fillPath} fill={`url(#${gradId})`} />

      {/* 잠정치 구간 점선 표시 */}
      {points.map((p, i) => {
        if (!p.isProvisional || i === 0) return null;
        const prev = points[i - 1];
        return (
          <line
            key={i}
            x1={toX(i - 1)} y1={toY(prev.value)}
            x2={toX(i)} y2={toY(p.value)}
            stroke="#C41230" strokeWidth="2"
            strokeDasharray="5,3" opacity="0.7"
          />
        );
      })}

      {/* 확정치 선 */}
      <polyline
        points={points
          .filter((p) => !p.isProvisional)
          .map((p, _, arr) => {
            const idx = points.indexOf(p);
            return `${toX(idx)},${toY(p.value)}`;
          })
          .join(' ')}
        fill="none" stroke="#C41230" strokeWidth="2.5" strokeLinejoin="round"
      />

      {/* 전체 선 (잠정치 구간도 포함, 연하게) */}
      {points.some((p) => p.isProvisional) && (
        <polyline
          points={linePoints}
          fill="none" stroke="#C41230" strokeWidth="0" opacity="0"
        />
      )}

      {/* 시작·끝 점 */}
      <circle cx={toX(0)} cy={toY(points[0].value)} r={compact ? 3 : 4} fill="#C41230" />
      <circle
        cx={toX(points.length - 1)} cy={toY(points[points.length - 1].value)}
        r={compact ? 3 : 4}
        fill={points[points.length - 1].isProvisional ? 'white' : '#C41230'}
        stroke="#C41230" strokeWidth="2"
      />

      {/* X축 레이블 */}
      {xLabels.map(({ i, period }) => (
        <text
          key={i} x={toX(i)} y={height - (compact ? 8 : 10)}
          textAnchor="middle" fontSize={compact ? 10 : 11} fill="#A3A3A3"
        >
          {formatLabel(period)}
        </text>
      ))}

      {/* 단위 표시 */}
      {!compact && (
        <text x={PAD.left - 8} y={PAD.top - 6} textAnchor="end" fontSize="10" fill="#C4C4C4">
          ({unit})
        </text>
      )}
    </svg>
  );
}
