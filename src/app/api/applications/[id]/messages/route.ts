import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

const messageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const messages = await prisma.message.findMany({
    where: { applicationId: params.id },
    include: {
      sender: { select: { id: true, name: true, avatar: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark as read
  await prisma.message.updateMany({
    where: {
      applicationId: params.id,
      senderId: { not: session.user.id },
      isRead: false,
    },
    data: { isRead: true, readAt: new Date() },
  });

  return NextResponse.json(apiSuccess(messages));
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  try {
    const body = await req.json();
    const { content } = messageSchema.parse(body);

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      select: { clientId: true, agentId: true },
    });

    if (!application) {
      return NextResponse.json(apiError("Dossier introuvable"), { status: 404 });
    }

    const isOwner = application.clientId === session.user.id;
    const isAgent = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role);

    if (!isOwner && !isAgent) {
      return NextResponse.json(apiError("Accès non autorisé"), { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        applicationId: params.id,
        senderId: session.user.id,
        content,
        type: "TEXT",
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    // Notify the other party
    const notifyUserId = isAgent ? application.clientId : application.agentId;
    if (notifyUserId) {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          applicationId: params.id,
          type: "MESSAGE_RECEIVED",
          title: "Nouveau message",
          body: `${session.user.name ?? "Un utilisateur"} vous a envoyé un message`,
        },
      });
    }

    return NextResponse.json(apiSuccess(message), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Message invalide"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
