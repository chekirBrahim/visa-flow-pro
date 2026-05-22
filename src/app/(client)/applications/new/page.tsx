"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelector } from "@/components/applications/country-selector";
import { VisaTypeSelector } from "@/components/applications/visa-type-selector";
import { ApplicationForm } from "@/components/applications/application-form";
import { DocumentUploader } from "@/components/applications/document-uploader";
import { ApplicationReview } from "@/components/applications/application-review";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Pays", description: "Choisissez votre destination" },
  { id: 2, label: "Type de visa", description: "Sélectionnez votre visa" },
  { id: 3, label: "Formulaire", description: "Remplissez vos informations" },
  { id: 4, label: "Documents", description: "Uploadez vos pièces justificatives" },
  { id: 5, label: "Récapitulatif", description: "Vérifiez et soumettez" },
];

interface FormData {
  countryId: string;
  countryCode: string;
  countryName: string;
  visaTypeId: string;
  visaTypeName: string;
  formData: Record<string, unknown>;
  documents: File[];
}

export default function NewApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const canGoNext = () => {
    if (currentStep === 1) return !!formData.countryId;
    if (currentStep === 2) return !!formData.visaTypeId;
    if (currentStep === 3) return true; // form validation handled inside
    if (currentStep === 4) return true;
    return false;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryId: formData.countryId,
          visaTypeId: formData.visaTypeId,
          formData: formData.formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/applications/${data.data.id}?submitted=true`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <h1 className="text-2xl font-bold">Nouvelle demande de visa</h1>
        <p className="text-muted-foreground">
          Suivez les étapes pour soumettre votre dossier
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    currentStep > step.id
                      ? "border-teal-500 bg-teal-500 text-white"
                      : currentStep === step.id
                      ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 hidden text-center sm:block">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      currentStep === step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px flex-1 transition-all duration-500",
                    currentStep > step.id
                      ? "bg-teal-500/50"
                      : "bg-border/50"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <CountrySelector
              selectedCountryId={formData.countryId}
              onSelect={(country) =>
                setFormData((prev) => ({
                  ...prev,
                  countryId: country.id,
                  countryCode: country.code,
                  countryName: country.name,
                  visaTypeId: undefined, // reset downstream
                }))
              }
            />
          )}

          {currentStep === 2 && formData.countryId && (
            <VisaTypeSelector
              countryId={formData.countryId}
              selectedTypeId={formData.visaTypeId}
              onSelect={(type) =>
                setFormData((prev) => ({
                  ...prev,
                  visaTypeId: type.id,
                  visaTypeName: type.name,
                }))
              }
            />
          )}

          {currentStep === 3 && formData.visaTypeId && (
            <ApplicationForm
              visaTypeId={formData.visaTypeId}
              initialData={formData.formData}
              onDataChange={(data) =>
                setFormData((prev) => ({ ...prev, formData: data }))
              }
            />
          )}

          {currentStep === 4 && formData.visaTypeId && (
            <DocumentUploader
              visaTypeId={formData.visaTypeId}
              applicationId={undefined}
            />
          )}

          {currentStep === 5 && (
            <ApplicationReview
              formData={formData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="rounded-xl gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
