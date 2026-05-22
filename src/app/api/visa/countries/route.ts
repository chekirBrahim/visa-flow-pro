import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const countries = await prisma.visaCountry.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
        flag: true,
        processingDays: true,
        agencyFee: true,
        consularFee: true,
        isFeatured: true,
        sortOrder: true,
        _count: { select: { applications: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(apiSuccess(countries));
  } catch (error) {
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
