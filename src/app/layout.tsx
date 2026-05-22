import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://visaflowpro.tn"
  ),
  title: {
    default: "VisaFlow Pro — Traitement de Visas Premium en Tunisie",
    template: "%s | VisaFlow Pro",
  },
  description:
    "Plateforme SaaS premium pour le traitement de visas internationaux depuis la Tunisie. France, Schengen, USA, Canada et plus. Service rapide, sécurisé et professionnel.",
  keywords: [
    "visa tunisie",
    "demande visa",
    "visa france tunisie",
    "visa schengen",
    "visa usa tunisie",
    "visa canada",
    "agence visa tunis",
    "traitement visa",
    "TLSContact",
    "VFS Global",
  ],
  authors: [{ name: "VisaFlow Pro" }],
  creator: "VisaFlow Pro",
  publisher: "VisaFlow Pro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    alternateLocale: ["en_US", "ar_TN"],
    url: "https://visaflowpro.tn",
    siteName: "VisaFlow Pro",
    title: "VisaFlow Pro — Traitement de Visas Premium en Tunisie",
    description:
      "Déposez et suivez vos demandes de visa en ligne. Service premium, rapide et sécurisé.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisaFlow Pro — Plateforme Visa Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisaFlow Pro",
    description: "Traitement de visas premium depuis la Tunisie",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  style: {
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  },
                }}
              />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
