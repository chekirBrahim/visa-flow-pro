import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

const updateSchema = z.object({
  status: z.string().optional(),
  agentId: z.string().cuid().optional(),
  agentNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
  priority: z.number().min(1).max(3).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
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
      payments: true,
      appointments: true,
    },
  });

  if (!application) {
    return NextResponse.json(apiError("Dossier introuvable"), { status: 404 });
  }

  const isOwner = application.clientId === session.user.id;
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role);

  if (!isOwner && !isAdmin) {
    return NextResponse.json(apiError("Accès non autorisé"), { status: 403 });
  }

  return NextResponse.json(apiSuccess(application));
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role);
  if (!isAdmin) {
    return NextResponse.json(apiError("Accès non autorisé"), { status: 403 });
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const existing = await prisma.application.findUnique({
      where: { id: params.id },
      select: { status: true },
    });

    if (!existing) {
      return NextResponse.json(apiError("Dossier introuvable"), { status: 404 });
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.status === "APPROVED" || data.status === "REJECTED"
          ? { completedAt: new Date() }
          : {}),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        applicationId: params.id,
        action: "APPLICATION_UPDATED",
        entity: "Application",
        entityId: params.id,
        before: { status: existing.status },
        after: { status: data.status },
      },
    });

    // Notify client if status changed
    if (data.status && data.status !== existing.status) {
      const updatedApp = await prisma.application.findUnique({
        where: { id: params.id },
        select: { clientId: true },
      });
      if (updatedApp) {
        await prisma.notification.create({
          data: {
            userId: updatedApp.clientId,
            applicationId: params.id,
            type: "STATUS_CHANGE",
            title: "Statut de votre dossier mis à jour",
            body: `Votre dossier a été mis à jour : ${data.status}`,
          },
        });
      }
    }

    return NextResponse.json(apiSuccess(application));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Données invalides"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
