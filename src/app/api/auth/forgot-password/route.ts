import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";
import crypto from "crypto";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(apiSuccess({ message: "Email envoyé si le compte existe" }));
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: crypto.createHash("sha256").update(token).digest("hex"),
        expires,
      },
    });

    // TODO: Send email via Resend
    // await resend.emails.send({
    //   from: "noreply@visaflowpro.tn",
    //   to: email,
    //   subject: "Réinitialisation de votre mot de passe",
    //   html: `<a href="${process.env.NEXTAUTH_URL}/reset-password?token=${token}">Réinitialiser</a>`,
    // });

    console.log(`[ForgotPassword] Reset link: /reset-password?token=${token}`);

    return NextResponse.json(apiSuccess({ message: "Email envoyé si le compte existe" }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(apiError("Email invalide"), { status: 400 });
    }
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
