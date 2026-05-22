"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, Phone, FileText, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const settingsSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  passportNumber: z.string().optional(),
  cinNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  nationality: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  user: {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    passportNumber?: string | null;
    cinNumber?: string | null;
    address?: string | null;
    city?: string | null;
    nationality?: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      passportNumber: user.passportNumber ?? "",
      cinNumber: user.cinNumber ?? "",
      address: user.address ?? "",
      city: user.city ?? "",
      nationality: user.nationality ?? "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Profil mis à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      title: "Informations personnelles",
      icon: User,
      fields: [
        { name: "firstName" as const, label: "Prénom", placeholder: "Mohamed" },
        { name: "lastName" as const, label: "Nom", placeholder: "Ben Ali" },
        { name: "phone" as const, label: "Téléphone", placeholder: "+216 XX XXX XXX" },
        { name: "nationality" as const, label: "Nationalité", placeholder: "Tunisienne" },
      ],
    },
    {
      title: "Adresse",
      icon: Globe,
      fields: [
        { name: "address" as const, label: "Adresse", placeholder: "Rue de la République" },
        { name: "city" as const, label: "Ville", placeholder: "Tunis" },
      ],
    },
    {
      title: "Documents d'identité",
      icon: FileText,
      fields: [
        { name: "passportNumber" as const, label: "N° Passeport", placeholder: "AB123456" },
        { name: "cinNumber" as const, label: "N° CIN", placeholder: "12345678" },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar section */}
      <div className="flex items-center gap-5 rounded-2xl border border-border/50 bg-card p-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar ?? undefined} />
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-xl font-bold text-white">
            {getInitials(user.name ?? user.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user.name ?? user.email}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Button variant="outline" size="sm" className="mt-2 rounded-xl text-xs h-7">
            Changer la photo
          </Button>
        </div>
      </div>

      {/* Form sections */}
      {sections.map((section) => (
        <div key={section.title} className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="flex items-center gap-2.5 border-b border-border/50 px-5 py-4">
            <section.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{section.title}</span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-sm font-medium">{field.label}</Label>
                <Input
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className="h-10 rounded-xl border-border/50 bg-muted/20"
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save button */}
      <Button
        type="submit"
        disabled={!isDirty || isSaving}
        className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white gap-2"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}
