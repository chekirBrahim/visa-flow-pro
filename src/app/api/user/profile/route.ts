import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
  cinNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  nationality: z.string().optional(),
  language: z.string().optional(),
  darkMode: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json(apiError("Non autorisé"), { status: 401 });

  try {
    const body = await req.json();
    const data = profileSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        name: data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : undefined,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json(apiSuccess(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Données invalides"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
