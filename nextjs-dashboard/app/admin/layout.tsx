import AdminSidebar from '@/app/ui/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="md:fixed md:inset-y-0 md:w-64">
        <AdminSidebar />
      </div>
      <main className="px-4 py-6 md:ml-64 md:flex-1 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}
