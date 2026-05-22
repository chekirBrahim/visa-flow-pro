"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeDate, getInitials } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  createdAt: Date;
  user?: { name?: string | null; avatar?: string | null } | null;
}

interface AdminActivityFeedProps {
  logs: AuditLog[];
}

const ACTION_LABELS: Record<string, string> = {
  APPLICATION_CREATED: "a créé un dossier",
  APPLICATION_UPDATED: "a mis à jour un dossier",
  STATUS_CHANGED: "a changé le statut",
  DOCUMENT_UPLOADED: "a uploadé un document",
  MESSAGE_SENT: "a envoyé un message",
  USER_REGISTERED: "s'est inscrit",
  USER_LOGOUT: "s'est déconnecté",
};

export function AdminActivityFeed({ logs }: AdminActivityFeedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3.5">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Activité récente</span>
      </div>

      <div className="divide-y divide-border/30">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Aucune activité récente
          </div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 px-5 py-3"
            >
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarImage src={log.user?.avatar ?? undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                  {log.user?.name ? getInitials(log.user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed">
                  <span className="font-medium">{log.user?.name ?? "Système"}</span>
                  {" "}
                  <span className="text-muted-foreground">
                    {ACTION_LABELS[log.action] ?? log.action.toLowerCase().replace(/_/g, " ")}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/60">
                  {formatRelativeDate(log.createdAt)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
