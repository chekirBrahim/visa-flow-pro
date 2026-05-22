import Link from "next/link";
import { Globe } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060b18]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] translate-x-1/4 rounded-full bg-teal-500/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative flex items-center justify-center pt-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-lg shadow-blue-500/30">
            <Globe className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">VisaFlow Pro</span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
