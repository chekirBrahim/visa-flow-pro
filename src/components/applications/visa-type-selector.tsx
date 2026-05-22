"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Users, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

interface VisaType {
  id: string;
  name: string;
  type: string;
  description: string;
  processingDays: number;
  agencyFee: number;
  consularFee: number;
  isMultipleEntry: boolean;
  maxStay?: number;
}

interface VisaTypeSelectorProps {
  countryId: string;
  selectedTypeId?: string;
  onSelect: (type: VisaType) => void;
}

const VISA_TYPE_ICONS: Record<string, string> = {
  TOURIST: "🏖️",
  BUSINESS: "💼",
  STUDENT: "🎓",
  WORK: "⚙️",
  FAMILY: "👨‍👩‍👧",
  TRANSIT: "✈️",
  MEDICAL: "🏥",
  SCHENGEN: "🇪🇺",
  EVISA: "💻",
  LONG_STAY: "🏠",
};

export function VisaTypeSelector({ countryId, selectedTypeId, onSelect }: VisaTypeSelectorProps) {
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!countryId) return;
    fetch(`/api/visa/countries/${countryId}/types`)
      .then((r) => r.json())
      .then((data) => setVisaTypes(data.data ?? []))
      .finally(() => setIsLoading(false));
  }, [countryId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Type de visa</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sélectionnez le type de visa correspondant à votre situation
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visaTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            onClick={() => onSelect(type)}
            className={cn(
              "relative flex flex-col items-start gap-4 rounded-2xl border p-5 text-left transition-all hover:shadow-md",
              selectedTypeId === type.id
                ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/10"
                : "border-border/50 bg-card hover:border-border"
            )}
          >
            {selectedTypeId === type.id && (
              <div className="absolute right-4 top-4">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{VISA_TYPE_ICONS[type.type] ?? "📋"}</span>
              <div>
                <h3 className="font-semibold">{type.name}</h3>
                {type.isMultipleEntry && (
                  <Badge className="mt-1 border-teal-500/30 bg-teal-500/10 text-xs text-teal-600">
                    Entrées multiples
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {type.description && (
              <p className="text-sm text-muted-foreground">{type.description}</p>
            )}

            {/* Details */}
            <div className="w-full space-y-2 border-t border-border/50 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Délai
                </span>
                <span className="font-medium">{type.processingDays} jours</span>
              </div>

              {type.maxStay && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    Séjour max
                  </span>
                  <span className="font-medium">{type.maxStay} jours</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frais agence</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(type.agencyFee)} TND
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frais consulaires</span>
                <span className="font-medium text-muted-foreground">
                  {formatCurrency(type.consularFee)} TND
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-end text-xs font-medium text-blue-500">
              Sélectionner
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
