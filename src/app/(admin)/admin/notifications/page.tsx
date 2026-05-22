import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminNotificationsPage() {
  const session = await auth();
  if (!session || !["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role as string)) {
    return null;
  }

  const recentNotifications = await prisma.notification.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadTotal = await prisma.notification.count({ where: { isRead: false } });
  const usersCount = await prisma.user.count({ where: { role: "CLIENT" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Gestion des alertes et notifications clients</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2.5">
            <Bell className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">{unreadTotal} non lues</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-2.5">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">{usersCount} clients</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="border-b border-border/50 px-5 py-4">
          <span className="text-sm font-medium">Notifications récentes</span>
        </div>
        <div className="divide-y divide-border/30">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Bell className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            recentNotifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div
                  className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    notif.isRead ? "bg-muted" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                      {notif.user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          → {notif.user.name ?? notif.user.email}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">{notif.type}</Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(notif.createdAt), "d MMM HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
