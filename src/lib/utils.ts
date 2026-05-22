import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";

// =================================================
// Tailwind Class Merge
// =================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =================================================
// Reference Number Generation
// =================================================
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = nanoid(8).toUpperCase();
  return `VFP-${year}-${random}`;
}

// =================================================
// Date Formatting
// =================================================
const localeMap = { fr, ar, en: enUS };

export function formatDate(
  date: Date | string,
  fmt = "dd/MM/yyyy",
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt, { locale: localeMap[locale] });
}

export function formatRelativeDate(
  date: Date | string,
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: localeMap[locale] });
}

// =================================================
// File Utilities
// =================================================
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function isPdfFile(mimeType: string): boolean {
  return mimeType === "application/pdf";
}

export function getFileIcon(mimeType: string): string {
  if (isImageFile(mimeType)) return "image";
  if (isPdfFile(mimeType)) return "pdf";
  if (mimeType.includes("word")) return "word";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "excel";
  return "file";
}

// =================================================
// Currency Formatting
// =================================================
export function formatCurrency(
  amount: number,
  currency: "TND" | "EUR" | "USD" = "TND"
): string {
  const formatters = {
    TND: new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", minimumFractionDigits: 3 }),
    EUR: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }),
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  };
  return formatters[currency].format(amount);
}

// =================================================
// Application Status
// =================================================
export const APPLICATION_STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:                { label: "Brouillon",            color: "text-gray-600",   bg: "bg-gray-100" },
  SUBMITTED:            { label: "Soumis",               color: "text-blue-600",   bg: "bg-blue-100" },
  UNDER_REVIEW:         { label: "En cours de révision", color: "text-yellow-600", bg: "bg-yellow-100" },
  DOCUMENTS_REQUESTED:  { label: "Documents demandés",   color: "text-orange-600", bg: "bg-orange-100" },
  DOCUMENTS_RECEIVED:   { label: "Documents reçus",      color: "text-indigo-600", bg: "bg-indigo-100" },
  IN_PROCESS:           { label: "En traitement",        color: "text-purple-600", bg: "bg-purple-100" },
  AWAITING_APPOINTMENT: { label: "Attente RDV",          color: "text-cyan-600",   bg: "bg-cyan-100" },
  APPOINTMENT_SCHEDULED:{ label: "RDV programmé",        color: "text-teal-600",   bg: "bg-teal-100" },
  SUBMITTED_TO_EMBASSY: { label: "Déposé ambassade",     color: "text-violet-600", bg: "bg-violet-100" },
  APPROVED:             { label: "Approuvé",             color: "text-green-600",  bg: "bg-green-100" },
  REJECTED:             { label: "Refusé",               color: "text-red-600",    bg: "bg-red-100" },
  CANCELLED:            { label: "Annulé",               color: "text-gray-500",   bg: "bg-gray-100" },
  REFUNDED:             { label: "Remboursé",            color: "text-pink-600",   bg: "bg-pink-100" },
};

export function getStatusInfo(status: string) {
  return APPLICATION_STATUS_LABELS[status] ?? {
    label: status,
    color: "text-gray-600",
    bg: "bg-gray-100",
  };
}

// =================================================
// Country Flags
// =================================================
export const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", DE: "🇩🇪", IT: "🇮🇹", ES: "🇪🇸",
  US: "🇺🇸", CA: "🇨🇦", UK: "🇬🇧", BE: "🇧🇪",
  NL: "🇳🇱", PT: "🇵🇹", SE: "🇸🇪", NO: "🇳🇴",
  DK: "🇩🇰", CH: "🇨🇭", AU: "🇦🇺", JP: "🇯🇵",
  CN: "🇨🇳", AE: "🇦🇪", SA: "🇸🇦", QA: "🇶🇦",
};

// =================================================
// Validation
// =================================================
export function isValidTunisianPhone(phone: string): boolean {
  return /^(\+216)?[2-9]\d{7}$/.test(phone.replace(/\s/g, ""));
}

export function isValidPassportNumber(passport: string): boolean {
  return /^[A-Z0-9]{6,9}$/.test(passport.toUpperCase());
}

export function isValidCIN(cin: string): boolean {
  return /^\d{8}$/.test(cin);
}

// =================================================
// Slugify
// =================================================
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// =================================================
// Truncate
// =================================================
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

// =================================================
// API Response Helpers
// =================================================
export function apiSuccess<T>(data: T, message?: string) {
  return { success: true, data, message };
}

export function apiError(message: string, code?: string, details?: unknown) {
  return { success: false, error: { message, code, details } };
}

// =================================================
// Debounce
// =================================================
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// =================================================
// Sleep
// =================================================
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =================================================
// Initials
// =================================================
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
