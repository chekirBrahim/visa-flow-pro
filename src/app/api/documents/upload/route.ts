import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(apiError("Non autorisé"), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const applicationId = formData.get("applicationId") as string | null;
    const documentType = formData.get("documentType") as string | null;

    if (!file) {
      return NextResponse.json(apiError("Fichier manquant"), { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        apiError("Fichier trop volumineux (max 10 MB)"),
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        apiError("Type de fichier non autorisé (PDF, JPEG, PNG, WebP uniquement)"),
        { status: 400 }
      );
    }

    if (!applicationId) {
      return NextResponse.json(apiError("ID de dossier manquant"), { status: 400 });
    }

    // Verify the application belongs to the user (or user is admin/agent)
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
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

    // In production, upload to Cloudinary or UploadThing here
    // For now, we create a mock URL
    const mockUrl = `/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const document = await prisma.document.create({
      data: {
        applicationId,
        name: file.name,
        type: documentType ?? "OTHER",
        url: mockUrl,
        mimeType: file.type,
        size: file.size,
        status: "PENDING_REVIEW",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        entity: "Document",
        entityId: document.id,
        metadata: { fileName: file.name, type: documentType, applicationId },
      },
    });

    return NextResponse.json(apiSuccess(document));
  } catch {
    return NextResponse.json(apiError("Erreur lors de l'upload"), { status: 500 });
  }
}
