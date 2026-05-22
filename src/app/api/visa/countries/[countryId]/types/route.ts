import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: { countryId: string } }
) {
  try {
    const types = await prisma.visaCountryType.findMany({
      where: { countryId: params.countryId, isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        processingDays: true,
        agencyFee: true,
        consularFee: true,
        isMultipleEntry: true,
        maxStay: true,
        validity: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(apiSuccess(types));
  } catch {
    return NextResponse.json(apiError("Erreur serveur"), { status: 500 });
  }
}
