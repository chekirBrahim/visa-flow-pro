"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormField {
  id: string;
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  options?: { value: string; label: string }[];
  section?: string;
}

interface ApplicationFormProps {
  visaTypeId: string;
  initialData?: Record<string, unknown>;
  onDataChange: (data: Record<string, unknown>) => void;
}

// Default fields when no template is configured
const DEFAULT_FIELDS: FormField[] = [
  // Personal Info
  { id: "1", key: "firstName", label: "Prénom", type: "TEXT", placeholder: "Mohamed", isRequired: true, section: "Informations personnelles" },
  { id: "2", key: "lastName", label: "Nom de famille", type: "TEXT", placeholder: "Ben Ali", isRequired: true, section: "Informations personnelles" },
  { id: "3", key: "dateOfBirth", label: "Date de naissance", type: "DATE", isRequired: true, section: "Informations personnelles" },
  { id: "4", key: "placeOfBirth", label: "Lieu de naissance", type: "TEXT", placeholder: "Tunis", isRequired: true, section: "Informations personnelles" },
  { id: "5", key: "nationality", label: "Nationalité", type: "TEXT", placeholder: "Tunisienne", isRequired: true, section: "Informations personnelles" },
  { id: "6", key: "maritalStatus", label: "Situation matrimoniale", type: "SELECT", isRequired: true, section: "Informations personnelles",
    options: [{ value: "single", label: "Célibataire" }, { value: "married", label: "Marié(e)" }, { value: "divorced", label: "Divorcé(e)" }, { value: "widowed", label: "Veuf/Veuve" }] },
  // Passport
  { id: "7", key: "passportNumber", label: "Numéro de passeport", type: "TEXT", placeholder: "AB123456", isRequired: true, section: "Documents d'identité" },
  { id: "8", key: "passportIssueDate", label: "Date de délivrance", type: "DATE", isRequired: true, section: "Documents d'identité" },
  { id: "9", key: "passportExpiry", label: "Date d'expiration", type: "DATE", isRequired: true, section: "Documents d'identité" },
  { id: "10", key: "passportIssuedBy", label: "Délivré par", type: "TEXT", placeholder: "Consulat de Tunis", isRequired: true, section: "Documents d'identité" },
  { id: "11", key: "cinNumber", label: "N° CIN", type: "TEXT", placeholder: "12345678", isRequired: false, section: "Documents d'identité" },
  // Contact
  { id: "12", key: "phone", label: "Téléphone", type: "TEXT", placeholder: "+216 XX XXX XXX", isRequired: true, section: "Coordonnées" },
  { id: "13", key: "email", label: "Email", type: "EMAIL", placeholder: "vous@exemple.com", isRequired: true, section: "Coordonnées" },
  { id: "14", key: "address", label: "Adresse complète", type: "TEXTAREA", placeholder: "Rue, Ville, Code postal", isRequired: true, section: "Coordonnées" },
  // Professional
  { id: "15", key: "profession", label: "Profession", type: "TEXT", placeholder: "Ingénieur", isRequired: true, section: "Situation professionnelle" },
  { id: "16", key: "employer", label: "Employeur", type: "TEXT", placeholder: "Société XYZ", isRequired: false, section: "Situation professionnelle" },
  { id: "17", key: "monthlyIncome", label: "Revenus mensuels (TND)", type: "NUMBER", placeholder: "3000", isRequired: true, section: "Situation professionnelle" },
  // Travel
  { id: "18", key: "travelPurpose", label: "But du voyage", type: "SELECT", isRequired: true, section: "Informations voyage",
    options: [{ value: "tourism", label: "Tourisme" }, { value: "business", label: "Affaires" }, { value: "family", label: "Famille" }, { value: "medical", label: "Médical" }, { value: "study", label: "Études" }] },
  { id: "19", key: "departureDate", label: "Date de départ prévue", type: "DATE", isRequired: true, section: "Informations voyage" },
  { id: "20", key: "returnDate", label: "Date de retour prévue", type: "DATE", isRequired: true, section: "Informations voyage" },
  { id: "21", key: "accommodation", label: "Hébergement prévu", type: "TEXTAREA", placeholder: "Nom hôtel, adresse...", isRequired: true, section: "Informations voyage" },
  { id: "22", key: "previousVisas", label: "Voyages précédents (5 ans)", type: "TEXTAREA", placeholder: "France 2022, Italie 2021...", isRequired: false, section: "Historique voyages" },
  { id: "23", key: "visaRefusals", label: "Refus de visa antérieurs", type: "SELECT", isRequired: true, section: "Historique voyages",
    options: [{ value: "no", label: "Non" }, { value: "yes", label: "Oui" }] },
];

export function ApplicationForm({ visaTypeId, initialData, onDataChange }: ApplicationFormProps) {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { register, control, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData ?? {},
  });

  // Watch all fields and notify parent
  const watchedValues = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onDataChange(watchedValues);
    }, 300);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(watchedValues)]);

  // Auto-save draft
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setLastSaved(new Date());
        setIsSaving(false);
      }, 500);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Group fields by section
  const sections = fields.reduce<Record<string, FormField[]>>((acc, field) => {
    const section = field.section ?? "Autres";
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "TEXTAREA":
        return (
          <Textarea
            {...register(field.key, { required: field.isRequired && `${field.label} est requis` })}
            placeholder={field.placeholder}
            className="resize-none rounded-xl border-border/50 bg-muted/20 min-h-[80px]"
          />
        );

      case "SELECT":
        return (
          <Controller
            name={field.key}
            control={control}
            rules={{ required: field.isRequired && `${field.label} est requis` }}
            render={({ field: f }) => (
              <Select value={f.value} onValueChange={f.onChange}>
                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-muted/20">
                  <SelectValue placeholder={`Sélectionnez...`} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      default:
        return (
          <Input
            {...register(field.key, { required: field.isRequired && `${field.label} est requis` })}
            type={field.type === "DATE" ? "date" : field.type === "NUMBER" ? "number" : field.type === "EMAIL" ? "email" : "text"}
            placeholder={field.placeholder}
            className={cn(
              "h-11 rounded-xl border-border/50 bg-muted/20",
              errors[field.key] && "border-red-500/50"
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with autosave indicator */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Formulaire de demande</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Remplissez toutes les informations requises
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Sauvegarde...
            </>
          ) : lastSaved ? (
            <>
              <Save className="h-3 w-3 text-teal-500" />
              Sauvegardé
            </>
          ) : null}
        </div>
      </div>

      {/* Form sections */}
      {Object.entries(sections).map(([sectionName, sectionFields]) => (
        <div key={sectionName} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {sectionName}
            </h3>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sectionFields.map((field) => (
              <div
                key={field.id}
                className={cn(
                  "space-y-2",
                  field.type === "TEXTAREA" && "sm:col-span-2"
                )}
              >
                <Label className="text-sm font-medium">
                  {field.label}
                  {field.isRequired && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </Label>

                {renderField(field)}

                {field.helpText && (
                  <p className="text-xs text-muted-foreground">{field.helpText}</p>
                )}

                {errors[field.key] && (
                  <p className="text-xs text-red-500">
                    {String(errors[field.key]?.message)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
