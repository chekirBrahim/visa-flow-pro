"use client";

import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  totalApplications: number;
  activeApplications: number;
  approvedApplications: number;
  unreadMessages: number;
}

export function DashboardStats({
  totalApplications,
  activeApplications,
  approvedApplications,
  unreadMessages,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total dossiers",
      value: totalApplications,
      icon: FileText,
      change: "+2 ce mois",
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      label: "Dossiers actifs",
      value: activeApplications,
      icon: Clock,
      change: "En traitement",
      gradient: "from-amber-500/10 to-orange-600/5",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      border: "border-amber-500/20",
    },
    {
      label: "Visas approuvés",
      value: approvedApplications,
      icon: CheckCircle2,
      change: `${totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0}% de succès`,
      gradient: "from-teal-500/10 to-emerald-600/5",
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-400",
      border: "border-teal-500/20",
    },
    {
      label: "Messages non lus",
      value: unreadMessages,
      icon: MessageSquare,
      change: unreadMessages > 0 ? "Nouveaux messages" : "Tout lu",
      gradient: "from-violet-500/10 to-purple-600/5",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      border: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all hover:shadow-lg",
            stat.gradient,
            stat.border
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">{stat.value}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-teal-500" />
                {stat.change}
              </p>
            </div>
            <div className={cn("rounded-xl p-2.5", stat.iconBg)}>
              <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
