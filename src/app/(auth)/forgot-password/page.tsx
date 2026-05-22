"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-6"
    >
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-2xl mb-4">
          🛂
        </div>
        <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {sent
            ? "Vérifiez votre boîte mail"
            : "Entrez votre email pour recevoir un lien de réinitialisation"}
        </p>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center space-y-3"
        >
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <p className="font-semibold">Email envoyé !</p>
          <p className="text-sm text-muted-foreground">
            Un lien de réinitialisation a été envoyé à{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>.
            Vérifiez votre boîte mail (et vos spams).
          </p>
          <Button
            asChild
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white"
          >
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label>Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="vous@exemple.com"
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
}
