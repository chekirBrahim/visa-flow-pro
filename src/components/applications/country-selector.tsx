"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Euro, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, COUNTRY_FLAGS, formatCurrency } from "@/lib/utils";

interface Country {
  id: string;
  code: string;
  name: string;
  flag: string;
  processingDays: number;
  agencyFee: number;
  isFeatured: boolean;
}

interface CountrySelectorProps {
  selectedCountryId?: string;
  onSelect: (country: Country) => void;
}

export function CountrySelector({ selectedCountryId, onSelect }: CountrySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visa/countries")
      .then((r) => r.json())
      .then((data) => setCountries(data.data ?? []))
      .finally(() => setIsLoading(false));
  }, []);

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
        <h2 className="text-xl font-semibold">Choisissez votre pays de destination</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sélectionnez le pays pour lequel vous souhaitez obtenir un visa
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country, index) => (
          <motion.button
            key={country.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(country)}
            className={cn(
              "relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all hover:shadow-md",
              selectedCountryId === country.id
                ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/10"
                : "border-border/50 bg-card hover:border-border"
            )}
          >
            {/* Selected indicator */}
            {selectedCountryId === country.id && (
              <div className="absolute right-3 top-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
            )}

            {/* Featured badge */}
            {country.isFeatured && selectedCountryId !== country.id && (
              <div className="absolute right-3 top-3">
                <Badge className="border-amber-500/30 bg-amber-500/10 text-xs text-amber-500">
                  Populaire
                </Badge>
              </div>
            )}

            <div className="text-3xl">{COUNTRY_FLAGS[country.code] ?? country.flag ?? "🌍"}</div>

            <div>
              <h3 className="font-semibold">{country.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {country.processingDays} jours
                </span>
                <span className="flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  dès {formatCurrency(country.agencyFee)} TND
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
