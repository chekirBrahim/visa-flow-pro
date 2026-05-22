"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Plus, Edit2, Trash2, ChevronDown, ChevronRight,
  Clock, DollarSign, Users, CheckCircle2, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface VisaType {
  id: string;
  name: string;
  code: string;
  description: string | null;
  processingDays: number;
  fee: number;
  agencyFee: number;
  isActive: boolean;
}

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string | null;
  isActive: boolean;
  types: VisaType[];
  _count: { applications: number };
}

interface CountriesManagerProps {
  countries: Country[];
}

export function CountriesManager({ countries: initialCountries }: CountriesManagerProps) {
  const [countries, setCountries] = useState(initialCountries);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [addingType, setAddingType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (countryId: string, current: boolean) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === countryId ? { ...c, isActive: !current } : c))
    );
    toast.success(`Pays ${current ? "désactivé" : "activé"}`);
  };

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl">
          <Plus className="h-4 w-4" />
          Ajouter un pays
        </Button>
      </div>

      {/* Countries list */}
      <div className="space-y-3">
        {filtered.map((country) => (
          <motion.div
            key={country.id}
            layout
            className="overflow-hidden rounded-2xl border border-border/50 bg-card"
          >
            {/* Country header */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === country.id ? null : country.id)}
            >
              <span className="text-3xl">{country.flag ?? "🌍"}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{country.name}</span>
                  <Badge variant="outline" className="text-xs">{country.code}</Badge>
                  {!country.isActive && (
                    <Badge variant="destructive" className="text-xs">Inactif</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {country._count.applications} dossiers
                  </span>
                  <span>{country.types.length} types de visa</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={country.isActive}
                  onCheckedChange={() => toggleActive(country.id, country.isActive)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); setEditingCountry(country); }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {expanded === country.id ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Visa types */}
            <AnimatePresence>
              {expanded === country.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Types de visa</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs rounded-lg gap-1"
                        onClick={() => setAddingType(country.id)}
                      >
                        <Plus className="h-3 w-3" />
                        Ajouter
                      </Button>
                    </div>

                    {country.types.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun type de visa configuré
                      </p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {country.types.map((type) => (
                          <div
                            key={type.id}
                            className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{type.name}</span>
                                {type.isActive ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {type.processingDays}j
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {type.agencyFee} TND
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Edit Country Dialog */}
      <Dialog open={!!editingCountry} onOpenChange={() => setEditingCountry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le pays</DialogTitle>
          </DialogHeader>
          {editingCountry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input defaultValue={editingCountry.name} />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input defaultValue={editingCountry.code} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emoji drapeau</Label>
                <Input defaultValue={editingCountry.flag ?? ""} placeholder="🇫🇷" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCountry(null)}>Annuler</Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white"
              onClick={() => { toast.success("Pays mis à jour"); setEditingCountry(null); }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
