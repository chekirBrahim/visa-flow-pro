import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ROLE_STYLES: Record<string, { label: string; className: string }> = {
  CLIENT:      { label: "Client",      className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  AGENT:       { label: "Agent",       className: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  ADMIN:       { label: "Admin",       className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  SUPER_ADMIN: { label: "Super Admin", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session) return null;

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">{users.length} utilisateurs inscrits</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Utilisateur</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Rôle</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Téléphone</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Dossiers</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((user) => {
              const roleInfo = ROLE_STYLES[user.role] ?? ROLE_STYLES.CLIENT;
              return (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar ?? undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                          {getInitials(user.name ?? user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge className={cn("text-xs border", roleInfo.className)}>
                      {roleInfo.label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{user.phone ?? "—"}</td>
                  <td className="px-5 py-3.5 font-medium">{user._count.applications}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      user.isActive
                        ? "bg-teal-500/10 text-teal-500"
                        : "bg-red-500/10 text-red-500"
                    )}>
                      {user.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
