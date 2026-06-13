import { cmsFeatures } from '@/app/lib/cms/sample-data';
import { permissionLabels, roleLabels, rolePermissions } from '@/app/lib/cms/permissions';
import type { CmsRole } from '@/app/lib/cms/definitions';
import { SectionHeader } from '@/app/ui/admin/section-header';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const roles = Object.keys(roleLabels) as CmsRole[];

const decisionLabels = {
  build: '개발',
  phase_2: '2차',
  phase_3: '3차',
  hold: '보류',
};

export default function SettingsPage() {
  return (
    <>
      <SectionHeader
        title="권한과 개발 범위"
        description="관리자 역할별 권한과 CMS 기능 개발 여부를 확인하고, 이후 Supabase RLS 정책과 연결합니다."
      />

      <section className="rounded-md border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
          <ShieldCheckIcon className="h-5 w-5 text-slate-500" />
          <h2 className="font-semibold text-slate-950">역할별 권한</h2>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          {roles.map((role) => (
            <article key={role} className="rounded-md bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-950">{roleLabels[role]}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {rolePermissions[role].length > 0 ? (
                  rolePermissions[role].map((permission) => (
                    <span key={permission} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {permissionLabels[permission]}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">권한 없음</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-slate-950">기능 개발 여부</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">영역</th>
                <th className="px-4 py-3">기능</th>
                <th className="px-4 py-3">결정</th>
                <th className="px-4 py-3">우선순위</th>
                <th className="px-4 py-3">이유</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cmsFeatures.map((feature) => (
                <tr key={feature.id}>
                  <td className="px-4 py-4 text-slate-600">{feature.area}</td>
                  <td className="px-4 py-4 font-medium text-slate-950">{feature.title}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {decisionLabels[feature.decision]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{feature.priority}</td>
                  <td className="max-w-xl px-4 py-4 text-slate-600">{feature.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
