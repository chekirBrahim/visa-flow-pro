import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";
import { hash } from "bcryptjs";
import crypto from "crypto";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = schema.parse(body);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expires: { gt: new Date() },
      },
    });

    if (!record) {
      return NextResponse.json(
        apiError("Token invalide ou expiré"),
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: record.identifier },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: record.identifier,
            token: hashedToken,
          },
        },
      }),
    ]);

    return NextResponse.json(apiSuccess({ message: "Mot de passe mis à jour" }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Données invalides"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
