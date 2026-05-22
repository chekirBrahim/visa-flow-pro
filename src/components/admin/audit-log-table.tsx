"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Filter, Shield, User, FileText, Settings, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn, getInitials } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
}

interface AuditLogTableProps {
  logs: AuditLog[];
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-500/10 text-green-500 border-green-500/20",
  UPDATE: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
  LOGIN: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  LOGOUT: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  VIEW: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  EXPORT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const ENTITY_ICONS: Record<string, React.ElementType> = {
  User: User,
  Application: FileText,
  Setting: Settings,
  Auth: Shield,
};

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const uniqueActions = [...new Set(logs.map((l) => l.action))];
  const uniqueEntities = [...new Set(logs.map((l) => l.entity))];

  const filtered = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchEntity = entityFilter === "all" || log.entity === entityFilter;
    return matchSearch && matchAction && matchEntity;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes actions</SelectItem>
            {uniqueActions.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Entité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes entités</SelectItem>
            {uniqueEntities.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entité</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Aucun log trouvé
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => {
                const EntityIcon = ENTITY_ICONS[log.entity] ?? FileText;
                return (
                  <TableRow key={log.id} className="border-border/50">
                    <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {format(new Date(log.createdAt), "dd/MM/yy HH:mm:ss", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={log.user.avatar ?? undefined} />
                            <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                              {getInitials(log.user.name ?? log.user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{log.user.name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground truncate">{log.user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Système</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold",
                          ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <EntityIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{log.entity}</span>
                        {log.entityId && (
                          <span className="text-xs text-muted-foreground font-mono">
                            #{log.entityId.slice(-6)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {log.ipAddress ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {filtered.length} résultats sur {logs.length} entrées
      </p>
    </div>
  );
}
