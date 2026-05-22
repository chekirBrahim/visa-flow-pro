import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table";
import { AdminActivityFeed } from "@/components/admin/admin-activity-feed";
import { AdminCountryChart } from "@/components/admin/admin-country-chart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    totalRevenue,
    recentApplications,
    recentAuditLogs,
    applicationsByCountry,
    applicationsByStatus,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "IN_PROCESS"] } } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.application.findMany({
      include: {
        client: { select: { name: true, email: true, avatar: true } },
        country: { select: { name: true, code: true } },
        visaType: { select: { name: true } },
        agent: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.auditLog.findMany({
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.application.groupBy({
      by: ["countryId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 7,
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de l'activité VisaFlow Pro
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
        <AdminStatsGrid
          total={totalApplications}
          pending={pendingApplications}
          approved={approvedApplications}
          rejected={rejectedApplications}
          revenue={totalRevenue._sum.amount ?? 0}
          startOfMonth={startOfMonth}
        />
      </Suspense>

      {/* Charts + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCountryChart data={applicationsByCountry} />
        </div>
        <AdminActivityFeed logs={recentAuditLogs} />
      </div>

      {/* Recent applications */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Dernières demandes</h2>
        <AdminApplicationsTable applications={recentApplications} />
      </div>
    </div>
  );
}
