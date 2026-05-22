"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Image, CheckCircle2, XCircle, Clock,
  Eye, Download, Plus, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentUploader } from "./document-uploader";
import { cn, formatFileSize, formatDate } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: string;
  uploadedAt: Date;
  reviewNotes?: string | null;
  docType?: { name: string } | null;
}

interface ApplicationDocumentsProps {
  documents: Document[];
  applicationId: string;
  visaTypeId: string;
}

const STATUS_MAP = {
  PENDING: { label: "En attente", color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
  UPLOADED: { label: "Uploadé", color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
  UNDER_REVIEW: { label: "En vérification", color: "text-violet-500", bg: "bg-violet-500/10", icon: Clock },
  APPROVED: { label: "Validé", color: "text-teal-500", bg: "bg-teal-500/10", icon: CheckCircle2 },
  REJECTED: { label: "Refusé", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
  EXPIRED: { label: "Expiré", color: "text-gray-500", bg: "bg-gray-500/10", icon: AlertCircle },
};

export function ApplicationDocuments({
  documents,
  applicationId,
  visaTypeId,
}: ApplicationDocumentsProps) {
  const [showUploader, setShowUploader] = useState(false);

  const approved = documents.filter((d) => d.status === "APPROVED").length;
  const rejected = documents.filter((d) => d.status === "REJECTED").length;
  const pending = documents.filter((d) => d.status === "PENDING" || d.status === "UPLOADED").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Validés", count: approved, color: "text-teal-500", bg: "bg-teal-500/10" },
          { label: "En attente", count: pending, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Refusés", count: rejected, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((item) => (
          <div
            key={item.label}
            className={cn("rounded-2xl border border-border/50 p-4 text-center", item.bg)}
          >
            <div className={cn("text-2xl font-bold", item.color)}>{item.count}</div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Documents list */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <span className="text-sm font-medium">
            Documents ({documents.length})
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl text-xs"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </Button>
        </div>

        {showUploader && (
          <div className="border-b border-border/50 p-5">
            <DocumentUploader
              visaTypeId={visaTypeId}
              applicationId={applicationId}
            />
          </div>
        )}

        <div className="divide-y divide-border/30">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Aucun document uploadé
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4 rounded-xl gap-2"
                onClick={() => setShowUploader(true)}
              >
                <Plus className="h-4 w-4" />
                Ajouter un document
              </Button>
            </div>
          ) : (
            documents.map((doc, index) => {
              const statusInfo = STATUS_MAP[doc.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.PENDING;
              const StatusIcon = statusInfo.icon;
              const isImage = doc.mimeType.startsWith("image/");

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                      doc.status === "APPROVED"
                        ? "bg-teal-500/10 text-teal-500"
                        : doc.status === "REJECTED"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isImage ? (
                      <Image className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {doc.docType?.name ?? doc.originalName}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>·</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                    {doc.reviewNotes && doc.status === "REJECTED" && (
                      <p className="mt-1 text-xs text-red-500">{doc.reviewNotes}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", statusInfo.bg, statusInfo.color)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusInfo.label}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        asChild
                      >
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        asChild
                      >
                        <a href={doc.fileUrl} download={doc.originalName}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
