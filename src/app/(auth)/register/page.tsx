"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  password: z.string()
    .min(8, "Minimum 8 caractères")
    .regex(/[A-Z]/, "Doit contenir une majuscule")
    .regex(/[0-9]/, "Doit contenir un chiffre"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val, "Vous devez accepter les conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const PASSWORD_RULES = [
  { label: "8 caractères minimum", regex: /.{8,}/ },
  { label: "Une lettre majuscule", regex: /[A-Z]/ },
  { label: "Un chiffre", regex: /[0-9]/ },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const watchedPassword = watch("password", "");

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message ?? "Erreur lors de l'inscription");
        return;
      }

      // Auto sign-in after registration
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl shadow-2xl shadow-black/30">
        {/* Header */}
        <div className="border-b border-white/8 px-8 py-8">
          <h1 className="text-2xl font-bold text-white">Créer votre compte</h1>
          <p className="mt-1 text-sm text-white/50">
            Rejoignez 12 000+ Tunisiens sur VisaFlow Pro
          </p>
        </div>

        <div className="px-8 py-8">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 h-12"
            onClick={() => { setIsGoogleLoading(true); signIn("google", { callbackUrl: "/dashboard" }); }}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            S'inscrire avec Google
          </Button>

          <div className="my-6 flex items-center gap-4">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-xs text-white/30">ou</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Prénom</Label>
                <Input
                  {...register("firstName")}
                  placeholder="Mohamed"
                  className={cn("h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30", errors.firstName && "border-red-500/50")}
                />
                {errors.firstName && <p className="text-xs text-red-400">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/80">Nom</Label>
                <Input
                  {...register("lastName")}
                  placeholder="Ben Ali"
                  className={cn("h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30", errors.lastName && "border-red-500/50")}
                />
                {errors.lastName && <p className="text-xs text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="vous@exemple.com"
                className={cn("h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30", errors.email && "border-red-500/50")}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Téléphone <span className="text-white/30">(optionnel)</span></Label>
              <Input
                {...register("phone")}
                type="tel"
                placeholder="+216 XX XXX XXX"
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Mot de passe</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn("h-11 rounded-2xl border-white/10 bg-white/5 pr-12 text-white placeholder:text-white/30", errors.password && "border-red-500/50")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength */}
              {watchedPassword && (
                <div className="space-y-1.5 mt-2">
                  {PASSWORD_RULES.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className={cn("h-3 w-3", rule.regex.test(watchedPassword) ? "text-teal-400" : "text-white/20")} />
                      <span className={rule.regex.test(watchedPassword) ? "text-white/60" : "text-white/30"}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">Confirmer le mot de passe</Label>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className={cn("h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30", errors.confirmPassword && "border-red-500/50")}
              />
              {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                {...register("terms")}
                type="checkbox"
                id="terms"
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 checked:bg-blue-600"
              />
              <label htmlFor="terms" className="text-xs text-white/50 leading-relaxed">
                J'accepte les{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">conditions d'utilisation</Link>
                {" "}et la{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">politique de confidentialité</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
