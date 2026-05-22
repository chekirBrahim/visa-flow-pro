import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const session = await auth();
  if (!session) return null;

  const applications = await prisma.application.findMany({
    include: {
      client: { select: { name: true, email: true, avatar: true } },
      country: { select: { name: true, code: true } },
      visaType: { select: { name: true } },
      agent: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des dossiers</h1>
        <p className="text-muted-foreground">{applications.length} dossiers au total</p>
      </div>
      <AdminApplicationsTable applications={applications} />
    </div>
  );
}
