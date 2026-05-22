"use client";

import Link from "next/link";
import { Bell, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  user: { name?: string | null; email: string };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-background/95 px-6 backdrop-blur">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Recherche globale..."
            className="h-9 rounded-xl border-border/50 bg-muted/30 pl-9 text-sm"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white">
            5
          </Badge>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" asChild>
          <Link href="/admin/settings">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          {user.name ?? user.email}
        </div>
      </div>
    </header>
  );
}
