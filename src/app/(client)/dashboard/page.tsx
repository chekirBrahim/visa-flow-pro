import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardStats } from "@/components/client/dashboard-stats";
import { RecentApplications } from "@/components/client/recent-applications";
import { DashboardNotifications } from "@/components/client/dashboard-notifications";
import { QuickActions } from "@/components/client/quick-actions";
import { ApplicationProgress } from "@/components/client/application-progress";
import { StatsCardSkeleton } from "@/components/ui/skeletons";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const [applications, notifications, unreadMessages] = await Promise.all([
    prisma.application.findMany({
      where: { clientId: session.user.id },
      include: {
        country: true,
        visaType: true,
        documents: { select: { status: true } },
        steps: { orderBy: { order: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id, isRead: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.message.count({
      where: {
        application: { clientId: session.user.id },
        isRead: false,
        senderId: { not: session.user.id },
      },
    }),
  ]);

  const totalApplications = await prisma.application.count({
    where: { clientId: session.user.id },
  });

  const approvedApplications = await prisma.application.count({
    where: { clientId: session.user.id, status: "APPROVED" },
  });

  const activeApplications = applications.filter(
    (a) => !["APPROVED", "REJECTED", "CANCELLED", "DRAFT"].includes(a.status)
  );

  const firstName = session.user.name?.split(" ")[0] ?? "là";

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsCardSkeleton count={4} />}>
        <DashboardStats
          totalApplications={totalApplications}
          activeApplications={activeApplications.length}
          approvedApplications={approvedApplications}
          unreadMessages={unreadMessages}
        />
      </Suspense>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress on active dossiers */}
          {activeApplications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Dossiers actifs</h2>
              <div className="space-y-4">
                {activeApplications.slice(0, 3).map((app) => (
                  <ApplicationProgress key={app.id} application={app} />
                ))}
              </div>
            </div>
          )}

          {/* All recent applications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mes demandes</h2>
            </div>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
              <RecentApplications applications={applications} />
            </Suspense>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DashboardNotifications notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
