import { headers } from 'next/headers';
import { auth } from '@/auth';
import AdminSidebar from '@/app/ui/admin/admin-sidebar';
import type { SidebarMode } from '@/app/ui/admin/admin-sidebar';

function getSidebarMode(host: string): SidebarMode {
  const bare = host.split(':')[0];
  if (bare.startsWith('cms.')) return 'cms';
  if (bare.startsWith('admin.')) return 'admin';
  return 'all';
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, headersList] = await Promise.all([auth(), headers()]);
  const host = headersList.get('host') ?? '';
  const cmsRole = (session?.user?.cmsRole ?? 'viewer') as string;
  const userName = (session?.user?.name ?? '') as string;
  const mode = getSidebarMode(host);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="md:fixed md:inset-y-0 md:w-64">
        <AdminSidebar role={cmsRole} userName={userName} mode={mode} />
      </div>
      <main className="px-4 py-6 md:ml-64 md:flex-1 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}
