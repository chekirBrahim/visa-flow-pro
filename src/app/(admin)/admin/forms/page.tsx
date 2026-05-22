import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FormBuilder } from "@/components/admin/form-builder";

export default async function AdminFormsPage() {
  const session = await auth();
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
    return null;
  }

  const templates = await prisma.formTemplate.findMany({
    include: {
      fields: { orderBy: { order: "asc" } },
      visaType: {
        include: { country: true },
      },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Constructeur de Formulaires</h1>
        <p className="text-muted-foreground">
          Créez et gérez les formulaires de demande de visa sans coder
        </p>
      </div>
      <FormBuilder templates={templates} />
    </div>
  );
}
