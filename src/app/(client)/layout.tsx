import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ClientSidebar } from "@/components/client/client-sidebar";
import { ClientHeader } from "@/components/client/client-header";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ClientSidebar user={session.user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ClientHeader user={session.user} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
