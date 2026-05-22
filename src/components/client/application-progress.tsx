"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusInfo, COUNTRY_FLAGS } from "@/lib/utils";

interface ApplicationProgressProps {
  application: {
    id: string;
    referenceNumber: string;
    status: string;
    country: { code: string; name: string };
    visaType: { name: string };
    documents: { status: string }[];
    steps: { id: string; name: string; isCompleted: boolean; order: number }[];
  };
}

export function ApplicationProgress({ application }: ApplicationProgressProps) {
  const statusInfo = getStatusInfo(application.status);
  const totalDocs = application.documents.length;
  const approvedDocs = application.documents.filter(d => d.status === "APPROVED").length;
  const completedSteps = application.steps.filter(s => s.isCompleted).length;
  const totalSteps = application.steps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Link href={`/applications/${application.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="group rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-xl">
              {COUNTRY_FLAGS[application.country.code] ?? "🌍"}
            </div>
            <div>
              <h3 className="font-semibold leading-tight">
                {application.country.name} — {application.visaType.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Réf. {application.referenceNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", statusInfo.bg, statusInfo.color)}>
              {statusInfo.label}
            </Badge>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Avancement global</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
            />
          </div>
        </div>

        {/* Steps mini-timeline */}
        <div className="flex items-center gap-1">
          {application.steps.slice(0, 6).map((step, index) => (
            <div key={step.id} className="flex items-center gap-1">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  step.isCompleted ? "bg-teal-500" : "bg-muted-foreground/30"
                )}
              />
              {index < Math.min(application.steps.length, 6) - 1 && (
                <div className={cn("h-px w-3", step.isCompleted ? "bg-teal-500/50" : "bg-muted/50")} />
              )}
            </div>
          ))}
          {application.steps.length > 6 && (
            <span className="ml-1 text-xs text-muted-foreground">
              +{application.steps.length - 6}
            </span>
          )}
        </div>

        {/* Documents */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
          <span>
            {approvedDocs}/{totalDocs} documents validés
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
