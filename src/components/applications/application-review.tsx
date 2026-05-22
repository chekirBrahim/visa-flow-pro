"use client";

import { Loader2, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, COUNTRY_FLAGS, formatCurrency } from "@/lib/utils";

interface ApplicationReviewProps {
  formData: {
    countryName?: string;
    countryCode?: string;
    visaTypeName?: string;
    formData?: Record<string, unknown>;
  };
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ApplicationReview({ formData, onSubmit, isSubmitting }: ApplicationReviewProps) {
  const completedFields = Object.values(formData.formData ?? {}).filter(Boolean).length;
  const totalFields = Object.keys(formData.formData ?? {}).length;
  const completionRate = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  const warnings = [];
  if (completionRate < 80) {
    warnings.push("Certains champs importants ne sont pas remplis.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Récapitulatif de votre demande</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vérifiez vos informations avant de soumettre
        </p>
      </div>

      {/* Warnings */}
      {warnings.map((warning) => (
        <div key={warning} className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      ))}

      {/* Summary card */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border/50 bg-muted/20 px-6 py-5">
          <span className="text-3xl">{COUNTRY_FLAGS[formData.countryCode ?? ""] ?? "🌍"}</span>
          <div>
            <h3 className="font-semibold">{formData.countryName}</h3>
            <p className="text-sm text-muted-foreground">{formData.visaTypeName}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-muted-foreground">Complétion</div>
            <div className={cn("text-2xl font-bold", completionRate >= 80 ? "text-teal-500" : "text-amber-500")}>
              {completionRate}%
            </div>
          </div>
        </div>

        {/* Form data summary */}
        <div className="px-6 py-5">
          <h4 className="mb-4 text-sm font-medium text-muted-foreground">Informations saisies</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(formData.formData ?? {})
              .filter(([, v]) => v)
              .slice(0, 10)
              .map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-teal-500" />
                  <span className="text-sm capitalize text-muted-foreground">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                  </span>
                  <span className="text-sm font-medium truncate">{String(value)}</span>
                </div>
              ))}
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="px-6 py-5">
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">Récapitulatif des frais</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frais d'agence</span>
              <span className="font-medium">Contactez-nous</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frais consulaires</span>
              <span className="font-medium">Selon ambassade</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total estimé</span>
              <span className="text-blue-500">Sur devis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 text-sm text-muted-foreground">
        <p>En soumettant cette demande, vous confirmez que toutes les informations fournies sont exactes et complètes. Toute fausse déclaration peut entraîner le rejet de votre demande.</p>
      </div>

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="h-14 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Soumission en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Soumettre ma demande
          </>
        )}
      </Button>
    </div>
  );
}
