import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CountriesManager } from "@/components/admin/countries-manager";

export default async function AdminCountriesPage() {
  const session = await auth();
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return null;
  }

  const countries = await prisma.visaCountry.findMany({
    include: {
      types: {
        orderBy: { name: "asc" },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pays & Types de Visa</h1>
        <p className="text-muted-foreground">
          Gérez les pays couverts et configurez les types de visa disponibles
        </p>
      </div>
      <CountriesManager countries={countries} />
    </div>
  );
}
