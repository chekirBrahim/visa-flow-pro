"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, MessageSquare, BrainCircuit,
  Calendar, Bell, Settings, LogOut, Globe, ChevronLeft,
  User, Plus, HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/applications", icon: FileText, label: "Mes dossiers", badge: "2" },
  { href: "/messages", icon: MessageSquare, label: "Messages", badge: "3" },
  { href: "/ai-assistant", icon: BrainCircuit, label: "Assistant IA", isNew: true },
  { href: "/appointments", icon: Calendar, label: "Rendez-vous" },
];

const BOTTOM_ITEMS = [
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
  { href: "/help", icon: HelpCircle, label: "Aide" },
];

interface ClientSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role: string;
  };
}

export function ClientSidebar({ user }: ClientSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] overflow-hidden"
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 shadow-md shadow-blue-500/25">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white">VisaFlow Pro</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500">
              <Globe className="h-4 w-4 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isCollapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New Application CTA */}
        <div className="px-3 pt-4">
          <Link href="/applications/new">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/25"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Nouvelle demande</TooltipContent>
              </Tooltip>
            ) : (
              <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle demande
              </Button>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 pt-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                        isActive
                          ? "bg-gradient-to-r from-blue-600/80 to-teal-600/80 text-white shadow-md"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/80 to-teal-600/80 text-white shadow-md shadow-blue-500/20"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 p-0 text-xs text-blue-300">
                    {item.badge}
                  </Badge>
                )}
                {item.isNew && (
                  <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-xs font-medium text-teal-300">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border px-3 py-4 space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* User profile */}
          <div className="mt-2 pt-2 border-t border-sidebar-border/50">
            <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2", !isCollapsed && "")}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-teal-500 text-white text-xs font-bold">
                  {getInitials(user.name ?? user.email)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-sidebar-foreground truncate">
                    {user.name ?? user.email}
                  </div>
                  <div className="text-xs text-sidebar-foreground/40 truncate">
                    {user.email}
                  </div>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sidebar-foreground/40 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
