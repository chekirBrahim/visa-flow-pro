"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CONTACT_INFO = [
  { icon: Phone, label: "Téléphone", value: "+216 71 XXX XXX", sub: "Lun-Ven 8h-18h" },
  { icon: Mail, label: "Email", value: "contact@visaflowpro.tn", sub: "Réponse sous 24h" },
  { icon: MapPin, label: "Adresse", value: "Avenue Habib Bourguiba", sub: "Tunis 1001, Tunisie" },
  { icon: Clock, label: "Horaires", value: "Lun - Ven : 8h - 18h", sub: "Sam : 9h - 13h" },
];

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 1000)); // Simulate API call
    toast.success("Message envoyé ! Nous vous répondrons dans les 24 heures.");
    reset();
  };

  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">Contact</Badge>
          <h1 className="mb-4 text-4xl font-bold text-white">Parlons de votre projet visa</h1>
          <p className="text-white/60">Notre équipe d'experts est à votre disposition.</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {CONTACT_INFO.map((info) => (
                <div
                  key={info.label}
                  className="rounded-2xl border border-white/8 bg-white/3 p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium text-white/60">{info.label}</div>
                  <div className="text-sm font-semibold text-white">{info.value}</div>
                  <div className="text-xs text-white/40">{info.sub}</div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-3xl border border-white/8">
              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-900/20 to-teal-900/10">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                  <p className="text-sm text-white/60">Tunis, Tunisie</p>
                  <p className="text-xs text-white/40">Carte interactive bientôt disponible</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-8 backdrop-blur-xl"
          >
            <h2 className="mb-6 text-xl font-semibold text-white">Envoyer un message</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white/80">Nom complet *</Label>
                  <Input
                    {...register("name", { required: true })}
                    placeholder="Mohamed Ben Ali"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white/80">Email *</Label>
                  <Input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="vous@exemple.com"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Téléphone</Label>
                <Input
                  {...register("phone")}
                  placeholder="+216 XX XXX XXX"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Sujet *</Label>
                <Input
                  {...register("subject", { required: true })}
                  placeholder="Demande d'information — Visa France"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Message *</Label>
                <Textarea
                  {...register("message", { required: true })}
                  placeholder="Décrivez votre situation et vos questions..."
                  className="min-h-[120px] resize-none rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 font-semibold text-white shadow-lg shadow-blue-500/25"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
