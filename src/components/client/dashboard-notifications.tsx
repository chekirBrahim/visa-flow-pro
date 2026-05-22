"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, ArrowRight, CheckCircle2, MessageSquare, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeDate } from "@/lib/utils";

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  STATUS_CHANGE: CheckCircle2,
  DOCUMENT_REQUESTED: FileText,
  MESSAGE_RECEIVED: MessageSquare,
  DOCUMENT_REJECTED: AlertCircle,
  DEFAULT: Bell,
};

interface DashboardNotificationsProps {
  notifications: {
    id: string;
    type: string;
    title: string;
    body: string;
    createdAt: Date;
    isRead: boolean;
  }[];
}

export function DashboardNotifications({ notifications }: DashboardNotificationsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Notifications</span>
          {notifications.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15 text-xs font-medium text-blue-400">
              {notifications.length}
            </span>
          )}
        </div>
        <Link href="/notifications">
          <Button variant="ghost" size="sm" className="h-7 gap-1 rounded-lg text-xs">
            Voir tout
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border/30">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bell className="mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const Icon = NOTIFICATION_ICONS[notification.type] ?? NOTIFICATION_ICONS.DEFAULT;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  "flex gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40",
                  !notification.isRead && "bg-blue-500/3"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl",
                  notification.type === "DOCUMENT_REJECTED"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-blue-500/15 text-blue-400"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notification.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {formatRelativeDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
