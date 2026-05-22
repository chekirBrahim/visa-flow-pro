"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FAQ_CATEGORIES = [
  {
    label: "Général",
    items: [
      {
        q: "Combien de temps prend le traitement d'un visa ?",
        a: "Les délais varient selon le pays : Visa Schengen (France, Allemagne, Italie, Espagne) : 15 jours ouvrables minimum. Visa USA : 60-90 jours (entretien inclus). Visa Canada : 30-60 jours. Ces délais peuvent varier selon la période et le volume des demandes."
      },
      {
        q: "Garantissez-vous l'obtention du visa ?",
        a: "Non, aucune agence ne peut garantir l'obtention d'un visa car la décision finale appartient à l'ambassade. Cependant, notre expertise et notre IA vous permettent de maximiser significativement vos chances en présentant un dossier optimal et sans erreurs."
      },
      {
        q: "Que se passe-t-il en cas de refus ?",
        a: "En cas de refus, nous analysons les raisons et vous conseillons sur les étapes suivantes. Nous pouvons vous aider à préparer un recours ou une nouvelle demande corrigée. Notre taux de succès après recours est de 65%."
      },
    ],
  },
  {
    label: "Documents",
    items: [
      {
        q: "Quels documents sont généralement requis pour un visa Schengen ?",
        a: "Documents communs : passeport valide (+3 mois après retour), 2 photos biométriques, formulaire de demande, justificatif hébergement, billets d'avion, assurance voyage (min 30 000€), relevés bancaires (3 mois), justificatif emploi/revenus, lettre de motivation. La liste varie selon votre situation personnelle."
      },
      {
        q: "Les documents doivent-ils être traduits ?",
        a: "Les documents en arabe doivent généralement être traduits en français par un traducteur assermenté. Notre service inclut la vérification de vos documents et nous pouvons vous orienter vers des traducteurs agréés."
      },
      {
        q: "Puis-je uploader des scans ou faut-il les originaux ?",
        a: "Pour notre plateforme, des scans haute qualité suffisent pour la vérification préliminaire. Pour le dépôt physique au centre visa (TLSContact/VFS), les originaux seront requis le jour du rendez-vous."
      },
    ],
  },
  {
    label: "Paiement",
    items: [
      {
        q: "Quand dois-je payer ?",
        a: "Les frais d'agence sont payables à la soumission de votre dossier. Les frais consulaires sont payés directement à l'ambassade, séparément, lors de votre rendez-vous TLSContact/VFS Global."
      },
      {
        q: "Remboursez-vous en cas de refus ?",
        a: "Nos frais d'agence couvrent le service de préparation et de suivi du dossier. En cas de refus dû à une erreur de notre part, nous remboursons intégralement. Les frais consulaires (payés à l'ambassade) ne sont pas remboursables par VisaFlow Pro."
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/50">
          {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-5 py-4 text-sm text-white/60 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Général");

  const activeItems = FAQ_CATEGORIES.find((c) => c.label === activeCategory)?.items ?? [];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4 border-teal-500/30 bg-teal-500/10 text-teal-400">FAQ</Badge>
          <h1 className="mb-4 text-4xl font-bold text-white">Questions fréquentes</h1>
          <p className="text-white/60">Tout ce que vous devez savoir sur nos services visa.</p>
        </motion.div>

        {/* Category tabs */}
        <div className="mb-8 flex gap-2">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-all",
                activeCategory === cat.label
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-white/50 hover:text-white/70"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {activeItems.map((item) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FAQItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-3xl border border-white/8 bg-white/3 p-8 text-center"
        >
          <h3 className="mb-2 text-lg font-semibold text-white">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="mb-6 text-sm text-white/50">
            Notre équipe répond en moins de 24h.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Nous contacter
            </a>
            <a
              href="/ai-assistant"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Demander à l'IA
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
