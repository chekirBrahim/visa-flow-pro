"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Plus, Edit2, Trash2, GripVertical, Eye,
  Type, Hash, Calendar, List, CheckSquare, ToggleLeft,
  Copy, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FieldType = "TEXT" | "NUMBER" | "DATE" | "SELECT" | "CHECKBOX" | "BOOLEAN" | "TEXTAREA" | "EMAIL" | "PHONE";

const FIELD_ICONS: Record<FieldType, React.ElementType> = {
  TEXT: Type,
  NUMBER: Hash,
  DATE: Calendar,
  SELECT: List,
  CHECKBOX: CheckSquare,
  BOOLEAN: ToggleLeft,
  TEXTAREA: FileText,
  EMAIL: Type,
  PHONE: Type,
};

const FIELD_COLORS: Record<FieldType, string> = {
  TEXT: "bg-blue-500/10 text-blue-400",
  NUMBER: "bg-purple-500/10 text-purple-400",
  DATE: "bg-green-500/10 text-green-400",
  SELECT: "bg-orange-500/10 text-orange-400",
  CHECKBOX: "bg-teal-500/10 text-teal-400",
  BOOLEAN: "bg-pink-500/10 text-pink-400",
  TEXTAREA: "bg-indigo-500/10 text-indigo-400",
  EMAIL: "bg-cyan-500/10 text-cyan-400",
  PHONE: "bg-yellow-500/10 text-yellow-400",
};

interface FormField {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  required: boolean;
  order: number;
  placeholder: string | null;
  helpText: string | null;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  fields: FormField[];
  visaType: { name: string; country: { name: string; flag: string | null } } | null;
  _count: { applications: number };
}

interface FormBuilderProps {
  templates: FormTemplate[];
}

export function FormBuilder({ templates: initialTemplates }: FormBuilderProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    initialTemplates[0] ?? null
  );
  const [addingField, setAddingField] = useState(false);
  const [newField, setNewField] = useState({
    label: "",
    name: "",
    type: "TEXT" as FieldType,
    required: false,
    placeholder: "",
    helpText: "",
  });

  const handleAddField = () => {
    if (!newField.label || !newField.name || !selectedTemplate) return;
    const field: FormField = {
      id: `temp_${Date.now()}`,
      ...newField,
      order: selectedTemplate.fields.length,
      placeholder: newField.placeholder || null,
      helpText: newField.helpText || null,
    };
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, fields: [...t.fields, field] }
          : t
      )
    );
    setSelectedTemplate((prev) =>
      prev ? { ...prev, fields: [...prev.fields, field] } : prev
    );
    setNewField({ label: "", name: "", type: "TEXT", required: false, placeholder: "", helpText: "" });
    setAddingField(false);
    toast.success("Champ ajouté");
  };

  const removeField = (fieldId: string) => {
    if (!selectedTemplate) return;
    const updated = selectedTemplate.fields.filter((f) => f.id !== fieldId);
    setSelectedTemplate({ ...selectedTemplate, fields: updated });
    toast.success("Champ supprimé");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Templates list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Formulaires</span>
          <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg gap-1">
            <Plus className="h-3 w-3" />
            Nouveau
          </Button>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Aucun formulaire créé</p>
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={cn(
                  "w-full text-left rounded-xl border p-3.5 transition-all",
                  selectedTemplate?.id === template.id
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border/50 bg-card hover:border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{template.name}</p>
                    {template.visaType && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {template.visaType.country.flag} {template.visaType.country.name} —{" "}
                        {template.visaType.name}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {template.fields.length} champs
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs",
                      template.isActive ? "text-green-500" : "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        template.isActive ? "bg-green-500" : "bg-muted-foreground"
                      )}
                    />
                    {template.isActive ? "Actif" : "Inactif"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {template._count.applications} utilisations
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form editor */}
      <div className="lg:col-span-2 space-y-4">
        {!selectedTemplate ? (
          <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-border/50">
            <p className="text-muted-foreground">Sélectionnez un formulaire</p>
          </div>
        ) : (
          <>
            {/* Template header */}
            <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4">
              <div>
                <h3 className="font-semibold">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.fields.length} champs · {selectedTemplate._count.applications} soumissions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  Aperçu
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5 text-xs">
                  <Settings className="h-3.5 w-3.5" />
                  Paramètres
                </Button>
              </div>
            </div>

            {/* Fields list */}
            <div className="space-y-2">
              <AnimatePresence>
                {selectedTemplate.fields.map((field, idx) => {
                  const Icon = FIELD_ICONS[field.type] ?? Type;
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span
                        className={cn(
                          "flex items-center justify-center h-7 w-7 rounded-lg text-xs",
                          FIELD_COLORS[field.type] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{field.label}</span>
                          {field.required && (
                            <span className="text-xs text-red-500">*requis</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{field.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{field.type}</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add field button */}
              {!addingField ? (
                <button
                  onClick={() => setAddingField(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 p-3.5 text-sm text-muted-foreground hover:border-blue-500/50 hover:text-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un champ
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-4"
                >
                  <h4 className="text-sm font-medium">Nouveau champ</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Libellé</Label>
                      <Input
                        placeholder="Ex: Nom de famille"
                        value={newField.label}
                        onChange={(e) => {
                          const label = e.target.value;
                          setNewField((prev) => ({
                            ...prev,
                            label,
                            name: prev.name || label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                          }));
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nom technique</Label>
                      <Input
                        placeholder="last_name"
                        value={newField.name}
                        onChange={(e) => setNewField((prev) => ({ ...prev, name: e.target.value }))}
                        className="h-8 text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={newField.type}
                        onValueChange={(v) => setNewField((prev) => ({ ...prev, type: v as FieldType }))}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "BOOLEAN", "TEXTAREA", "EMAIL", "PHONE"] as FieldType[]).map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        placeholder="Texte indicatif..."
                        value={newField.placeholder}
                        onChange={(e) => setNewField((prev) => ({ ...prev, placeholder: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newField.required}
                      onCheckedChange={(v) => setNewField((prev) => ({ ...prev, required: v }))}
                    />
                    <Label className="text-sm cursor-pointer">Champ obligatoire</Label>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      onClick={handleAddField}
                    >
                      Ajouter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg"
                      onClick={() => setAddingField(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
