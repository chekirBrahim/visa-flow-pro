"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusInfo, COUNTRY_FLAGS, formatDate } from "@/lib/utils";

interface RecentApplicationsProps {
  applications: {
    id: string;
    referenceNumber: string;
    status: string;
    createdAt: Date;
    country: { code: string; name: string };
    visaType: { name: string };
  }[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/20 py-16 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h3 className="mb-2 font-semibold">Aucune demande pour l'instant</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Commencez votre première demande de visa en quelques minutes.
        </p>
        <Link href="/applications/new">
          <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
        <span className="text-sm font-medium">Toutes les demandes</span>
        <Link href="/applications">
          <Button variant="ghost" size="sm" className="h-7 gap-1 rounded-lg text-xs">
            Voir tout
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border/30">
        {applications.map((app, index) => {
          const statusInfo = getStatusInfo(app.status);
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/applications/${app.id}`}
                className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                  {COUNTRY_FLAGS[app.country.code] ?? "🌍"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {app.country.name} — {app.visaType.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{app.referenceNumber}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", statusInfo.bg, statusInfo.color)}>
                    {statusInfo.label}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
