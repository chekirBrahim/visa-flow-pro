"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MoreHorizontal, Eye, UserCheck, MessageSquare,
  Download, Search, Filter, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn, getStatusInfo, COUNTRY_FLAGS, formatDate, getInitials } from "@/lib/utils";

interface Application {
  id: string;
  referenceNumber: string;
  status: string;
  createdAt: Date;
  priority: number;
  client: { name?: string | null; email: string; avatar?: string | null };
  country: { name: string; code: string };
  visaType: { name: string };
  agent?: { name?: string | null } | null;
}

interface AdminApplicationsTableProps {
  applications: Application[];
}

const STATUS_OPTIONS = [
  "Tous",
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "DOCUMENTS_REQUESTED",
  "IN_PROCESS", "APPROVED", "REJECTED",
];

export function AdminApplicationsTable({ applications }: AdminApplicationsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");

  const filtered = applications
    .filter((app) => {
      const searchLower = search.toLowerCase();
      if (search && !app.referenceNumber.toLowerCase().includes(searchLower) &&
          !app.client.name?.toLowerCase().includes(searchLower) &&
          !app.client.email.toLowerCase().includes(searchLower) &&
          !app.country.name.toLowerCase().includes(searchLower)) {
        return false;
      }
      if (statusFilter !== "Tous" && app.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.status.localeCompare(b.status);
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/50 px-5 py-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-xl border-border/50 bg-muted/30 pl-9 text-sm"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-48 rounded-xl border-border/50 bg-muted/30 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "Tous" ? "Tous les statuts" : getStatusInfo(s).label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2">
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Référence</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Client</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Destination</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Agent</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map((app, index) => {
              const statusInfo = getStatusInfo(app.status);
              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Reference */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {app.priority > 1 && (
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          app.priority === 3 ? "bg-red-500 animate-pulse" : "bg-amber-500"
                        )} />
                      )}
                      <span className="font-mono text-xs font-medium">{app.referenceNumber}</span>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={app.client.avatar ?? undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
                          {getInitials(app.client.name ?? app.client.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{app.client.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{app.client.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Country */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span>{COUNTRY_FLAGS[app.country.code] ?? "🌍"}</span>
                      <div>
                        <div className="font-medium">{app.country.name}</div>
                        <div className="text-xs text-muted-foreground">{app.visaType.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <Badge className={cn("text-xs", statusInfo.bg, statusInfo.color)}>
                      {statusInfo.label}
                    </Badge>
                  </td>

                  {/* Agent */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-muted-foreground">
                      {app.agent?.name ?? "Non assigné"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/applications/${app.id}`} className="gap-2">
                            <Eye className="h-4 w-4" />
                            Voir le dossier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <UserCheck className="h-4 w-4" />
                          Assigner un agent
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Envoyer un message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          Générer PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Aucun dossier trouvé
          </div>
        )}
      </div>
    </div>
  );
}
