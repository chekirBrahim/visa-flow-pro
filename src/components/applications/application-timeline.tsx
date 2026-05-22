"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Step {
  id: string;
  name: string;
  order: number;
  isCompleted: boolean;
  completedAt?: Date | null;
  notes?: string | null;
}

interface ApplicationTimelineProps {
  steps: Step[];
}

export function ApplicationTimeline({ steps }: ApplicationTimelineProps) {
  const currentIndex = steps.findIndex((s) => !s.isCompleted);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
      <h3 className="mb-6 text-base font-semibold">Suivi de votre dossier</h3>

      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const isCompleted = step.isCompleted;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[18px] top-9 h-full w-px",
                    isCompleted
                      ? "bg-gradient-to-b from-teal-500 to-teal-500/30"
                      : "bg-border/40"
                  )}
                />
              )}

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                {isCompleted ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-teal-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-500 ring-4 ring-blue-500/10">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <Circle className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-center justify-between gap-4">
                  <h4
                    className={cn(
                      "text-sm font-medium",
                      isCompleted
                        ? "text-foreground"
                        : isCurrent
                        ? "text-blue-500 font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </h4>
                  {isCompleted && step.completedAt && (
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(step.completedAt)}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                      En cours
                    </span>
                  )}
                </div>
                {step.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">{step.notes}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {steps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Clock className="mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm">Les étapes seront affichées après soumission</p>
        </div>
      )}
    </div>
  );
}
