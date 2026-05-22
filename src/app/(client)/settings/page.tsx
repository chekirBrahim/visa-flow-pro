import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/client/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
      dateOfBirth: true,
      nationality: true,
      passportNumber: true,
      passportExpiry: true,
      cinNumber: true,
      address: true,
      city: true,
      language: true,
      darkMode: true,
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre profil et vos préférences</p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
