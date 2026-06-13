import { auth } from '@/auth';
import AdminSidebar from '@/app/ui/admin/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const cmsRole = (session?.user?.cmsRole ?? 'viewer') as string;
  const userName = (session?.user?.name ?? '') as string;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="md:fixed md:inset-y-0 md:w-64">
        <AdminSidebar role={cmsRole} userName={userName} />
      </div>
      <main className="px-4 py-6 md:ml-64 md:flex-1 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}
