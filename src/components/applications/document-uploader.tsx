"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, File, Image, FileText, CheckCircle2,
  AlertCircle, Loader2, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, formatFileSize } from "@/lib/utils";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url?: string;
  status: "uploading" | "done" | "error";
  progress: number;
  docTypeId?: string;
}

interface DocumentUploaderProps {
  visaTypeId: string;
  applicationId?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function DocumentUploader({
  visaTypeId,
  applicationId,
  onUploadComplete,
}: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      status: "uploading",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    for (const uploadedFile of newFiles) {
      // Progress simulation
      for (let progress = 10; progress <= 90; progress += 20) {
        await new Promise((r) => setTimeout(r, 200));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, progress } : f
          )
        );
      }

      try {
        // Real upload would go here
        // const formData = new FormData();
        // formData.append("file", file);
        // formData.append("applicationId", applicationId ?? "");
        // const res = await fetch("/api/documents/upload", { method: "POST", body: formData });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? { ...f, status: "done", progress: 100 }
              : f
          )
        );
        toast.success(`${uploadedFile.name} uploadé avec succès`);
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? { ...f, status: "error", progress: 0 }
              : f
          )
        );
        toast.error(`Échec de l'upload de ${uploadedFile.name}`);
      }
    }
  }, [applicationId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error("Fichier trop volumineux (max 10 MB)");
          } else if (error.code === "file-invalid-type") {
            toast.error("Format non accepté (PDF, JPG, PNG uniquement)");
          }
        });
      });
    },
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType === "application/pdf") return FileText;
    return File;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Documents justificatifs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Uploadez vos documents. Formats acceptés : PDF, JPG, PNG (max 10 MB)
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-blue-500 bg-blue-500/5 scale-[1.01]"
            : "border-border/50 hover:border-border hover:bg-muted/20"
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted"
        >
          <Upload className={cn("h-7 w-7 transition-colors", isDragActive ? "text-blue-500" : "text-muted-foreground")} />
        </motion.div>

        <h3 className="mb-2 text-base font-semibold">
          {isDragActive ? "Déposez vos fichiers ici" : "Glissez-déposez vos documents"}
        </h3>
        <p className="text-sm text-muted-foreground">
          ou{" "}
          <span className="text-blue-500 hover:underline">cliquez pour parcourir</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          PDF, JPG, PNG · Max 10 MB par fichier
        </p>
      </div>

      {/* Files list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium">Fichiers ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.mimeType);
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={cn(
                      "flex items-center gap-3 overflow-hidden rounded-2xl border p-3 pr-4",
                      file.status === "error"
                        ? "border-red-500/30 bg-red-500/5"
                        : file.status === "done"
                        ? "border-teal-500/30 bg-teal-500/5"
                        : "border-border/50 bg-card"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                      file.status === "error" ? "bg-red-500/10 text-red-400" :
                      file.status === "done" ? "bg-teal-500/10 text-teal-400" :
                      "bg-muted text-muted-foreground"
                    )}>
                      <FileIcon className="h-5 w-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{file.name}</span>
                        {file.status === "done" && (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-teal-500" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </div>
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-1" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {file.status === "uploading" && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {file.status === "done" && file.url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
