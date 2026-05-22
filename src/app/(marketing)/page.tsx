"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation, type Variants } from "framer-motion";
import {
  ArrowRight, Shield, Zap, Globe, Star, CheckCircle2,
  ChevronRight, Clock, FileText, MessageSquare, BrainCircuit,
  TrendingUp, Users, Award, Lock, Play, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// =====================================================
// Animation Variants
// =====================================================
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// =====================================================
// Data
// =====================================================
const COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷", types: ["Schengen", "Visa D", "Étudiant"], delay: 0 },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", types: ["Schengen", "Travail", "Famille"], delay: 0.05 },
  { code: "IT", name: "Italie", flag: "🇮🇹", types: ["Schengen", "Tourisme", "Affaires"], delay: 0.1 },
  { code: "ES", name: "Espagne", flag: "🇪🇸", types: ["Schengen", "Étudiant", "Travail"], delay: 0.15 },
  { code: "US", name: "USA", flag: "🇺🇸", types: ["B1/B2", "F1 Étudiant", "H1B"], delay: 0.2 },
  { code: "CA", name: "Canada", flag: "🇨🇦", types: ["Touriste", "Étudiant", "Travail"], delay: 0.25 },
  { code: "UK", name: "Royaume-Uni", flag: "🇬🇧", types: ["Standard", "Étudiant", "Skilled"], delay: 0.3 },
];

const STATS = [
  { value: "12 000+", label: "Visas traités", icon: FileText },
  { value: "98.2%", label: "Taux de succès", icon: TrendingUp },
  { value: "4.9★", label: "Note clients", icon: Star },
  { value: "24h", label: "Réponse garantie", icon: Clock },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "IA Spécialisée Visa",
    description: "Assistant intelligent entraîné sur toutes les procédures consulaires tunisiennes. Analyse automatique de vos dossiers.",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    badge: "Nouveau",
  },
  {
    icon: Shield,
    title: "Sécurité Maximale",
    description: "Chiffrement AES-256, conformité RGPD, stockage sécurisé. Vos documents personnels sont protégés à chaque instant.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Zap,
    title: "Traitement Express",
    description: "Workflow automatisé, suivi temps réel, notifications instantanées. Votre dossier avance pendant que vous dormez.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Globe,
    title: "7+ Pays Couverts",
    description: "France, Italie, Allemagne, Espagne, USA, Canada et plus. Modules spécialisés pour chaque ambassade.",
    color: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-400",
  },
  {
    icon: MessageSquare,
    title: "Communication Directe",
    description: "Messagerie sécurisée avec votre conseiller dédié. Réponse garantie en moins de 24 heures ouvrables.",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: FileText,
    title: "Formulaires Intelligents",
    description: "Remplissage guidé étape par étape, détection automatique des erreurs, sauvegarde automatique du brouillon.",
    color: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Créez votre compte",
    description: "Inscription en 30 secondes avec Google ou votre email. Aucune carte bancaire requise.",
    icon: Users,
  },
  {
    number: "02",
    title: "Choisissez votre visa",
    description: "Sélectionnez le pays et le type de visa. Notre IA vous guide sur les meilleures options.",
    icon: Globe,
  },
  {
    number: "03",
    title: "Déposez vos documents",
    description: "Upload sécurisé, vérification automatique, liste dynamique des pièces manquantes.",
    icon: FileText,
  },
  {
    number: "04",
    title: "Suivez en temps réel",
    description: "Timeline interactive, notifications push, communication directe avec votre expert.",
    icon: TrendingUp,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarra B.",
    city: "Tunis",
    visa: "Visa France — Schengen",
    text: "Incroyable ! Mon visa approuvé en 8 jours. L'assistant IA m'a aidée à préparer un dossier parfait. Je recommande à 100%.",
    rating: 5,
    avatar: "SB",
  },
  {
    name: "Ahmed K.",
    city: "Sfax",
    visa: "Visa Canada — Touriste",
    text: "Service ultra professionnel. Le suivi en temps réel est rassurant. Mon conseiller a répondu à toutes mes questions en quelques heures.",
    rating: 5,
    avatar: "AK",
  },
  {
    name: "Fatima L.",
    city: "Sousse",
    visa: "Visa USA — B1/B2",
    text: "J'ai eu un refus ailleurs, puis j'ai essayé VisaFlow. L'IA a détecté les erreurs de mon ancien dossier. Visa obtenu du premier coup !",
    rating: 5,
    avatar: "FL",
  },
];

// =====================================================
// Components
// =====================================================
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountryCard({
  country,
}: {
  country: (typeof COUNTRIES)[0];
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-teal-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/10 group-hover:to-teal-500/10 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 text-4xl">{country.flag}</div>
        <h3 className="mb-3 text-lg font-semibold text-white">{country.name}</h3>
        <div className="space-y-1.5">
          {country.types.map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 text-xs text-white/60"
            >
              <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-teal-400" />
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/login?country=${country.code}`}
          className="text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          Commencer
        </Link>
        <ChevronRight className="h-4 w-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
      </div>
    </motion.div>
  );
}

// =====================================================
// Main Component
// =====================================================
export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#060b18]">

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#060b18] via-[#0d1b3e] to-[#060b18]" />
          <div className="absolute top-0 left-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-1/4 right-0 h-[500px] w-[500px] translate-x-1/4 rounded-full bg-teal-500/8 blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/6 blur-[100px]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">
                  Plateforme N°1 en Tunisie • IA intégrée
                </span>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Votre visa,{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                  approuvé
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-400 to-teal-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
              <br />
              plus vite que jamais
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
            >
              Plateforme SaaS premium pour le traitement de visas internationaux
              depuis la Tunisie. IA spécialisée, suivi temps réel, dossiers
              parfaits dès le premier essai.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Déposer ma demande
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>

              <Link href="#how-it-works">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 gap-2 rounded-2xl border border-white/10 px-8 text-base text-white/80 backdrop-blur-sm hover:border-white/20 hover:text-white hover:bg-white/5"
                >
                  <Play className="h-4 w-4" />
                  Comment ça marche
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40"
            >
              {[
                { icon: Lock, text: "Données 100% sécurisées" },
                { icon: CheckCircle2, text: "98% de taux de succès" },
                { icon: Clock, text: "Réponse en 24h" },
                { icon: Award, text: "Experts certifiés" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-teal-400/60" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 perspective-1000"
          >
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
              {/* Fake Dashboard Preview */}
              <div className="bg-[#0d1b3e]/90 backdrop-blur-xl">
                {/* Header bar */}
                <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <div className="mx-4 flex-1 rounded-lg bg-white/5 px-4 py-1.5 text-center text-xs text-white/30">
                    app.visaflowpro.tn/dashboard
                  </div>
                </div>

                {/* Dashboard content preview */}
                <div className="flex h-[400px]">
                  {/* Sidebar */}
                  <div className="hidden w-56 border-r border-white/5 bg-[#060b18]/60 p-4 md:block">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500">
                        <span className="text-xs font-bold text-white">VF</span>
                      </div>
                      <span className="text-sm font-semibold text-white">VisaFlow Pro</span>
                    </div>
                    {["Tableau de bord", "Mes dossiers", "Documents", "Messages", "Assistant IA"].map((item, i) => (
                      <div
                        key={item}
                        className={cn(
                          "mb-1 rounded-xl px-3 py-2 text-xs",
                          i === 0
                            ? "bg-gradient-to-r from-blue-600/80 to-teal-600/80 text-white font-medium"
                            : "text-white/40"
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <div className="mb-1 text-sm font-semibold text-white">Tableau de bord</div>
                        <div className="text-xs text-white/40">Bonjour, Ahmed K. 👋</div>
                      </div>
                      <div className="h-8 w-24 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-80" />
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                      {[
                        { label: "Dossiers actifs", value: "2", color: "from-blue-500/20 to-blue-600/20" },
                        { label: "Documents validés", value: "14/16", color: "from-teal-500/20 to-teal-600/20" },
                        { label: "Avancement", value: "87%", color: "from-violet-500/20 to-violet-600/20" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={cn("rounded-2xl bg-gradient-to-br p-4 border border-white/5", stat.color)}
                        >
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-white/50">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                      <div className="mb-3 text-xs font-medium text-white/60">Suivi dossier — Visa France</div>
                      <div className="space-y-3">
                        {[
                          { label: "Dossier soumis", done: true },
                          { label: "Documents vérifiés", done: true },
                          { label: "En traitement ambassade", active: true },
                          { label: "Décision finale", done: false },
                        ].map((step) => (
                          <div key={step.label} className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center",
                                step.done ? "bg-teal-500/80" : step.active ? "bg-blue-500 animate-pulse" : "bg-white/10"
                              )}
                            >
                              {step.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                              {step.active && <div className="h-2 w-2 rounded-full bg-white" />}
                            </div>
                            <div
                              className={cn(
                                "text-xs",
                                step.done ? "text-white/70" : step.active ? "text-white font-medium" : "text-white/30"
                              )}
                            >
                              {step.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow overlay */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="border-y border-white/5 bg-white/2 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== COUNTRIES ==================== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-16 text-center">
              <Badge className="mb-4 border-teal-500/30 bg-teal-500/10 text-teal-400">
                7 pays disponibles
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Choisissez votre
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  destination
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-white/50">
                Modules spécialisés pour chaque ambassade. Formulaires adaptés,
                documents spécifiques, procédures maîtrisées.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {COUNTRIES.map((country) => (
                <CountryCard key={country.code} country={country} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-16 text-center">
              <Badge className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-400">
                Fonctionnalités premium
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Tout ce dont vous
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  avez besoin
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-white/50">
                Une plateforme complète, pensée pour les Tunisiens qui veulent
                voyager sans stress et sans mauvaises surprises.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", feature.color)} />
                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5", feature.iconColor)}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      {feature.badge && (
                        <Badge className="border-violet-500/30 bg-violet-500/15 text-xs text-violet-300">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/55">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-16 text-center">
              <Badge className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">
                Simple comme bonjour
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Votre visa en 4 étapes
              </h2>
              <p className="mx-auto max-w-xl text-white/50">
                Processus optimisé pour maximiser vos chances de succès dès la
                première soumission.
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/30 via-teal-500/30 to-transparent lg:block" />

              <div className="space-y-12 lg:space-y-0">
                {STEPS.map((step, index) => (
                  <motion.div
                    key={step.number}
                    variants={fadeUp}
                    className={cn(
                      "flex flex-col items-center gap-8 lg:flex-row lg:gap-16",
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    )}
                  >
                    {/* Content */}
                    <div className={cn("flex-1", index % 2 === 1 ? "text-right" : "")}>
                      <div className={cn("mb-4 inline-flex items-center gap-3", index % 2 === 1 ? "flex-row-reverse" : "")}>
                        <span className="text-5xl font-bold text-white/10">
                          {step.number}
                        </span>
                        <div className="h-px w-12 bg-gradient-to-r from-blue-500 to-teal-500" />
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/50">{step.description}</p>
                    </div>

                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-teal-600/20 backdrop-blur-sm">
                        <step.icon className="h-10 w-10 text-blue-300" />
                      </div>
                      <div className="absolute inset-0 -z-10 rounded-3xl bg-blue-500/10 blur-xl" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-16 text-center">
              <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
                Avis clients
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ils nous font confiance
              </h2>
              <div className="mx-auto flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-white/60">4.9/5 · 2 400+ avis</span>
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <motion.div
                  key={testimonial.name}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-7 backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mb-6 text-sm leading-relaxed text-white/70">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-xs font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-white/40">
                        {testimonial.city} · {testimonial.visa}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== CTA FINAL ==================== */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <AnimatedSection>
            <motion.div
              variants={scaleIn}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-[#0d1b3e] to-teal-600/10 p-12 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5" />
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

              <div className="relative">
                <Badge className="mb-6 border-teal-500/30 bg-teal-500/15 text-teal-300">
                  Commencez gratuitement
                </Badge>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  Prêt à obtenir votre visa ?
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-white/60">
                  Rejoignez 12 000+ Tunisiens qui ont fait confiance à VisaFlow
                  Pro. Inscription gratuite, sans engagement.
                </p>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-10 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all"
                    >
                      Créer mon compte gratuitement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-14 rounded-2xl border border-white/10 px-8 text-white/70 hover:text-white hover:bg-white/5"
                    >
                      Parler à un expert
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
