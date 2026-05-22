import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// =====================================================
// Route Definitions
// =====================================================
const PUBLIC_ROUTES = ["/", "/services", "/pricing", "/faq", "/contact", "/blog"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const CLIENT_ROUTES = ["/dashboard", "/applications", "/messages", "/ai-assistant", "/appointments"];
const ADMIN_ROUTES = ["/admin"];
const API_PUBLIC = ["/api/auth", "/api/health", "/api/public"];

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Health check bypass
  if (pathname === "/api/health") {
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
               request.headers.get("x-real-ip") ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans une minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Skip auth for public API routes
  if (API_PUBLIC.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo =
        userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "AGENT"
          ? "/admin/dashboard"
          : "/dashboard";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }

  // Protect client routes
  if (CLIENT_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!["ADMIN", "SUPER_ADMIN", "AGENT"].includes(userRole ?? "")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|icons|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
