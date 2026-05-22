import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentApplications } from "@/components/client/recent-applications";
import { ApplicationProgress } from "@/components/client/application-progress";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session) return null;

  const applications = await prisma.application.findMany({
    where: { clientId: session.user.id },
    include: {
      country: true,
      visaType: true,
      documents: { select: { status: true } },
      steps: { orderBy: { order: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const active = applications.filter(
    (a) => !["APPROVED", "REJECTED", "CANCELLED", "DRAFT"].includes(a.status)
  );
  const completed = applications.filter((a) =>
    ["APPROVED", "REJECTED", "CANCELLED"].includes(a.status)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes demandes de visa</h1>
          <p className="text-muted-foreground">
            {applications.length} demande{applications.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/applications/new">
          <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Active applications */}
      {active.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dossiers actifs ({active.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((app) => (
              <ApplicationProgress key={app.id} application={app} />
            ))}
          </div>
        </div>
      )}

      {/* All applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Historique complet</h2>
        <RecentApplications applications={applications} />
      </div>
    </div>
  );
}
