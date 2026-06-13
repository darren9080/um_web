import type { ComponentType, SVGProps } from 'react';

type MetricCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function MetricCard({ title, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
