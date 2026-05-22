import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateReferenceNumber, apiSuccess, apiError } from "@/lib/utils";

const createApplicationSchema = z.object({
  countryId: z.string().cuid(),
  visaTypeId: z.string().cuid(),
  formData: z.record(z.unknown()).optional(),
  travelDateFrom: z.string().optional(),
  travelDateTo: z.string().optional(),
  purpose: z.string().optional(),
});

// GET /api/applications
export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const status = searchParams.get("status");

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "AGENT"].includes(session.user.role);

  const where = {
    ...(isAdmin ? {} : { clientId: session.user.id }),
    ...(status ? { status } : {}),
  };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, avatar: true } },
        country: true,
        visaType: { select: { id: true, name: true, type: true } },
        documents: { select: { id: true, status: true } },
        steps: { orderBy: { order: "asc" } },
        agent: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json(
    apiSuccess({
      applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  );
}

// POST /api/applications
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  try {
    const body = await req.json();
    const data = createApplicationSchema.parse(body);

    // Get visa type with workflow steps
    const visaType = await prisma.visaCountryType.findUnique({
      where: { id: data.visaTypeId },
      include: {
        workflowSteps: { orderBy: { order: "asc" } },
        formTemplate: true,
      },
    });

    if (!visaType) {
      return NextResponse.json(apiError("Type de visa introuvable"), { status: 404 });
    }

    const referenceNumber = generateReferenceNumber();

    // Create application with workflow steps
    const application = await prisma.application.create({
      data: {
        referenceNumber,
        clientId: session.user.id,
        countryId: data.countryId,
        visaTypeId: data.visaTypeId,
        formTemplateId: visaType.formTemplateId,
        status: "SUBMITTED",
        formData: data.formData ?? {},
        travelDateFrom: data.travelDateFrom ? new Date(data.travelDateFrom) : undefined,
        travelDateTo: data.travelDateTo ? new Date(data.travelDateTo) : undefined,
        purpose: data.purpose,
        submittedAt: new Date(),
        totalAmount: visaType.agencyFee + visaType.consularFee,
        steps: {
          create: visaType.workflowSteps.map((step) => ({
            workflowStepId: step.id,
            name: step.name,
            order: step.order,
          })),
        },
      },
      include: {
        country: true,
        visaType: true,
        steps: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        applicationId: application.id,
        action: "APPLICATION_CREATED",
        entity: "Application",
        entityId: application.id,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        applicationId: application.id,
        type: "STATUS_CHANGE",
        title: "Demande soumise avec succès",
        body: `Votre demande de visa ${application.country.name} (${application.referenceNumber}) a été soumise et sera traitée dans les plus brefs délais.`,
      },
    });

    return NextResponse.json(apiSuccess(application, "Demande créée avec succès"), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        apiError("Données invalides", "VALIDATION_ERROR", error.errors),
        { status: 400 }
      );
    }
    console.error("Create application error:", error);
    return NextResponse.json(apiError("Erreur interne"), { status: 500 });
  }
}
