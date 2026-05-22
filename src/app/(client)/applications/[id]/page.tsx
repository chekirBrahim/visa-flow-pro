import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationTimeline } from "@/components/applications/application-timeline";
import { ApplicationDocuments } from "@/components/applications/application-documents";
import { ApplicationMessages } from "@/components/applications/application-messages";
import { Badge } from "@/components/ui/badge";
import { getStatusInfo, COUNTRY_FLAGS, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, MessageSquare, Timeline } from "lucide-react";

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) return null;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { id: true, name: true, email: true, avatar: true } },
      country: true,
      visaType: true,
      documents: {
        include: { docType: true },
        orderBy: { uploadedAt: "desc" },
      },
      steps: { orderBy: { order: "asc" } },
      messages: {
        include: { sender: { select: { id: true, name: true, avatar: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      agent: { select: { id: true, name: true, avatar: true } },
    },
  });

  if (!application) notFound();

  // Check access
  if (session.user.role === "CLIENT" && application.clientId !== session.user.id) {
    notFound();
  }

  const statusInfo = getStatusInfo(application.status);
  const completedSteps = application.steps.filter((s) => s.isCompleted).length;
  const progress = application.steps.length > 0
    ? Math.round((completedSteps / application.steps.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl">
            {COUNTRY_FLAGS[application.country.code] ?? "🌍"}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">
                {application.country.name} — {application.visaType.name}
              </h1>
              <Badge className={cn("text-xs", statusInfo.bg, statusInfo.color)}>
                {statusInfo.label}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{application.referenceNumber}</span>
              <span>·</span>
              <span>Soumis le {formatDate(application.createdAt)}</span>
              {application.agent && (
                <>
                  <span>·</span>
                  <span>Agent : {application.agent.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{progress}%</div>
          <div className="text-xs text-muted-foreground">complété</div>
          <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="rounded-2xl bg-muted/50 p-1">
          <TabsTrigger value="timeline" className="rounded-xl gap-2">
            <Clock className="h-4 w-4" />
            Suivi
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl gap-2">
            <FileText className="h-4 w-4" />
            Documents ({application.documents.length})
          </TabsTrigger>
          <TabsTrigger value="messages" className="rounded-xl gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages ({application.messages.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <ApplicationTimeline steps={application.steps} />
        </TabsContent>

        <TabsContent value="documents">
          <ApplicationDocuments
            documents={application.documents}
            applicationId={application.id}
            visaTypeId={application.visaTypeId}
          />
        </TabsContent>

        <TabsContent value="messages">
          <ApplicationMessages
            messages={application.messages}
            applicationId={application.id}
            currentUserId={session.user.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
