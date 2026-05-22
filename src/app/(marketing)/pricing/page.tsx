"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Zap, Shield, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Essentiel",
    price: "199",
    currency: "TND",
    description: "Pour les particuliers avec une demande simple",
    features: [
      "1 demande de visa",
      "Formulaire guidé",
      "Upload documents",
      "Suivi basique",
      "Support email",
    ],
    cta: "Commencer",
    gradient: "from-gray-500/10 to-gray-600/5",
    border: "border-border/50",
  },
  {
    name: "Premium",
    price: "350",
    currency: "TND",
    description: "Pour maximiser vos chances de succès",
    features: [
      "1 demande de visa",
      "Formulaire intelligent complet",
      "Vérification documents par expert",
      "Suivi temps réel",
      "Assistant IA illimité",
      "Communication directe conseiller",
      "Relance ambassade si nécessaire",
      "Garantie satisfaction",
    ],
    cta: "Recommandé",
    gradient: "from-blue-500/10 to-teal-500/5",
    border: "border-blue-500/30",
    isPopular: true,
  },
  {
    name: "Express",
    price: "550",
    currency: "TND",
    description: "Traitement urgent, résultat rapide",
    features: [
      "Tout Premium inclus",
      "Traitement prioritaire",
      "Dossier en 48h",
      "Appel téléphonique dédié",
      "Rendez-vous TLSContact prioritaire",
      "Suivi WhatsApp direct",
    ],
    cta: "Urgence",
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/30",
    badge: "Urgent",
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">
            Tarifs transparents
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-white">
            Choisissez votre formule
          </h1>
          <p className="mx-auto max-w-xl text-white/60">
            Frais d'agence uniquement. Les frais consulaires (payés à l'ambassade) sont en sus selon chaque pays.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-7",
                plan.gradient, plan.border,
                plan.isPopular && "shadow-xl shadow-blue-500/10 scale-[1.02]"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -right-8 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-teal-500 px-10 py-1 text-xs font-semibold text-white">
                  Populaire
                </div>
              )}
              {plan.badge && (
                <Badge className="mb-3 border-violet-500/30 bg-violet-500/15 text-violet-300">
                  {plan.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/50">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="ml-2 text-white/50">{plan.currency} TTC</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  className={cn(
                    "w-full rounded-2xl font-semibold",
                    plan.isPopular
                      ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/25"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-white/40"
        >
          * Les frais consulaires (payables à l'ambassade) varient : 100€ Schengen, 160$ USA, 100$ Canada.
          Ces frais ne sont pas inclus dans nos tarifs d'agence.
        </motion.p>
      </div>
    </div>
  );
}
