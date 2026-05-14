import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-obsidian flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto">{children}</main>
    </div>
  );
}
