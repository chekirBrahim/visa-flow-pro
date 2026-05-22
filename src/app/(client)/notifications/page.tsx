import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NotificationsView } from "@/components/client/notifications-view";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          {notifications.filter((n) => !n.isRead).length} non lue(s)
        </p>
      </div>
      <NotificationsView notifications={notifications} />
    </div>
  );
}
