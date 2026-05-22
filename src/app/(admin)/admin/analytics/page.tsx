import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminAnalytics } from "@/components/admin/admin-analytics";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return null;
  }

  const now = new Date();
  const startOf12Months = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const [
    totalApplications,
    approvedApplications,
    rejectedApplications,
    totalRevenue,
    applicationsByMonth,
    applicationsByCountry,
    applicationsByStatus,
    avgProcessingTime,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }),
    prisma.application.groupBy({
      by: ["createdAt"],
      _count: true,
      where: { createdAt: { gte: startOf12Months } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.application.groupBy({
      by: ["countryCode"],
      _count: true,
      orderBy: { _count: { countryCode: "desc" } },
      take: 7,
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.$queryRaw<{ avg: number }[]>`
      SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400)::float as avg
      FROM applications
      WHERE status IN ('APPROVED', 'REJECTED')
    `,
  ]);

  const stats = {
    totalApplications,
    approvedApplications,
    rejectedApplications,
    successRate: totalApplications > 0
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    avgProcessingDays: Math.round(avgProcessingTime[0]?.avg ?? 0),
    applicationsByCountry,
    applicationsByStatus,
  };

  // Build monthly data for chart
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    const count = applicationsByMonth.filter((a) => {
      const aDate = new Date(a.createdAt);
      return aDate.getMonth() === d.getMonth() && aDate.getFullYear() === d.getFullYear();
    }).reduce((sum, a) => sum + a._count, 0);
    monthlyData.push({ month: label, count });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Rapports</h1>
        <p className="text-muted-foreground">Analyse de la performance de la plateforme</p>
      </div>
      <AdminAnalytics stats={stats} monthlyData={monthlyData} />
    </div>
  );
}
