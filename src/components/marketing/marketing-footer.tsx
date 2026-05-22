import Link from "next/link";
import { Globe, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  Services: [
    { label: "Visa France", href: "/services/france" },
    { label: "Visa Schengen", href: "/services/schengen" },
    { label: "Visa USA", href: "/services/usa" },
    { label: "Visa Canada", href: "/services/canada" },
    { label: "eVisa", href: "/services/evisa" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Carrières", href: "/careers" },
    { label: "Presse", href: "/press" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Assistant IA", href: "/register" },
    { label: "Guide visas", href: "/guide" },
  ],
  Légal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Confidentialité", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "RGPD", href: "/rgpd" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060b18]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500">
                <Globe className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">VisaFlow Pro</span>
            </Link>
            <p className="mb-6 text-sm text-white/50 leading-relaxed">
              Plateforme SaaS premium pour le traitement de visas internationaux depuis la Tunisie.
            </p>
            <div className="space-y-2 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>Avenue Habib Bourguiba, Tunis 1001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span>+216 71 XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span>contact@visaflowpro.tn</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold text-white">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} VisaFlow Pro. Tous droits réservés. Agence agréée Tunisie.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-white/40 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
