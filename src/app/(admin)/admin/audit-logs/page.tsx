import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AuditLogTable } from "@/components/admin/audit-log-table";

export default async function AdminAuditLogsPage() {
  const session = await auth();
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return null;
  }

  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal d&apos;Audit</h1>
        <p className="text-muted-foreground">
          Toutes les actions effectuées sur la plateforme (200 dernières)
        </p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  );
}
