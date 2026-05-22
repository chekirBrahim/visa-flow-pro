"use client";

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, CheckCircle2, XCircle, Clock, DollarSign, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    successRate: number;
    totalRevenue: number;
    avgProcessingDays: number;
    applicationsByCountry: { countryCode: string; _count: number }[];
    applicationsByStatus: { status: string; _count: number }[];
  };
  monthlyData: { month: string; count: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumis",
  DOCUMENTS_PENDING: "Docs manquants",
  DOCUMENTS_REVIEW: "En révision",
  IN_PROCESS: "En traitement",
  EMBASSY_SUBMITTED: "À l'ambassade",
  INTERVIEW_SCHEDULED: "Entretien",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
  READY_FOR_PICKUP: "Prêt",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
  ON_HOLD: "En attente",
};

const STATUS_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1",
];

const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", DE: "🇩🇪", IT: "🇮🇹", ES: "🇪🇸",
  US: "🇺🇸", CA: "🇨🇦", GB: "🇬🇧", UK: "🇬🇧",
};

const KPI_CARDS = [
  {
    key: "totalApplications",
    label: "Total Dossiers",
    icon: FileText,
    color: "from-blue-600 to-blue-400",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "successRate",
    label: "Taux de succès",
    icon: TrendingUp,
    color: "from-green-600 to-green-400",
    format: (v: number) => `${v}%`,
  },
  {
    key: "approvedApplications",
    label: "Approuvés",
    icon: CheckCircle2,
    color: "from-teal-600 to-teal-400",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "rejectedApplications",
    label: "Refusés",
    icon: XCircle,
    color: "from-red-600 to-red-400",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "avgProcessingDays",
    label: "Délai moyen",
    icon: Clock,
    color: "from-orange-600 to-orange-400",
    format: (v: number) => `${v}j`,
  },
  {
    key: "totalRevenue",
    label: "Chiffre d'affaires",
    icon: DollarSign,
    color: "from-purple-600 to-purple-400",
    format: (v: number) => `${v.toLocaleString()} TND`,
  },
];

export function AdminAnalytics({ stats, monthlyData }: StatsProps) {
  const countryChartData = stats.applicationsByCountry.map((c) => ({
    name: `${COUNTRY_FLAGS[c.countryCode] ?? "🌍"} ${c.countryCode}`,
    count: c._count,
  }));

  const statusChartData = stats.applicationsByStatus.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s._count,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats] as number;
          return (
            <div
              key={card.key}
              className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4"
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white flex-shrink-0",
                  card.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.format(value)}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly trend */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold mb-4">Évolution mensuelle (12 mois)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                name="Dossiers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By country */}
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <h3 className="font-semibold mb-4">Dossiers par pays</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={countryChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Dossiers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status distribution */}
      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <h3 className="font-semibold mb-4">Répartition par statut</h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {statusChartData.map((_, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-2 gap-2">
            {statusChartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLORS[index % STATUS_COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                <span className="text-xs font-semibold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
