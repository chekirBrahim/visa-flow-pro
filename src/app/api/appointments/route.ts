import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

const appointmentSchema = z.object({
  applicationId: z.string(),
  type: z.enum(["BIOMETRICS", "INTERVIEW", "DOCUMENT_PICKUP", "OTHER"]),
  scheduledAt: z.string().datetime(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const isStaff = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role as string);

  const appointments = await prisma.appointment.findMany({
    where: isStaff
      ? {}
      : {
          application: { userId: session.user.id },
        },
    include: {
      application: {
        select: {
          id: true,
          referenceNumber: true,
          countryCode: true,
          visaType: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(apiSuccess(appointments));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);

    // Verify application access
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      select: { userId: true },
    });

    if (!application) {
      return NextResponse.json(apiError("Dossier introuvable"), { status: 404 });
    }

    const isOwner = application.userId === session.user.id;
    const isStaff = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role as string);

    if (!isOwner && !isStaff) {
      return NextResponse.json(apiError("Accès refusé"), { status: 403 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        applicationId: data.applicationId,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        location: data.location,
        notes: data.notes,
        status: "SCHEDULED",
      },
    });

    // Notify client
    if (isStaff && !isOwner) {
      await prisma.notification.create({
        data: {
          userId: application.userId,
          type: "APPOINTMENT_SCHEDULED",
          title: "Rendez-vous planifié",
          message: `Un rendez-vous a été planifié pour votre dossier.`,
          data: { appointmentId: appointment.id, type: data.type },
        },
      });
    }

    return NextResponse.json(apiSuccess(appointment), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Données invalides"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
