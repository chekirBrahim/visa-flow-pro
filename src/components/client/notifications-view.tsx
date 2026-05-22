"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bell, CheckCheck, FileText, MessageSquare,
  AlertCircle, Calendar, DollarSign, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationsViewProps {
  notifications: Notification[];
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  APPLICATION_STATUS: { icon: FileText, color: "bg-blue-500/10 text-blue-500" },
  MESSAGE_RECEIVED: { icon: MessageSquare, color: "bg-teal-500/10 text-teal-500" },
  DOCUMENT_REQUIRED: { icon: AlertCircle, color: "bg-orange-500/10 text-orange-500" },
  APPOINTMENT_SCHEDULED: { icon: Calendar, color: "bg-purple-500/10 text-purple-500" },
  PAYMENT_REQUIRED: { icon: DollarSign, color: "bg-green-500/10 text-green-500" },
  DOCUMENT_APPROVED: { icon: FileText, color: "bg-green-500/10 text-green-500" },
  DOCUMENT_REJECTED: { icon: FileText, color: "bg-red-500/10 text-red-500" },
  SYSTEM: { icon: Info, color: "bg-gray-500/10 text-gray-500" },
};

export function NotificationsView({ notifications: initial }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState(initial);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    await fetch("/api/notifications?markAll=true", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Toutes les notifications marquées comme lues");
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/50 py-16">
        <Bell className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={markAllRead}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tout marquer comme lu
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.SYSTEM;
          const Icon = config.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex gap-4 rounded-2xl border p-4 transition-colors cursor-pointer",
                notif.isRead
                  ? "border-border/50 bg-card"
                  : "border-blue-500/20 bg-blue-500/3"
              )}
              onClick={() => !notif.isRead && markRead(notif.id)}
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                  config.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm", !notif.isRead && "font-semibold")}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {format(new Date(notif.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
