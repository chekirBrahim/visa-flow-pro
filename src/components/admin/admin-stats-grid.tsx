"use client";

import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle2, XCircle, TrendingUp,
  DollarSign, ArrowUpRight, Users,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface AdminStatsGridProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  revenue: number;
  startOfMonth: Date;
}

export function AdminStatsGrid({
  total, pending, approved, rejected, revenue, startOfMonth,
}: AdminStatsGridProps) {
  const successRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const stats = [
    {
      label: "Total dossiers",
      value: total,
      icon: FileText,
      change: "+12%",
      changePositive: true,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      border: "border-blue-500/15",
    },
    {
      label: "En attente",
      value: pending,
      icon: Clock,
      change: `${pending > 0 ? "Nécessite action" : "À jour"}`,
      changePositive: pending === 0,
      gradient: "from-amber-500/10 to-orange-500/5",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      border: "border-amber-500/15",
    },
    {
      label: "Approuvés",
      value: approved,
      icon: CheckCircle2,
      change: `${successRate}% de succès`,
      changePositive: successRate >= 90,
      gradient: "from-teal-500/10 to-emerald-500/5",
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-400",
      border: "border-teal-500/15",
    },
    {
      label: "Refusés",
      value: rejected,
      icon: XCircle,
      change: `${total > 0 ? Math.round((rejected / total) * 100) : 0}% du total`,
      changePositive: false,
      gradient: "from-red-500/10 to-rose-500/5",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      border: "border-red-500/15",
    },
    {
      label: "Revenus (TND)",
      value: formatCurrency(revenue),
      icon: DollarSign,
      change: "Ce mois",
      changePositive: true,
      gradient: "from-violet-500/10 to-purple-500/5",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-400",
      border: "border-violet-500/15",
      isString: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all hover:shadow-md",
            stat.gradient,
            stat.border
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {stat.isString ? stat.value : (stat.value as number).toLocaleString()}
              </p>
              <p className={cn(
                "mt-1 flex items-center gap-1 text-xs",
                stat.changePositive ? "text-teal-500" : "text-red-400"
              )}>
                <ArrowUpRight className={cn("h-3 w-3", !stat.changePositive && "rotate-180")} />
                {stat.change}
              </p>
            </div>
            <div className={cn("rounded-xl p-2.5", stat.iconBg)}>
              <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
