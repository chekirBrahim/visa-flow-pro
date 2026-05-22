"use client";

import Link from "next/link";
import { Plus, MessageSquare, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/ai-assistant">
        <Button variant="outline" size="sm" className="hidden rounded-xl gap-2 sm:flex">
          <BrainCircuit className="h-4 w-4 text-violet-400" />
          Assistant IA
        </Button>
      </Link>
      <Link href="/messages">
        <Button variant="outline" size="sm" className="hidden rounded-xl gap-2 sm:flex">
          <MessageSquare className="h-4 w-4" />
          Messages
        </Button>
      </Link>
      <Link href="/applications/new">
        <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle demande
        </Button>
      </Link>
    </div>
  );
}
