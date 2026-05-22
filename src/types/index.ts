// ─── User Types ────────────────────────────────────────────────────────────────
export type UserRole = "CLIENT" | "AGENT" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  nationality: string | null;
  passportNumber: string | null;
  cinNumber: string | null;
  createdAt: Date;
}

// ─── Application Types ─────────────────────────────────────────────────────────
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "DOCUMENTS_PENDING"
  | "DOCUMENTS_REVIEW"
  | "IN_PROCESS"
  | "EMBASSY_SUBMITTED"
  | "INTERVIEW_SCHEDULED"
  | "APPROVED"
  | "REJECTED"
  | "READY_FOR_PICKUP"
  | "DELIVERED"
  | "CANCELLED"
  | "ON_HOLD";

export type CountryCode = "FR" | "DE" | "IT" | "ES" | "US" | "CA" | "GB";

export interface Application {
  id: string;
  referenceNumber: string;
  userId: string;
  countryCode: CountryCode;
  visaType: string;
  status: ApplicationStatus;
  formData: Record<string, unknown>;
  submittedAt: Date | null;
  estimatedCompletion: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<User, "id" | "name" | "email" | "avatar">;
}

// ─── Document Types ────────────────────────────────────────────────────────────
export type DocumentStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface Document {
  id: string;
  applicationId: string;
  name: string;
  type: string;
  url: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  notes: string | null;
  createdAt: Date;
}

// ─── Message Types ─────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender?: Pick<User, "id" | "name" | "avatar" | "role">;
}

// ─── Notification Types ────────────────────────────────────────────────────────
export type NotificationType =
  | "APPLICATION_STATUS"
  | "MESSAGE_RECEIVED"
  | "DOCUMENT_REQUIRED"
  | "APPOINTMENT_SCHEDULED"
  | "PAYMENT_REQUIRED"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

// ─── API Response Types ────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Next Auth Extension ───────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: UserRole;
    };
  }
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
