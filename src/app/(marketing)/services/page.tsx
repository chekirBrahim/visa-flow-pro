"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Clock, CheckCircle2, Users, FileText,
  Globe, Shield, BrainCircuit, Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRY_FLAGS } from "@/lib/utils";

const SERVICES = [
  {
    flag: "🇫🇷",
    country: "France",
    code: "FR",
    types: ["Visa Schengen (C)", "Visa Long Séjour (D)", "Visa Étudiant", "Visa Travail"],
    center: "TLSContact Tunis",
    delay: 15,
    fee: 350,
    description: "Visa Schengen et long séjour pour la France. Expert en procédure Campus France pour les étudiants.",
  },
  {
    flag: "🇩🇪",
    country: "Allemagne",
    code: "DE",
    types: ["Visa Schengen", "Visa Travail qualifié", "Visa Famille", "Visa Étudiant"],
    center: "VFS Global Tunis",
    delay: 15,
    fee: 350,
    description: "Allemagne : leader économique européen. Fort taux d'acceptation pour les profils qualifiés tunisiens.",
  },
  {
    flag: "🇮🇹",
    country: "Italie",
    code: "IT",
    types: ["Visa Schengen", "Visa Tourisme", "Visa Affaires", "Visa Famille"],
    center: "VFS Global Tunis",
    delay: 15,
    fee: 320,
    description: "Visa Schengen Italie. Procédure optimisée pour les touristes et familles tunisiennes.",
  },
  {
    flag: "🇪🇸",
    country: "Espagne",
    code: "ES",
    types: ["Visa Schengen", "Visa Étudiant", "Visa Travail", "Visa Famille"],
    center: "VFS Global Tunis",
    delay: 15,
    fee: 320,
    description: "L'Espagne accueille de nombreux Tunisiens. Expertise en visa de regroupement familial.",
  },
  {
    flag: "🇺🇸",
    country: "USA",
    code: "US",
    types: ["Visa B1/B2 Touriste", "Visa F1 Étudiant", "Visa J1 Échange", "Visa H1B Travail"],
    center: "Ambassade US Tunis",
    delay: 60,
    fee: 800,
    description: "Visa américain : le plus exigeant. Notre taux de succès est de 78% grâce à notre préparation entretien.",
  },
  {
    flag: "🇨🇦",
    country: "Canada",
    code: "CA",
    types: ["Visa Touriste (VRT)", "Permis Étudiant", "Permis Travail", "Résidence Permanente"],
    center: "VFS Global Tunis",
    delay: 45,
    fee: 600,
    description: "Immigration canadienne : nous gérons toutes les étapes IRCC, de l'eTA au permis de travail.",
  },
  {
    flag: "🇬🇧",
    country: "Royaume-Uni",
    code: "UK",
    types: ["Visa Standard", "Visa Étudiant", "Visa Skilled Worker", "Visa Famille"],
    center: "TLSContact Tunis",
    delay: 15,
    fee: 400,
    description: "Post-Brexit, le Royaume-Uni a son propre système de points. Notre équipe maîtrise les nouvelles règles UK.",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">
            Nos services
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            7 pays, une expertise
          </h1>
          <p className="mx-auto max-w-2xl text-white/60">
            Des modules spécialisés pour chaque ambassade, avec des formulaires adaptés,
            des procédures maîtrisées et des experts dédiés.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.code}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-7 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/5 hover:shadow-xl hover:shadow-blue-500/5"
            >
              {/* Flag + Country */}
              <div className="mb-5 flex items-start gap-4">
                <span className="text-4xl">{service.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{service.country}</h3>
                  <p className="text-xs text-white/50">{service.center}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mb-5 text-sm leading-relaxed text-white/60">{service.description}</p>

              {/* Visa types */}
              <div className="mb-5 space-y-2">
                {service.types.map((type) => (
                  <div key={type} className="flex items-center gap-2 text-xs text-white/70">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-teal-400" />
                    {type}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mb-5 grid grid-cols-2 gap-3 border-t border-white/8 pt-5">
                <div>
                  <div className="text-xs text-white/40">Délai moyen</div>
                  <div className="text-sm font-semibold text-white">{service.delay} jours</div>
                </div>
                <div>
                  <div className="text-xs text-white/40">Frais agence</div>
                  <div className="text-sm font-semibold text-white">{service.fee} TND</div>
                </div>
              </div>

              {/* CTA */}
              <Link href={`/register?country=${service.code}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-2xl border border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                >
                  Commencer ma demande
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-teal-600/5 p-10 text-center"
        >
          <Globe className="mx-auto mb-4 h-10 w-10 text-blue-400" />
          <h2 className="mb-2 text-2xl font-bold text-white">Votre pays n'est pas listé ?</h2>
          <p className="mb-6 text-white/60">
            Nous couvrons également d'autres destinations sur demande. Contactez-nous pour un devis personnalisé.
          </p>
          <Link href="/contact">
            <Button className="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 text-white">
              Nous contacter
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
