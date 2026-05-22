import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, COUNTRY_FLAGS, formatRelativeDate, getStatusInfo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await auth();
  if (!session) return null;

  const applications = await prisma.application.findMany({
    where: { clientId: session.user.id },
    include: {
      country: true,
      visaType: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { name: true } } },
      },
      _count: {
        select: {
          messages: {
            where: {
              isRead: false,
              senderId: { not: session.user.id },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communications avec votre conseiller</p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/20 py-20 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">Aucun dossier actif pour l'instant</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/50 divide-y divide-border/30">
          {applications.map((app) => {
            const lastMessage = app.messages[0];
            const unreadCount = app._count.messages;
            const statusInfo = getStatusInfo(app.status);

            return (
              <Link
                key={app.id}
                href={`/applications/${app.id}?tab=messages`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                {/* Country flag */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
                  {COUNTRY_FLAGS[app.country.code] ?? "🌍"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">
                      {app.country.name} — {app.visaType.name}
                    </span>
                    <Badge className={cn("text-xs flex-shrink-0", statusInfo.bg, statusInfo.color)}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground truncate">
                    {lastMessage
                      ? `${lastMessage.sender.name ?? "Vous"}: ${lastMessage.content}`
                      : "Démarrez la conversation"}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeDate(lastMessage.createdAt)}
                    </span>
                  )}
                  {unreadCount > 0 ? (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
