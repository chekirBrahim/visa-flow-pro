"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Users, Settings, Globe,
  BarChart3, MessageSquare, Calendar, LogOut,
  Shield, FormInput, Bell, Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
      { href: "/admin/applications", icon: FileText, label: "Dossiers" },
      { href: "/admin/users", icon: Users, label: "Utilisateurs" },
      { href: "/admin/messages", icon: MessageSquare, label: "Messagerie" },
      { href: "/admin/appointments", icon: Calendar, label: "Rendez-vous" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/countries", icon: Globe, label: "Pays & Visas" },
      { href: "/admin/forms", icon: FormInput, label: "Formulaires" },
      { href: "/admin/workflows", icon: Activity, label: "Workflows" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/admin/analytics", icon: BarChart3, label: "Statistiques" },
      { href: "/admin/audit-logs", icon: Shield, label: "Audit Logs" },
      { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    ],
  },
];

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
    role: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 shadow-md shadow-blue-500/25">
          <Globe className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">VisaFlow Pro</div>
          <div className="text-xs text-white/40">Administration</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/25">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/80 to-teal-600/80 text-white shadow-md shadow-blue-500/15"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs">
              {getInitials(user.name ?? user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white/80 truncate">{user.name ?? user.email}</div>
            <div className="text-xs text-white/30 capitalize">{user.role.toLowerCase()}</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
