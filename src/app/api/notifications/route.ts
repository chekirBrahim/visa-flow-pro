import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return NextResponse.json(apiSuccess({ notifications, unreadCount }));
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const { searchParams } = new URL(req.url);
  const markAll = searchParams.get("markAll") === "true";

  if (markAll) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json(apiSuccess({ message: "Toutes les notifications marquées comme lues" }));
  }

  const body = await req.json();
  const { ids } = body as { ids: string[] };

  if (!ids?.length) {
    return NextResponse.json(apiError("IDs manquants"), { status: 400 });
  }

  await prisma.notification.updateMany({
    where: { id: { in: ids }, userId: session.user.id },
    data: { isRead: true },
  });

  return NextResponse.json(apiSuccess({ message: "Notifications mises à jour" }));
}
