import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (!["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar user={session.user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container max-w-[1400px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
